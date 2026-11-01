import { Router, Request, Response } from 'express';
import { db } from './db.js';
import { TOPICS, SKILLS, LESSONS, QUESTIONS, VETTED_VIDEOS } from './curriculumData.js';
import { gradeAnswer } from './grading.js';
import { determineNextActivity, handleAnswerAndAdvanceState } from './planner.js';
import {
  explainConceptWithAi,
  generateContextualHintWithAi,
  processUploadedDocumentWithAi
} from './ai.js';

export const apiRouter = Router();

// --- Auth & Profile Endpoints ---

apiRouter.post('/auth/register', (req: Request, res: Response) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  let parent = db.getParentByEmail(email);
  if (!parent) {
    parent = db.createParent(name.trim(), email.trim());
  }

  return res.json({ parent, token: `token_${parent.id}` });
});

apiRouter.post('/auth/login', (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  let parent = db.getParentByEmail(email);
  if (!parent) {
    parent = db.createParent('Parent User', email.trim());
  }

  return res.json({ parent, token: `token_${parent.id}` });
});

apiRouter.delete('/auth/account', (req: Request, res: Response) => {
  const { parentId } = req.body;
  if (!parentId) {
    return res.status(400).json({ error: 'Parent ID required' });
  }
  const success = db.deleteParentAccount(parentId);
  return res.json({ success, message: 'Parent account and all associated child data permanently deleted' });
});

// --- Children Endpoints ---

apiRouter.get('/children', (req: Request, res: Response) => {
  const parentId = (req.query.parentId as string) || 'parent_demo_01';
  const children = db.getChildrenForParent(parentId);
  return res.json(children);
});

apiRouter.post('/children', (req: Request, res: Response) => {
  const { parentId, name, age, grade, language, curriculum, subjects, accessibility, avatar } = req.body;
  if (!parentId || !name || !age) {
    return res.status(400).json({ error: 'Missing required child profile fields' });
  }

  const child = db.createChild({
    parentId,
    name: name.trim(),
    age: Number(age),
    grade: grade || 'Grade 1',
    language: language || 'en',
    curriculum: curriculum || 'cbse',
    subjects: subjects || ['Mathematics'],
    avatar: avatar || '🌟',
    accessibility: accessibility || {
      ttsEnabled: true,
      ttsSpeed: 1.0,
      dyslexiaFont: false,
      largeTouchTargets: false,
      soundEffects: true
    },
    diagnosticCompleted: false
  });

  return res.status(201).json(child);
});

apiRouter.get('/children/:child_id', (req: Request, res: Response) => {
  const child = db.getChild(req.params.child_id);
  if (!child) {
    return res.status(404).json({ error: 'Child not found' });
  }
  return res.json(child);
});

apiRouter.patch('/children/:child_id', (req: Request, res: Response) => {
  const child = db.updateChild(req.params.child_id, req.body);
  if (!child) {
    return res.status(404).json({ error: 'Child not found' });
  }
  return res.json(child);
});

apiRouter.delete('/children/:child_id', (req: Request, res: Response) => {
  const success = db.deleteChild(req.params.child_id);
  if (!success) {
    return res.status(404).json({ error: 'Child not found' });
  }
  return res.json({ success: true, message: 'Child profile and progress records removed' });
});

// --- Curriculum & Lesson Endpoints ---

apiRouter.get('/learning/curriculum', (_req: Request, res: Response) => {
  return res.json({
    topics: TOPICS,
    skills: SKILLS,
    videos: VETTED_VIDEOS
  });
});

apiRouter.get('/learning/lesson/:skill_id', (req: Request, res: Response) => {
  const lesson = LESSONS[req.params.skill_id];
  const skill = SKILLS.find((s) => s.id === req.params.skill_id);
  if (!lesson || !skill) {
    return res.status(404).json({ error: 'Lesson not found for this skill' });
  }
  return res.json({ lesson, skill });
});

apiRouter.get('/learning/next/:child_id', (req: Request, res: Response) => {
  try {
    const decision = determineNextActivity(req.params.child_id);
    return res.json(decision);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// --- Learning Sessions & Responses ---

apiRouter.post('/learning/sessions', (req: Request, res: Response) => {
  const { childId, mode, skillIds } = req.body;
  if (!childId || !mode) {
    return res.status(400).json({ error: 'childId and mode are required' });
  }

  const session = db.createSession({
    childId,
    mode,
    questionsAttempted: 0,
    correctCount: 0,
    skillIds: skillIds || []
  });

  return res.status(201).json(session);
});

apiRouter.patch('/learning/sessions/:session_id/end', (req: Request, res: Response) => {
  const session = db.endSession(req.params.session_id);
  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }
  return res.json(session);
});

apiRouter.post('/learning/responses', (req: Request, res: Response) => {
  const { childId, sessionId, questionId, skillId, submittedAnswer, hintTierUsed, timeSpentMs } = req.body;
  if (!childId || !questionId || !skillId || submittedAnswer === undefined) {
    return res.status(400).json({ error: 'Missing required response parameters' });
  }

  // 1. Grade deterministically
  const grade = gradeAnswer(questionId, submittedAnswer, Number(hintTierUsed || 0));

  // 2. Persist response record
  const savedResponse = db.recordResponse({
    childId,
    sessionId: sessionId || 'default_session',
    questionId,
    skillId,
    submittedAnswer,
    isCorrect: grade.isCorrect,
    isIndependent: grade.isIndependent,
    hintTierUsed: Number(hintTierUsed || 0),
    timeSpentMs: Number(timeSpentMs || 5000),
    detectedMisconceptionKey: grade.detectedMisconception?.key
  });

  // 3. If misconception detected, record in child's misconception history
  if (grade.detectedMisconception) {
    db.recordMisconception(
      childId,
      skillId,
      grade.detectedMisconception.key,
      grade.detectedMisconception.explanationEn,
      grade.detectedMisconception.remedyEn
    );
  }

  // 4. Update skill state in the learning loop engine
  const transition = handleAnswerAndAdvanceState(
    childId,
    skillId,
    grade.isCorrect,
    grade.isIndependent,
    grade.detectedMisconception?.key
  );

  return res.json({
    grading: grade,
    response: savedResponse,
    transition
  });
});

apiRouter.post('/learning/complete-diagnostic/:child_id', (req: Request, res: Response) => {
  const child = db.updateChild(req.params.child_id, { diagnosticCompleted: true });
  if (!child) {
    return res.status(404).json({ error: 'Child not found' });
  }
  return res.json({ success: true, child });
});

apiRouter.get('/learning/progress/:child_id', (req: Request, res: Response) => {
  const progressList = db.getAllSkillProgress(req.params.child_id);
  const misconceptions = db.getMisconceptions(req.params.child_id);
  const revisions = db.getRevisions(req.params.child_id);

  return res.json({
    progressList,
    misconceptions,
    revisions
  });
});

apiRouter.get('/learning/daily-mission/:child_id', (req: Request, res: Response) => {
  const mission = db.getDailyMission(req.params.child_id);
  return res.json(mission);
});

apiRouter.post('/learning/daily-mission/:child_id/complete', (req: Request, res: Response) => {
  db.completeDailyMission(req.params.child_id);
  return res.json({ success: true });
});

apiRouter.get('/learning/revisions/:child_id', (req: Request, res: Response) => {
  const revisions = db.getRevisions(req.params.child_id);
  return res.json(revisions);
});

apiRouter.post('/learning/revisions/:revision_id/complete', (req: Request, res: Response) => {
  db.completeRevision(req.params.revision_id);
  return res.json({ success: true });
});

// --- AI Tutor Endpoints ---

apiRouter.post('/tutor/explain', async (req: Request, res: Response) => {
  const { skillTitle, learningObjective, age, stuckContext } = req.body;
  if (!skillTitle) {
    return res.status(400).json({ error: 'skillTitle is required' });
  }

  const result = await explainConceptWithAi(
    skillTitle,
    learningObjective || 'Understanding math foundations',
    Number(age || 7),
    stuckContext
  );

  return res.json(result);
});

apiRouter.post('/tutor/hint', async (req: Request, res: Response) => {
  const { questionPrompt, correctAnswer, childAnswer, tier, language } = req.body;
  if (!questionPrompt) {
    return res.status(400).json({ error: 'questionPrompt is required' });
  }

  const result = await generateContextualHintWithAi(
    questionPrompt,
    correctAnswer || '',
    childAnswer || '',
    Number(tier || 1) as 1 | 2 | 3,
    (language as 'en' | 'mr') || 'en'
  );

  return res.json(result);
});

// --- Parent Portal & Analytics ---

apiRouter.get('/parents/:parent_id/dashboard', (req: Request, res: Response) => {
  const parent = db.getParent(req.params.parent_id);
  if (!parent) {
    return res.status(404).json({ error: 'Parent not found' });
  }

  const children = db.getChildrenForParent(parent.id);
  const childrenReports = children.map((c) => {
    const sessions = db.getSessions(c.id);
    const responses = db.getResponses(c.id);
    const progress = db.getAllSkillProgress(c.id);
    const misconceptions = db.getMisconceptions(c.id);
    const revisions = db.getRevisions(c.id);

    // Real measured metrics (no invented metrics!)
    const totalQuestions = responses.length;
    const independentCorrect = responses.filter((r) => r.isCorrect && r.isIndependent).length;
    const assistedCorrect = responses.filter((r) => r.isCorrect && !r.isIndependent).length;
    const totalTimeMinutes = Math.round(
      responses.reduce((sum, r) => sum + (r.timeSpentMs || 0), 0) / 60000
    );

    const masteredSkillsCount = progress.filter(
      (p) => p.state === 'provisional_mastery' || p.state === 'retained'
    ).length;
    const practisingSkillsCount = progress.filter((p) => p.state === 'practising').length;
    const learningSkillsCount = progress.filter((p) => p.state === 'learning').length;

    // Home learning activities suggestion
    const homeActivities = [
      {
        title: 'Bangles & Matchsticks Bundles',
        skillTarget: 'Tens and Ones',
        instructions: 'Take 30 matchsticks or toothpicks with rubber bands. Ask your child to tie groups of 10. Ask: "Can we make 3 tens and 4 ones? What number is that?"',
        timeMinutes: 10
      },
      {
        title: 'Floor Tape Number Hop',
        skillTarget: 'Subtraction on a Number Line',
        instructions: 'Stick numbers 0 to 15 on the floor with masking tape. Have your child jump backward from 12 when subtracting 4, saying the numbers out loud.',
        timeMinutes: 10
      }
    ];

    return {
      child: c,
      metrics: {
        totalSessions: sessions.length,
        totalQuestions,
        independentCorrect,
        assistedCorrect,
        accuracyPercentage: totalQuestions > 0 ? Math.round(((independentCorrect + assistedCorrect) / totalQuestions) * 100) : 0,
        totalTimeMinutes,
        masteredSkillsCount,
        practisingSkillsCount,
        learningSkillsCount
      },
      progress,
      misconceptions,
      revisions,
      recentResponses: responses.slice(-10).reverse(),
      homeActivities
    };
  });

  return res.json({
    parent,
    childrenReports
  });
});

// --- Uploaded Educational Resources ---

apiRouter.get('/resources/:parent_id', (req: Request, res: Response) => {
  const resources = db.getResources(req.params.parent_id);
  return res.json(resources);
});

apiRouter.post('/resources/upload', async (req: Request, res: Response) => {
  const { parentId, title, fileName, fileSize, textSnippet, pageCount } = req.body;
  if (!parentId || !fileName) {
    return res.status(400).json({ error: 'Missing required file data' });
  }

  // Process text snippet with AI / syllabus mapping
  const processed = await processUploadedDocumentWithAi(fileName, textSnippet || '');

  const resource = db.addResource({
    parentId,
    title: title || fileName.replace(/\.[^/.]+$/, ''),
    fileName,
    fileSize: Number(fileSize || 102400),
    extractedTextSnippet: textSnippet || '',
    pageCount: Number(pageCount || 1),
    mappedTopics: processed.extractedTopics,
    notes: processed.summaryEn
  });

  return res.status(201).json(resource);
});

apiRouter.patch('/resources/:resource_id/mapping', (req: Request, res: Response) => {
  const { mappedTopics } = req.body;
  const updated = db.updateResourceTopicMapping(req.params.resource_id, mappedTopics);
  if (!updated) {
    return res.status(404).json({ error: 'Resource not found' });
  }
  return res.json(updated);
});

apiRouter.delete('/resources/:resource_id', (req: Request, res: Response) => {
  const success = db.deleteResource(req.params.resource_id);
  if (!success) {
    return res.status(404).json({ error: 'Resource not found' });
  }
  return res.json({ success: true, message: 'Resource permanently deleted' });
});

import { db } from './db.js';
import { SKILLS, LESSONS, QUESTIONS } from './curriculumData.js';
import { PlannedActivity, SkillState, Question } from '../src/types/index.js';

export interface PlannerDecision {
  activity: PlannedActivity;
  lessonId?: string;
  recommendedQuestions: Question[];
  messageEn: string;
  messageMr: string;
}

export function determineNextActivity(childId: string): PlannerDecision {
  const child = db.getChild(childId);
  if (!child) {
    throw new Error(`Child ${childId} not found`);
  }

  // 1. Diagnostic Check: If child has not completed diagnostic, schedule diagnostic assessment
  if (!child.diagnosticCompleted) {
    const diagnosticQuestions = [
      QUESTIONS.find((q) => q.id === 'q_co_01')!,
      QUESTIONS.find((q) => q.id === 'q_to_01')!,
      QUESTIONS.find((q) => q.id === 'q_sh_01')!
    ].filter(Boolean);

    return {
      activity: {
        type: 'diagnostic',
        skillId: 'skill_tens_and_ones',
        skillTitle: 'Initial Math Discovery Diagnostic',
        reason: 'Getting to know your strengths and favorite topics in a friendly, low-pressure way.',
        difficulty: 1,
        requiresExplanation: false,
        questionCount: diagnosticQuestions.length,
        prerequisitesMet: true
      },
      recommendedQuestions: diagnosticQuestions,
      messageEn: "Welcome to Guruji AI! Let's explore some fun questions together to find where to begin.",
      messageMr: 'गुरुजी एआय मध्ये स्वागत आहे! आपण एकत्र काही मजेशीर प्रश्न सोडवून सुरुवात करूया.'
    };
  }

  // 2. Check for due spaced revisions
  const todayStr = new Date().toISOString().split('T')[0];
  const revisions = db.getRevisions(childId);
  const dueRevision = revisions.find(
    (r) => r.status === 'pending' && r.dueDate <= todayStr
  );

  if (dueRevision) {
    const skill = SKILLS.find((s) => s.id === dueRevision.skillId) || SKILLS[0];
    const revisionQuestions = QUESTIONS.filter((q) => q.skillId === skill.id).slice(0, 3);

    return {
      activity: {
        type: 'spaced_revision',
        skillId: skill.id,
        skillTitle: skill.titleEn,
        reason: `Spaced revision interval (${dueRevision.intervalDays} days) to reinforce long-term memory.`,
        difficulty: skill.difficulty,
        requiresExplanation: false,
        questionCount: revisionQuestions.length,
        prerequisitesMet: true
      },
      recommendedQuestions: revisionQuestions,
      messageEn: `Time for a quick brain refresher on "${skill.titleEn}"!`,
      messageMr: `"${skill.titleMr}" या विषयाची उजळणी करण्याची वेळ झाली आहे!`
    };
  }

  // 3. Evaluate skill progress and prerequisite graph
  const allProgress = db.getAllSkillProgress(childId);

  // Check each skill in curriculum
  for (const skill of SKILLS) {
    // Verify prerequisites
    const prereqsMet = skill.prerequisites.every((prereqId) => {
      const prog = allProgress.find((p) => p.skillId === prereqId);
      return prog && (prog.state === 'provisional_mastery' || prog.state === 'retained');
    });

    if (!prereqsMet && skill.prerequisites.length > 0) {
      continue;
    }

    const progress = allProgress.find((p) => p.skillId === skill.id);
    const state: SkillState = progress ? progress.state : 'learning';

    // A. If in 'learning' state or 0 attempts: Teach lesson first
    if (state === 'learning' || !progress || progress.totalAttempts === 0) {
      const lesson = LESSONS[skill.id];
      const practiceQuestions = QUESTIONS.filter((q) => q.skillId === skill.id).slice(0, 3);

      return {
        activity: {
          type: 'teach_lesson',
          skillId: skill.id,
          skillTitle: skill.titleEn,
          reason: `New learning concept ready. Prerequisites are satisfied.`,
          difficulty: skill.difficulty,
          requiresExplanation: true,
          questionCount: practiceQuestions.length,
          prerequisitesMet: true
        },
        lessonId: lesson ? lesson.id : undefined,
        recommendedQuestions: practiceQuestions,
        messageEn: `Let's learn a wonderful new concept: "${skill.titleEn}"!`,
        messageMr: `चला एक नवीन छान संकल्पना शिकूया: "${skill.titleMr}"!`
      };
    }

    // B. If in 'practising' state: Guided practice or alternative explanation if misconceptions repeated
    if (state === 'practising') {
      const practiceQuestions = QUESTIONS.filter((q) => q.skillId === skill.id);
      const recentMisconceptions = db.getMisconceptions(childId).filter((m) => m.skillId === skill.id);
      const hasRepeatedMisconceptions = recentMisconceptions.some((m) => m.frequency >= 2);

      return {
        activity: {
          type: hasRepeatedMisconceptions ? 'teach_lesson' : 'guided_practice',
          skillId: skill.id,
          skillTitle: skill.titleEn,
          reason: hasRepeatedMisconceptions
            ? `Multiple pattern errors detected; revisiting visual explanation with physical analogy.`
            : `Building confidence and fluency through guided practice (${progress.consecutiveCorrect}/3 towards provisional mastery).`,
          difficulty: skill.difficulty,
          requiresExplanation: hasRepeatedMisconceptions,
          questionCount: Math.min(3, practiceQuestions.length),
          prerequisitesMet: true
        },
        lessonId: LESSONS[skill.id]?.id,
        recommendedQuestions: practiceQuestions.slice(0, 3),
        messageEn: hasRepeatedMisconceptions
          ? `Let's look at "${skill.titleEn}" from a new, fun angle!`
          : `Let's do some guided practice on "${skill.titleEn}"!`,
        messageMr: hasRepeatedMisconceptions
          ? `चला "${skill.titleMr}" एका नवीन आणि सोप्या पद्धतीने पाहूया!`
          : `चला "${skill.titleMr}" चा सराव करूया!`
      };
    }
  }

  // Fallback to highest skill practice
  const defaultSkill = SKILLS[1] || SKILLS[0];
  const questions = QUESTIONS.filter((q) => q.skillId === defaultSkill.id).slice(0, 3);
  return {
    activity: {
      type: 'guided_practice',
      skillId: defaultSkill.id,
      skillTitle: defaultSkill.titleEn,
      reason: 'Continuing math adventure and fluency practice.',
      difficulty: defaultSkill.difficulty,
      requiresExplanation: false,
      questionCount: questions.length,
      prerequisitesMet: true
    },
    lessonId: LESSONS[defaultSkill.id]?.id,
    recommendedQuestions: questions,
    messageEn: `Ready for more practice on ${defaultSkill.titleEn}?`,
    messageMr: `${defaultSkill.titleMr} चा आणखी सराव करायचा आहे का?`
  };
}

export function handleAnswerAndAdvanceState(
  childId: string,
  skillId: string,
  isCorrect: boolean,
  isIndependent: boolean,
  misconceptionKey?: string
): { newState: SkillState; updatedConsecutive: number; scheduledRevisionDays?: number } {
  const current = db.getSkillProgress(childId, skillId);
  const currentAttempts = current?.totalAttempts || 0;
  const currentIndep = current?.independentCorrect || 0;
  const currentAssist = current?.assistedCorrect || 0;
  let consecutive = current?.consecutiveCorrect || 0;
  let state = current?.state || 'learning';

  let scheduledRevisionDays: number | undefined = undefined;

  if (isCorrect) {
    if (isIndependent) {
      consecutive += 1;
      // Heuristic: 3 consecutive independent correct answers qualify for provisional mastery
      if (consecutive >= 3 && state !== 'provisional_mastery' && state !== 'retained') {
        state = 'provisional_mastery';
        scheduledRevisionDays = 1; // Schedule revision in 1 day
        db.scheduleRevision(childId, skillId, 1);
      } else if (state === 'provisional_mastery') {
        // If reviewing during provisional mastery and succeeds independently, upgrade to retained
        state = 'retained';
        scheduledRevisionDays = 3;
        db.scheduleRevision(childId, skillId, 3);
      }
    } else {
      // Assisted correct keeps practice moving without penalizing, but does not count towards independent mastery
      consecutive = Math.max(0, consecutive);
      if (state === 'learning') {
        state = 'practising';
      }
    }
  } else {
    // Incorrect answer: reset consecutive streak
    consecutive = 0;
    if (state === 'provisional_mastery') {
      // Regressed during mastery check, return to practising
      state = 'practising';
    }
  }

  db.updateSkillProgress(childId, skillId, () => ({
    state,
    totalAttempts: currentAttempts + 1,
    independentCorrect: currentIndep + (isCorrect && isIndependent ? 1 : 0),
    assistedCorrect: currentAssist + (isCorrect && !isIndependent ? 1 : 0),
    consecutiveCorrect: consecutive,
    lastPracticed: new Date().toISOString(),
    provisionalMasteryDate: state === 'provisional_mastery' ? new Date().toISOString() : current?.provisionalMasteryDate,
    retainedDate: state === 'retained' ? new Date().toISOString() : current?.retainedDate
  }));

  return {
    newState: state,
    updatedConsecutive: consecutive,
    scheduledRevisionDays
  };
}

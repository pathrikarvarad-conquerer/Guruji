import fs from 'fs';
import path from 'path';
import {
  ParentAccount,
  ChildProfile,
  StudentResponse,
  SkillProgress,
  MisconceptionRecord,
  RevisionSchedule,
  LearningSession,
  UploadedResource,
  DailyMission,
  SkillState
} from '../src/types/index.js';

interface DatabaseSchema {
  parents: ParentAccount[];
  children: ChildProfile[];
  sessions: LearningSession[];
  responses: StudentResponse[];
  skillProgress: SkillProgress[];
  misconceptions: MisconceptionRecord[];
  revisions: RevisionSchedule[];
  resources: UploadedResource[];
  dailyMissions: DailyMission[];
}

const DATA_DIR = path.resolve(process.env.DATA_DIR || './data');
const DB_FILE = path.join(DATA_DIR, 'guruji_db.json');

// Initial seed data with a test family for instant exploration
const INITIAL_DB: DatabaseSchema = {
  parents: [
    {
      id: 'parent_demo_01',
      name: 'Aditi Sharma',
      email: 'aditi.parent@guruji.ai',
      createdAt: new Date(Date.now() - 7 * 86400000).toISOString()
    }
  ],
  children: [
    {
      id: 'child_aarav_01',
      parentId: 'parent_demo_01',
      name: 'Aarav Sharma',
      age: 7,
      grade: 'Grade 2',
      language: 'en',
      curriculum: 'cbse',
      subjects: ['Mathematics'],
      avatar: '🦊',
      accessibility: {
        ttsEnabled: true,
        ttsSpeed: 1.0,
        dyslexiaFont: false,
        largeTouchTargets: false,
        soundEffects: true
      },
      diagnosticCompleted: true,
      createdAt: new Date(Date.now() - 7 * 86400000).toISOString()
    }
  ],
  sessions: [
    {
      id: 'sess_initial_diag',
      childId: 'child_aarav_01',
      mode: 'diagnostic',
      startedAt: new Date(Date.now() - 6 * 86400000).toISOString(),
      endedAt: new Date(Date.now() - 6 * 86400000 + 15 * 60000).toISOString(),
      questionsAttempted: 3,
      correctCount: 2,
      skillIds: ['skill_count_objects', 'skill_tens_and_ones', 'skill_shapes_2d']
    },
    {
      id: 'sess_lesson_practice',
      childId: 'child_aarav_01',
      mode: 'lesson',
      startedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      endedAt: new Date(Date.now() - 2 * 86400000 + 20 * 60000).toISOString(),
      questionsAttempted: 4,
      correctCount: 3,
      skillIds: ['skill_tens_and_ones']
    }
  ],
  responses: [
    {
      id: 'resp_demo_1',
      childId: 'child_aarav_01',
      sessionId: 'sess_initial_diag',
      questionId: 'q_co_01',
      skillId: 'skill_count_objects',
      submittedAnswer: '7',
      isCorrect: true,
      isIndependent: true,
      hintTierUsed: 0,
      timeSpentMs: 14200,
      timestamp: new Date(Date.now() - 6 * 86400000).toISOString()
    },
    {
      id: 'resp_demo_2',
      childId: 'child_aarav_01',
      sessionId: 'sess_lesson_practice',
      questionId: 'q_to_01',
      skillId: 'skill_tens_and_ones',
      submittedAnswer: '34',
      isCorrect: false,
      isIndependent: true,
      hintTierUsed: 0,
      timeSpentMs: 18500,
      detectedMisconceptionKey: 'tens_ones_reversed',
      timestamp: new Date(Date.now() - 2 * 86400000).toISOString()
    },
    {
      id: 'resp_demo_3',
      childId: 'child_aarav_01',
      sessionId: 'sess_lesson_practice',
      questionId: 'q_to_01',
      skillId: 'skill_tens_and_ones',
      submittedAnswer: '43',
      isCorrect: true,
      isIndependent: false,
      hintTierUsed: 2,
      timeSpentMs: 12000,
      timestamp: new Date(Date.now() - 2 * 86400000 + 60000).toISOString()
    },
    {
      id: 'resp_demo_4',
      childId: 'child_aarav_01',
      sessionId: 'sess_lesson_practice',
      questionId: 'q_to_02',
      skillId: 'skill_tens_and_ones',
      submittedAnswer: '5',
      isCorrect: true,
      isIndependent: true,
      hintTierUsed: 0,
      timeSpentMs: 9800,
      timestamp: new Date(Date.now() - 2 * 86400000 + 180000).toISOString()
    }
  ],
  skillProgress: [
    {
      id: 'prog_count',
      childId: 'child_aarav_01',
      skillId: 'skill_count_objects',
      state: 'retained',
      totalAttempts: 3,
      independentCorrect: 3,
      assistedCorrect: 0,
      consecutiveCorrect: 3,
      lastPracticed: new Date(Date.now() - 5 * 86400000).toISOString(),
      provisionalMasteryDate: new Date(Date.now() - 5 * 86400000).toISOString(),
      retainedDate: new Date(Date.now() - 1 * 86400000).toISOString()
    },
    {
      id: 'prog_tens',
      childId: 'child_aarav_01',
      skillId: 'skill_tens_and_ones',
      state: 'practising',
      totalAttempts: 4,
      independentCorrect: 2,
      assistedCorrect: 1,
      consecutiveCorrect: 2,
      lastPracticed: new Date(Date.now() - 2 * 86400000).toISOString()
    },
    {
      id: 'prog_tenframe',
      childId: 'child_aarav_01',
      skillId: 'skill_add_tenframe',
      state: 'learning',
      totalAttempts: 0,
      independentCorrect: 0,
      assistedCorrect: 0,
      consecutiveCorrect: 0,
      lastPracticed: new Date(Date.now() - 7 * 86400000).toISOString()
    }
  ],
  misconceptions: [
    {
      id: 'misc_aarav_1',
      childId: 'child_aarav_01',
      skillId: 'skill_tens_and_ones',
      misconceptionKey: 'tens_ones_reversed',
      description: 'Reversing the order of tens and ones (writing 34 instead of 43).',
      frequency: 1,
      firstSeen: new Date(Date.now() - 2 * 86400000).toISOString(),
      lastSeen: new Date(Date.now() - 2 * 86400000).toISOString(),
      remedySuggested: 'Practice with physical bunches of 10 crayons or spoons to reinforce that tens are physically larger groups.'
    }
  ],
  revisions: [
    {
      id: 'rev_aarav_count',
      childId: 'child_aarav_01',
      skillId: 'skill_tens_and_ones',
      dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      intervalDays: 3,
      status: 'pending',
      repetitionCount: 1,
      lastReviewed: new Date(Date.now() - 2 * 86400000).toISOString()
    }
  ],
  resources: [
    {
      id: 'res_sample_cbse',
      parentId: 'parent_demo_01',
      title: 'CBSE Grade 2 Maths - Chapter 2 Tens and Ones Notes',
      fileName: 'cbse_math_ch2_tens_ones.pdf',
      fileSize: 428000,
      uploadedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
      pageCount: 4,
      extractedTextSnippet: 'Chapter 2: Counting in Groups. Let us count how many cups are there. Look at how different things are kept in groups. 3 tens and 4 ones equal 34. Practice grouping bangles and matchsticks into tens.',
      mappedTopics: [
        {
          topicName: 'Counting in Groups of Ten',
          matchedSkillId: 'skill_tens_and_ones',
          relevanceScore: 0.94,
          pageNumbers: [1, 2, 3]
        },
        {
          topicName: 'Addition with Bundles',
          matchedSkillId: 'skill_add_tenframe',
          relevanceScore: 0.82,
          pageNumbers: [4]
        }
      ],
      notes: 'Standard CBSE syllabus textbook chapter.'
    }
  ],
  dailyMissions: [
    {
      childId: 'child_aarav_01',
      date: new Date().toISOString().split('T')[0],
      lessonSkillId: 'skill_tens_and_ones',
      practiceSkillId: 'skill_tens_and_ones',
      revisionSkillId: 'skill_count_objects',
      completed: false
    }
  ]
};

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.ensureDirectory();
    this.data = this.load();
  }

  private ensureDirectory() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  private load(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn('Failed to load database file, initializing with defaults', e);
    }
    this.save(INITIAL_DB);
    return JSON.parse(JSON.stringify(INITIAL_DB));
  }

  private save(data: DatabaseSchema) {
    this.ensureDirectory();
    const tempFile = `${DB_FILE}.tmp.${Date.now()}`;
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
  }

  // --- Parents ---
  getParent(id: string): ParentAccount | undefined {
    return this.data.parents.find((p) => p.id === id);
  }

  getParentByEmail(email: string): ParentAccount | undefined {
    return this.data.parents.find((p) => p.email.toLowerCase() === email.toLowerCase());
  }

  createParent(name: string, email: string): ParentAccount {
    const parent: ParentAccount = {
      id: `parent_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name,
      email,
      createdAt: new Date().toISOString()
    };
    this.data.parents.push(parent);
    this.save(this.data);
    return parent;
  }

  // --- Children ---
  getChildrenForParent(parentId: string): ChildProfile[] {
    return this.data.children.filter((c) => c.parentId === parentId);
  }

  getChild(id: string): ChildProfile | undefined {
    return this.data.children.find((c) => c.id === id);
  }

  createChild(childData: Omit<ChildProfile, 'id' | 'createdAt'>): ChildProfile {
    const child: ChildProfile = {
      ...childData,
      id: `child_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString()
    };
    this.data.children.push(child);
    this.save(this.data);
    return child;
  }

  updateChild(id: string, updates: Partial<ChildProfile>): ChildProfile | undefined {
    const child = this.getChild(id);
    if (!child) return undefined;
    Object.assign(child, updates);
    this.save(this.data);
    return child;
  }

  deleteChild(id: string): boolean {
    const initialLen = this.data.children.length;
    this.data.children = this.data.children.filter((c) => c.id !== id);
    // Cascade delete child-specific records
    this.data.sessions = this.data.sessions.filter((s) => s.childId !== id);
    this.data.responses = this.data.responses.filter((r) => r.childId !== id);
    this.data.skillProgress = this.data.skillProgress.filter((sp) => sp.childId !== id);
    this.data.misconceptions = this.data.misconceptions.filter((m) => m.childId !== id);
    this.data.revisions = this.data.revisions.filter((rv) => rv.childId !== id);
    this.data.dailyMissions = this.data.dailyMissions.filter((dm) => dm.childId !== id);
    this.save(this.data);
    return this.data.children.length < initialLen;
  }

  deleteParentAccount(parentId: string): boolean {
    const parentChildren = this.getChildrenForParent(parentId);
    parentChildren.forEach((c) => this.deleteChild(c.id));
    this.data.parents = this.data.parents.filter((p) => p.id !== parentId);
    this.data.resources = this.data.resources.filter((r) => r.parentId !== parentId);
    this.save(this.data);
    return true;
  }

  // --- Sessions & Responses ---
  createSession(sessionData: Omit<LearningSession, 'id' | 'startedAt'>): LearningSession {
    const session: LearningSession = {
      ...sessionData,
      id: `sess_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      startedAt: new Date().toISOString()
    };
    this.data.sessions.push(session);
    this.save(this.data);
    return session;
  }

  endSession(sessionId: string): LearningSession | undefined {
    const session = this.data.sessions.find((s) => s.id === sessionId);
    if (!session) return undefined;
    session.endedAt = new Date().toISOString();
    this.save(this.data);
    return session;
  }

  getSessions(childId: string): LearningSession[] {
    return this.data.sessions.filter((s) => s.childId === childId);
  }

  recordResponse(responseData: Omit<StudentResponse, 'id' | 'timestamp'>): StudentResponse {
    const resp: StudentResponse = {
      ...responseData,
      id: `resp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString()
    };
    this.data.responses.push(resp);

    // Update parent session statistics if exists
    const session = this.data.sessions.find((s) => s.id === resp.sessionId);
    if (session) {
      session.questionsAttempted += 1;
      if (resp.isCorrect) session.correctCount += 1;
      if (!session.skillIds.includes(resp.skillId)) {
        session.skillIds.push(resp.skillId);
      }
    }

    this.save(this.data);
    return resp;
  }

  getResponses(childId: string): StudentResponse[] {
    return this.data.responses.filter((r) => r.childId === childId);
  }

  // --- Skill Progress ---
  getSkillProgress(childId: string, skillId: string): SkillProgress | undefined {
    return this.data.skillProgress.find((p) => p.childId === childId && p.skillId === skillId);
  }

  getAllSkillProgress(childId: string): SkillProgress[] {
    return this.data.skillProgress.filter((p) => p.childId === childId);
  }

  updateSkillProgress(
    childId: string,
    skillId: string,
    updater: (current: SkillProgress) => Partial<SkillProgress>
  ): SkillProgress {
    let progress = this.getSkillProgress(childId, skillId);
    if (!progress) {
      progress = {
        id: `prog_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        childId,
        skillId,
        state: 'learning',
        totalAttempts: 0,
        independentCorrect: 0,
        assistedCorrect: 0,
        consecutiveCorrect: 0,
        lastPracticed: new Date().toISOString()
      };
      this.data.skillProgress.push(progress);
    }
    const updates = updater(progress);
    Object.assign(progress, updates);
    this.save(this.data);
    return progress;
  }

  // --- Misconceptions ---
  getMisconceptions(childId: string): MisconceptionRecord[] {
    return this.data.misconceptions.filter((m) => m.childId === childId);
  }

  recordMisconception(
    childId: string,
    skillId: string,
    misconceptionKey: string,
    description: string,
    remedySuggested: string
  ): MisconceptionRecord {
    let record = this.data.misconceptions.find(
      (m) => m.childId === childId && m.skillId === skillId && m.misconceptionKey === misconceptionKey
    );
    if (record) {
      record.frequency += 1;
      record.lastSeen = new Date().toISOString();
      record.remedySuggested = remedySuggested;
    } else {
      record = {
        id: `misc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        childId,
        skillId,
        misconceptionKey,
        description,
        frequency: 1,
        firstSeen: new Date().toISOString(),
        lastSeen: new Date().toISOString(),
        remedySuggested
      };
      this.data.misconceptions.push(record);
    }
    this.save(this.data);
    return record;
  }

  // --- Spaced Revision ---
  getRevisions(childId: string): RevisionSchedule[] {
    return this.data.revisions.filter((r) => r.childId === childId);
  }

  scheduleRevision(childId: string, skillId: string, intervalDays: number): RevisionSchedule {
    const dueDate = new Date(Date.now() + intervalDays * 86400000).toISOString().split('T')[0];
    let rev = this.data.revisions.find((r) => r.childId === childId && r.skillId === skillId);
    if (rev) {
      rev.dueDate = dueDate;
      rev.intervalDays = intervalDays;
      rev.status = 'pending';
      rev.repetitionCount += 1;
    } else {
      rev = {
        id: `rev_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        childId,
        skillId,
        dueDate,
        intervalDays,
        status: 'pending',
        repetitionCount: 1
      };
      this.data.revisions.push(rev);
    }
    this.save(this.data);
    return rev;
  }

  completeRevision(revisionId: string): void {
    const rev = this.data.revisions.find((r) => r.id === revisionId);
    if (rev) {
      rev.status = 'completed';
      rev.lastReviewed = new Date().toISOString();
      this.save(this.data);
    }
  }

  // --- Uploaded Resources ---
  getResources(parentId: string): UploadedResource[] {
    return this.data.resources.filter((r) => r.parentId === parentId);
  }

  addResource(resource: Omit<UploadedResource, 'id' | 'uploadedAt'>): UploadedResource {
    const res: UploadedResource = {
      ...resource,
      id: `res_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      uploadedAt: new Date().toISOString()
    };
    this.data.resources.push(res);
    this.save(this.data);
    return res;
  }

  deleteResource(resourceId: string): boolean {
    const initLen = this.data.resources.length;
    this.data.resources = this.data.resources.filter((r) => r.id !== resourceId);
    this.save(this.data);
    return this.data.resources.length < initLen;
  }

  updateResourceTopicMapping(
    resourceId: string,
    mappings: UploadedResource['mappedTopics']
  ): UploadedResource | undefined {
    const res = this.data.resources.find((r) => r.id === resourceId);
    if (!res) return undefined;
    res.mappedTopics = mappings;
    this.save(this.data);
    return res;
  }

  // --- Daily Missions ---
  getDailyMission(childId: string): DailyMission {
    const today = new Date().toISOString().split('T')[0];
    let mission = this.data.dailyMissions.find((m) => m.childId === childId && m.date === today);
    if (!mission) {
      mission = {
        childId,
        date: today,
        lessonSkillId: 'skill_tens_and_ones',
        practiceSkillId: 'skill_tens_and_ones',
        revisionSkillId: 'skill_count_objects',
        completed: false
      };
      this.data.dailyMissions.push(mission);
      this.save(this.data);
    }
    return mission;
  }

  completeDailyMission(childId: string): void {
    const mission = this.getDailyMission(childId);
    mission.completed = true;
    this.save(this.data);
  }
}

export const db = new Database();

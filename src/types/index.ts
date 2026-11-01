export type Language = 'en' | 'mr';

export type CurriculumType = 'cbse' | 'icse' | 'state' | 'general';

export type AgeGroup = '4-6' | '7-9' | '10-12';

export type SkillState = 'learning' | 'practising' | 'provisional_mastery' | 'retained';

export interface ParentAccount {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface ChildAccessibility {
  ttsEnabled: boolean;
  ttsSpeed: number; // 0.8 to 1.2
  dyslexiaFont: boolean;
  largeTouchTargets: boolean;
  soundEffects: boolean;
}

export interface ChildProfile {
  id: string;
  parentId: string;
  name: string;
  age: number;
  grade: string;
  language: Language;
  curriculum: CurriculumType;
  subjects: string[];
  avatar: string;
  accessibility: ChildAccessibility;
  diagnosticCompleted: boolean;
  createdAt: string;
}

export interface CurriculumTopic {
  id: string;
  subject: string;
  gradeMin: number;
  gradeMax: number;
  titleEn: string;
  titleMr: string;
  descriptionEn: string;
  descriptionMr: string;
  icon: string;
}

export interface Skill {
  id: string;
  topicId: string;
  subject: string;
  code: string;
  titleEn: string;
  titleMr: string;
  descriptionEn: string;
  descriptionMr: string;
  prerequisites: string[];
  difficulty: number; // 1 to 5
  targetAgeMin: number;
  targetAgeMax: number;
}

export type VisualModelType = 
  | 'tens_ones' 
  | 'ten_frame' 
  | 'number_line' 
  | 'counting_objects' 
  | 'shapes_geometry'
  | 'fraction_bar';

export interface VisualModelConfig {
  type: VisualModelType;
  data: {
    tens?: number;
    ones?: number;
    total?: number;
    start?: number;
    jump?: number;
    end?: number;
    items?: { count: number; label: string; icon: string }[];
    shape?: 'circle' | 'square' | 'triangle' | 'rectangle';
    fraction?: { numerator: number; denominator: number };
    customMessage?: string;
  };
}

export interface Lesson {
  id: string;
  skillId: string;
  titleEn: string;
  titleMr: string;
  learningObjectiveEn: string;
  learningObjectiveMr: string;
  simpleExplanationEn: string;
  simpleExplanationMr: string;
  visualModel: VisualModelConfig;
  workedExample: {
    problemEn: string;
    problemMr: string;
    stepsEn: string[];
    stepsMr: string[];
    solutionEn: string;
    solutionMr: string;
  };
  comprehensionCheck: {
    questionEn: string;
    questionMr: string;
    optionsEn: string[];
    optionsMr: string[];
    correctIndex: number;
    explanationEn: string;
    explanationMr: string;
  };
}

export type QuestionType = 
  | 'single_choice' 
  | 'numeric' 
  | 'tens_ones_picker' 
  | 'number_line_jump' 
  | 'counting_match';

export interface Question {
  id: string;
  skillId: string;
  type: QuestionType;
  difficulty: number;
  promptEn: string;
  promptMr: string;
  optionsEn?: string[];
  optionsMr?: string[];
  correctAnswer: string | number;
  visualModel?: VisualModelConfig;
  hints: {
    tier1NudgeEn: string;
    tier1NudgeMr: string;
    tier2GuidedEn: string;
    tier2GuidedMr: string;
    tier3VisualEn: string;
    tier3VisualMr: string;
  };
  commonMisconceptions?: {
    answer: string | number;
    key: string;
    explanationEn: string;
    explanationMr: string;
    remedyEn: string;
    remedyMr: string;
  }[];
}

export interface GradingResult {
  isCorrect: boolean;
  isIndependent: boolean;
  score: number;
  detectedMisconception?: {
    key: string;
    explanationEn: string;
    explanationMr: string;
    remedyEn: string;
    remedyMr: string;
  };
  feedbackEn: string;
  feedbackMr: string;
  correctAnswerFormatted: string | number;
}

export interface StudentResponse {
  id: string;
  childId: string;
  sessionId: string;
  questionId: string;
  skillId: string;
  submittedAnswer: string | number;
  isCorrect: boolean;
  isIndependent: boolean;
  hintTierUsed: number; // 0 = independent, 1 = nudge, 2 = guided, 3 = visual
  timeSpentMs: number;
  detectedMisconceptionKey?: string;
  timestamp: string;
}

export interface SkillProgress {
  id: string;
  childId: string;
  skillId: string;
  state: SkillState;
  totalAttempts: number;
  independentCorrect: number;
  assistedCorrect: number;
  consecutiveCorrect: number;
  lastPracticed: string;
  provisionalMasteryDate?: string;
  retainedDate?: string;
}

export interface MisconceptionRecord {
  id: string;
  childId: string;
  skillId: string;
  misconceptionKey: string;
  description: string;
  frequency: number;
  firstSeen: string;
  lastSeen: string;
  remedySuggested: string;
}

export interface RevisionSchedule {
  id: string;
  childId: string;
  skillId: string;
  dueDate: string; // ISO date YYYY-MM-DD
  intervalDays: number; // 1, 3, 7, 14
  status: 'pending' | 'completed' | 'overdue';
  repetitionCount: number;
  lastReviewed?: string;
}

export interface LearningSession {
  id: string;
  childId: string;
  mode: 'diagnostic' | 'lesson' | 'practice' | 'revision';
  startedAt: string;
  endedAt?: string;
  questionsAttempted: number;
  correctCount: number;
  skillIds: string[];
}

export interface UploadedResource {
  id: string;
  parentId: string;
  title: string;
  fileName: string;
  fileSize: number;
  uploadedAt: string;
  extractedTextSnippet: string;
  pageCount: number;
  mappedTopics: {
    topicName: string;
    matchedSkillId?: string;
    relevanceScore: number;
    pageNumbers: number[];
  }[];
  notes?: string;
}

export interface VideoResource {
  id: string;
  title: string;
  provider: string; // e.g., 'Numberblocks', 'Khan Academy Kids', 'Math Antics'
  embedUrl: string;
  duration: string;
  skillId: string;
  ageMin: number;
  ageMax: number;
  description: string;
  thumbnail: string;
}

export interface DailyMission {
  childId: string;
  date: string;
  lessonSkillId: string;
  practiceSkillId: string;
  revisionSkillId?: string;
  completed: boolean;
}

export interface PlannedActivity {
  type: 'diagnostic' | 'teach_lesson' | 'guided_practice' | 'mastery_check' | 'spaced_revision';
  skillId: string;
  skillTitle: string;
  reason: string;
  difficulty: number;
  requiresExplanation: boolean;
  questionCount: number;
  prerequisitesMet: boolean;
}

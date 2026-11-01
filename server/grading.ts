import { Question } from '../src/types/index.js';
import { QUESTIONS } from './curriculumData.js';

// Convert Marathi digits (०-९) to standard ASCII digits (0-9)
export function normalizeMarathiDigits(input: string | number): string {
  const str = String(input).trim();
  const marathiDigits: Record<string, string> = {
    '०': '0', '१': '1', '२': '2', '३': '3', '४': '4',
    '५': '5', '६': '6', '७': '7', '८': '8', '९': '9'
  };
  return str.replace(/[०-९]/g, (char) => marathiDigits[char] || char);
}

export interface GradingResult {
  isCorrect: boolean;
  isIndependent: boolean;
  score: number; // 1 for independent correct, 0.5 for hint-assisted, 0 for incorrect
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

export function gradeAnswer(
  questionId: string,
  submittedAnswer: string | number,
  hintTierUsed: number
): GradingResult {
  const question = QUESTIONS.find((q) => q.id === questionId);
  if (!question) {
    throw new Error(`Question ${questionId} not found`);
  }

  const normalizedSubmitted = normalizeMarathiDigits(submittedAnswer).toLowerCase().trim();
  const normalizedCorrect = normalizeMarathiDigits(question.correctAnswer).toLowerCase().trim();

  const isIndependent = hintTierUsed === 0;
  let isCorrect = false;

  // Strict deterministic evaluation
  if (question.type === 'numeric') {
    const numSub = parseFloat(normalizedSubmitted);
    const numCorr = parseFloat(normalizedCorrect);
    isCorrect = !isNaN(numSub) && !isNaN(numCorr) && numSub === numCorr;
  } else {
    isCorrect = normalizedSubmitted === normalizedCorrect;
  }

  // Misconception detection
  let detectedMisconception: GradingResult['detectedMisconception'] | undefined = undefined;

  if (!isCorrect && question.commonMisconceptions) {
    for (const mis of question.commonMisconceptions) {
      const normMisAnswer = normalizeMarathiDigits(mis.answer).toLowerCase().trim();
      if (normMisAnswer === normalizedSubmitted) {
        detectedMisconception = {
          key: mis.key,
          explanationEn: mis.explanationEn,
          explanationMr: mis.explanationMr,
          remedyEn: mis.remedyEn,
          remedyMr: mis.remedyMr
        };
        break;
      }
    }

    // Heuristic detection if not in explicit list
    if (!detectedMisconception) {
      if (question.skillId === 'skill_tens_and_ones' && typeof question.correctAnswer === 'number') {
        const correctStr = String(question.correctAnswer);
        if (correctStr.length === 2 && normalizedSubmitted === correctStr.split('').reverse().join('')) {
          detectedMisconception = {
            key: 'tens_ones_reversed',
            explanationEn: 'The digits were reversed! Place value matters: tens come before ones.',
            explanationMr: 'अंक उलटे झाले आहेत! स्थानिक मूल्य महत्त्वाचे आहे: एककापूर्वी दशक येतो.',
            remedyEn: 'Check the tens rod first, then write the single cubes.',
            remedyMr: 'आधी दशकाचा गट्टा तपासा, मग सुटे एकक लिहा.'
          };
        }
      }
    }
  }

  // Encouraging, non-judgmental educational feedback
  let feedbackEn = '';
  let feedbackMr = '';

  if (isCorrect) {
    if (isIndependent) {
      feedbackEn = 'Wonderful! You solved it completely independently!';
      feedbackMr = 'खूप छान! तुम्ही स्वतःच्या कल्पकतेने हे बरोबर सोडवले!';
    } else {
      feedbackEn = 'Great job using the clue! You arrived at the right answer!';
      feedbackMr = 'छान! मदतीचा वापर करून तुम्ही योग्य उत्तरापर्यंत पोहोचलात!';
    }
  } else {
    if (detectedMisconception) {
      feedbackEn = detectedMisconception.explanationEn;
      feedbackMr = detectedMisconception.explanationMr;
    } else {
      feedbackEn = 'Not quite this time, but every try helps your brain grow! Let’s review together.';
      feedbackMr = 'या वेळी थोडे चुकले, पण प्रत्येक प्रयत्नाने आपण शिकतो! चला पुन्हा समजून घेऊया.';
    }
  }

  return {
    isCorrect,
    isIndependent,
    score: isCorrect ? (isIndependent ? 1.0 : 0.5) : 0,
    detectedMisconception,
    feedbackEn,
    feedbackMr,
    correctAnswerFormatted: question.correctAnswer
  };
}

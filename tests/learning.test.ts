import test from 'node:test';
import assert from 'node:assert/strict';
import { gradeAnswer, normalizeMarathiDigits } from '../server/grading.js';
import { handleAnswerAndAdvanceState } from '../server/planner.js';
import { db } from '../server/db.js';

test('normalizeMarathiDigits converts Devanagari numerals to ASCII digits', () => {
  assert.equal(normalizeMarathiDigits('४३'), '43');
  assert.equal(normalizeMarathiDigits('०१२३४५६७८९'), '0123456789');
  assert.equal(normalizeMarathiDigits(' 43 '), '43');
});

test('Deterministic grading marks independent correct answer with full score', () => {
  const result = gradeAnswer('q_to_01', '43', 0); // 0 hints
  assert.equal(result.isCorrect, true);
  assert.equal(result.isIndependent, true);
  assert.equal(result.score, 1.0);
  assert.equal(result.detectedMisconception, undefined);
});

test('Deterministic grading identifies reversed digits misconception', () => {
  const result = gradeAnswer('q_to_01', '34', 0);
  assert.equal(result.isCorrect, false);
  assert.equal(result.detectedMisconception?.key, 'tens_ones_reversed');
  assert.match(result.feedbackEn, /reversed the tens and ones/i);
});

test('Deterministic grading recognizes Marathi input correctly', () => {
  const result = gradeAnswer('q_to_01', '४३', 0); // Marathi '43'
  assert.equal(result.isCorrect, true);
});

test('Hint-assisted answer does not count as independent mastery', () => {
  const result = gradeAnswer('q_to_02', 5, 2); // tier 2 hint used
  assert.equal(result.isCorrect, true);
  assert.equal(result.isIndependent, false);
  assert.equal(result.score, 0.5);
});

test('Adaptive learning planner promotes to provisional mastery after 3 consecutive independent successes', () => {
  const testChild = db.createChild({
    parentId: 'parent_test_1',
    name: 'Test Learner',
    age: 7,
    grade: 'Grade 2',
    language: 'en',
    curriculum: 'cbse',
    subjects: ['Mathematics'],
    avatar: '🦁',
    accessibility: {
      ttsEnabled: true,
      ttsSpeed: 1.0,
      dyslexiaFont: false,
      largeTouchTargets: false,
      soundEffects: true
    },
    diagnosticCompleted: true
  });

  const skillId = 'skill_sub_numberline';

  // 1st independent success -> practising
  let res = handleAnswerAndAdvanceState(testChild.id, skillId, true, true);
  assert.equal(res.updatedConsecutive, 1);

  // 2nd independent success
  res = handleAnswerAndAdvanceState(testChild.id, skillId, true, true);
  assert.equal(res.updatedConsecutive, 2);

  // 3rd independent success -> should reach provisional_mastery and schedule revision in 1 day
  res = handleAnswerAndAdvanceState(testChild.id, skillId, true, true);
  assert.equal(res.updatedConsecutive, 3);
  assert.equal(res.newState, 'provisional_mastery');
  assert.equal(res.scheduledRevisionDays, 1);

  // Clean up
  db.deleteChild(testChild.id);
});

test('Child deletion cascades and cleans all child-specific data', () => {
  const child = db.createChild({
    parentId: 'parent_test_cascade',
    name: 'Temporary Child',
    age: 6,
    grade: 'Grade 1',
    language: 'en',
    curriculum: 'cbse',
    subjects: ['Mathematics'],
    avatar: '🐼',
    accessibility: {
      ttsEnabled: true,
      ttsSpeed: 1.0,
      dyslexiaFont: false,
      largeTouchTargets: false,
      soundEffects: true
    },
    diagnosticCompleted: false
  });

  db.recordResponse({
    childId: child.id,
    sessionId: 'sess_temp',
    questionId: 'q_co_01',
    skillId: 'skill_count_objects',
    submittedAnswer: '7',
    isCorrect: true,
    isIndependent: true,
    hintTierUsed: 0,
    timeSpentMs: 4000
  });

  assert.equal(db.getResponses(child.id).length, 1);

  const deleted = db.deleteChild(child.id);
  assert.equal(deleted, true);
  assert.equal(db.getChild(child.id), undefined);
  assert.equal(db.getResponses(child.id).length, 0);
});

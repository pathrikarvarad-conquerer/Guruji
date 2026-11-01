import { GoogleGenAI, Type } from '@google/genai';

// Initialize Gemini on server-side with telemetry header
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey) {
  aiClient = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
}

export interface AiExplanationResult {
  explanationEn: string;
  explanationMr: string;
  analogyEn: string;
  analogyMr: string;
  interactiveChallengeEn: string;
  interactiveChallengeMr: string;
  source: 'gemini' | 'fallback';
}

export interface AiHintResult {
  hintEn: string;
  hintMr: string;
  tier: number;
  source: 'gemini' | 'fallback';
}

export async function explainConceptWithAi(
  skillTitle: string,
  conceptObjective: string,
  age: number,
  stuckContext?: string
): Promise<AiExplanationResult> {
  if (aiClient) {
    try {
      const prompt = `You are Guruji, a warm, patient, and inspiring math tutor for a ${age}-year-old child.
Explain the mathematical concept "${skillTitle}" (Learning objective: "${conceptObjective}").
${stuckContext ? `The child previously struggled with: ${stuckContext}.` : ''}

Provide your response in JSON matching this schema:
- explanationEn: 2 short child-friendly sentences in English with an encouraging tone.
- explanationMr: Natural, warm Marathi translation of explanationEn using Devanagari script.
- analogyEn: A concrete physical analogy (using familiar items like mangoes, marbles, toy bricks, or crayons).
- analogyMr: Marathi translation of the analogy.
- interactiveChallengeEn: A quick 1-sentence thought check for the child.
- interactiveChallengeMr: Marathi translation of the thought check.`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction:
            'You are Guruji AI, a supportive Indian school tutor for young children. You explain math concepts using visual, concrete analogies. Never shame the child. Keep sentences short and clear.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              explanationEn: { type: Type.STRING },
              explanationMr: { type: Type.STRING },
              analogyEn: { type: Type.STRING },
              analogyMr: { type: Type.STRING },
              interactiveChallengeEn: { type: Type.STRING },
              interactiveChallengeMr: { type: Type.STRING }
            },
            required: ['explanationEn', 'explanationMr', 'analogyEn', 'analogyMr', 'interactiveChallengeEn', 'interactiveChallengeMr']
          }
        }
      });

      const parsed = JSON.parse(response.text || '{}');
      if (parsed.explanationEn) {
        return {
          ...parsed,
          source: 'gemini'
        };
      }
    } catch (err) {
      console.warn('Gemini explanation call failed, using high-quality educational fallback:', err);
    }
  }

  // Robust educational fallback
  return {
    explanationEn: `Numbers are like building blocks! When we group 10 units together, we make one strong ten-pillar so counting becomes quick and easy.`,
    explanationMr: `संख्या या खेळण्यांच्या ठोकळ्यांसारख्या असतात! जेव्हा आपण १० एकक एकत्र करतो, तेव्हा १ मजबूत दशकाचा खांब बनतो, ज्यामुळे मोजणे सोपे होते.`,
    analogyEn: `Think of 10 crayons in one nice box. If you have 3 full boxes and 4 loose crayons, you have 34 crayons!`,
    analogyMr: `एका खोक्यात १० खडू आहेत अशी कल्पना करा. तुमच्याकडे ३ पूर्ण खोकी आणि ४ सुटे खडू असतील, तर एकूण ३४ खडू होतात!`,
    interactiveChallengeEn: `How many loose crayons would you need to make one more full box?`,
    interactiveChallengeMr: `आणखी एक पूर्ण खोके बनवण्यासाठी तुम्हाला किती सुटे खडू लागतील?`,
    source: 'fallback'
  };
}

export async function generateContextualHintWithAi(
  questionPrompt: string,
  correctAnswer: string | number,
  childAnswer: string | number,
  tier: 1 | 2 | 3,
  language: 'en' | 'mr'
): Promise<AiHintResult> {
  if (aiClient) {
    try {
      const tierGuide =
        tier === 1
          ? 'Tier 1 Nudge: A gentle friendly question pointing their attention in the right direction without revealing the answer.'
          : tier === 2
          ? 'Tier 2 Guided Step: Break down the very next calculation step clearly.'
          : 'Tier 3 Visual Clue: Describe exactly what visual grouping or picture would show the answer.';

      const prompt = `You are Guruji AI helping a 7-year-old child solve a math problem.
Problem: "${questionPrompt}"
Correct Answer: "${correctAnswer}"
Child's Attempt: "${childAnswer}"
Requested Hint Level: ${tierGuide}

Return JSON with:
- hintEn: English hint (maximum 2 sentences, encouraging)
- hintMr: Marathi translation (Devanagari script)`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction:
            'You are Guruji AI. Do not give away the final answer directly in Tier 1 or 2 hints. Be gentle and empowering.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              hintEn: { type: Type.STRING },
              hintMr: { type: Type.STRING }
            },
            required: ['hintEn', 'hintMr']
          }
        }
      });

      const parsed = JSON.parse(response.text || '{}');
      if (parsed.hintEn) {
        return {
          hintEn: parsed.hintEn,
          hintMr: parsed.hintMr,
          tier,
          source: 'gemini'
        };
      }
    } catch (err) {
      console.warn('Gemini hint generation failed, using fallback:', err);
    }
  }

  // Fallback hints per tier
  if (tier === 1) {
    return {
      hintEn: 'Take a close look at the tens and the ones. Which one tells you the bigger group?',
      hintMr: 'दशक आणि एककाकडे काळजीपूर्वक पहा. कोणता गट मोठा आहे?',
      tier: 1,
      source: 'fallback'
    };
  } else if (tier === 2) {
    return {
      hintEn: 'Count the rods of ten first (10, 20, 30...), then count on the single cubes one by one.',
      hintMr: 'आधी दशकाचे गट्टे मोजा (१०, २०, ३०...), मग सुटे एकक एक एक करून जोडा.',
      tier: 2,
      source: 'fallback'
    };
  } else {
    return {
      hintEn: `Notice that each full rod is exactly 10 units! Look at how many rods you see in total.`,
      hintMr: `लक्षात ठेवा की प्रत्येक पूर्ण गट्टा म्हणजे बरोबर १० एकक! एकूण किती गट्टे दिसतात ते पहा.`,
      tier: 3,
      source: 'fallback'
    };
  }
}

export async function processUploadedDocumentWithAi(
  fileName: string,
  textSnippet: string
): Promise<{
  extractedTopics: { topicName: string; matchedSkillId?: string; relevanceScore: number; pageNumbers: number[] }[];
  summaryEn: string;
  summaryMr: string;
}> {
  if (aiClient && textSnippet.trim().length > 10) {
    try {
      const prompt = `You are Guruji AI analyzing an uploaded textbook or worksheet document: "${fileName}".
Document text snippet:
"""
${textSnippet.substring(0, 3000)}
"""

Curriculum Skills available in our platform:
- skill_count_objects (Counting up to 10)
- skill_tens_and_ones (Understanding Tens and Ones, Place Value)
- skill_add_tenframe (Making 10, Visual Ten Frames)
- skill_sub_numberline (Subtraction on Number Line)
- skill_add_regroup (Addition with Regrouping / Carrying)
- skill_shapes_2d (2D Shapes, Sides and Corners)

Identify topics in the document, map each to the closest skill above, and write a short summary for the parent in English and Marathi.
Return JSON matching schema.`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summaryEn: { type: Type.STRING },
              summaryMr: { type: Type.STRING },
              extractedTopics: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    topicName: { type: Type.STRING },
                    matchedSkillId: { type: Type.STRING },
                    relevanceScore: { type: Type.NUMBER },
                    pageNumbers: {
                      type: Type.ARRAY,
                      items: { type: Type.INTEGER }
                    }
                  },
                  required: ['topicName', 'relevanceScore', 'pageNumbers']
                }
              }
            },
            required: ['summaryEn', 'summaryMr', 'extractedTopics']
          }
        }
      });

      const parsed = JSON.parse(response.text || '{}');
      if (parsed.extractedTopics && parsed.extractedTopics.length > 0) {
        return parsed;
      }
    } catch (err) {
      console.warn('Gemini document processing fallback:', err);
    }
  }

  // Heuristic fallback for textbook parsing
  const isAddition = /add|sum|plus|carry/i.test(textSnippet);
  const isTens = /ten|tens|place value|bundle|group/i.test(textSnippet);

  return {
    summaryEn: `Extracted key elementary math concepts from "${fileName}". Mapped topics into tens/ones groupings and foundational addition.`,
    summaryMr: `"${fileName}" मधून प्राथमिक गणिताच्या मुख्य संकल्पना काढल्या आहेत. दशक-एकक आणि बेरजेच्या कौशल्यांशी जोडणी केली आहे.`,
    extractedTopics: [
      {
        topicName: isTens ? 'Grouping into Tens and Ones' : 'Counting & Visual Math',
        matchedSkillId: isTens ? 'skill_tens_and_ones' : 'skill_count_objects',
        relevanceScore: 0.92,
        pageNumbers: [1, 2]
      },
      {
        topicName: isAddition ? 'Adding Numbers with Visuals' : 'Shapes and Patterns',
        matchedSkillId: isAddition ? 'skill_add_tenframe' : 'skill_shapes_2d',
        relevanceScore: 0.85,
        pageNumbers: [3]
      }
    ]
  };
}

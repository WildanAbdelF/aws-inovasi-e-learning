import { QuizQuestion, QuizOption } from "@/types/course";

interface GeneratedQuiz {
  questions: QuizQuestion[];
}

interface QuizGeneratorConfig {
  numberOfQuestions: number;
  difficulty: "easy" | "medium" | "hard";
  language: "id" | "en";
}

const DEFAULT_CONFIG: QuizGeneratorConfig = {
  numberOfQuestions: 5,
  difficulty: "medium",
  language: "id",
};

/**
 * Generate quiz questions from course material using LLM
 * Supports OpenAI, Google Gemini, or AWS Bedrock
 */
export async function generateQuizFromMaterial(
  materialContent: string,
  materialTitle: string,
  config: Partial<QuizGeneratorConfig> = {}
): Promise<QuizQuestion[]> {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  
  const prompt = buildPrompt(materialContent, materialTitle, finalConfig);
  
  // Choose your preferred LLM provider
  const response = await callLLMProvider(prompt);
  
  return parseQuizResponse(response);
}

function buildPrompt(
  content: string,
  title: string,
  config: QuizGeneratorConfig
): string {
  const languageInstruction = config.language === "id" 
    ? "Buat pertanyaan dalam Bahasa Indonesia" 
    : "Create questions in English";
    
  const difficultyInstruction = {
    easy: "Buat pertanyaan sederhana yang menguji pemahaman dasar",
    medium: "Buat pertanyaan yang menguji pemahaman konsep secara mendalam",
    hard: "Buat pertanyaan yang menantang dan memerlukan analisis kritis",
  }[config.difficulty];

  return `
Anda adalah sistem pembuat kuis otomatis untuk platform e-learning.

MATERI PEMBELAJARAN:
Judul: ${title}
Konten:
${content}

INSTRUKSI:
1. ${languageInstruction}
2. ${difficultyInstruction}
3. Buat ${config.numberOfQuestions} pertanyaan pilihan ganda
4. Setiap pertanyaan harus memiliki 4 opsi jawaban (A, B, C, D)
5. Hanya satu jawaban yang benar
6. Pertanyaan harus relevan dengan materi yang diberikan
7. Jangan membuat pertanyaan yang jawabannya tidak ada di materi

FORMAT OUTPUT (JSON):
{
  "questions": [
    {
      "id": "q1",
      "questionText": "Pertanyaan di sini?",
      "options": [
        { "id": "q1-a", "text": "Opsi A" },
        { "id": "q1-b", "text": "Opsi B" },
        { "id": "q1-c", "text": "Opsi C" },
        { "id": "q1-d", "text": "Opsi D" }
      ],
      "correctOptionId": "q1-a",
      "explanation": "Penjelasan mengapa jawaban ini benar"
    }
  ]
}

Pastikan output HANYA berupa JSON yang valid tanpa teks tambahan.
`;
}

/**
 * Call LLM Provider - Choose one based on your preference
 */
async function callLLMProvider(prompt: string): Promise<string> {
  // Option 1: OpenAI
  // return await callOpenAI(prompt);
  
  // Option 2: Google Gemini
  // return await callGemini(prompt);
  
  // Option 3: AWS Bedrock (Claude)
  // return await callAWSBedrock(prompt);
  
  // For demo purposes, throw error to remind user to configure
  throw new Error("Please configure an LLM provider in quizGenerator.ts");
}

/**
 * OpenAI GPT Implementation
 */
async function callOpenAI(prompt: string): Promise<string> {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini", // atau "gpt-4" untuk hasil lebih baik
      messages: [
        {
          role: "system",
          content: "You are a quiz generator that outputs valid JSON only.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      response_format: { type: "json_object" },
    }),
  });

  const data = await response.json();
  return data.choices[0].message.content;
}

/**
 * Google Gemini Implementation
 */
async function callGemini(prompt: string): Promise<string> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GOOGLE_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          responseMimeType: "application/json",
        },
      }),
    }
  );

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}

/**
 * AWS Bedrock (Claude) Implementation
 * Requires: npm install @aws-sdk/client-bedrock-runtime
 */
async function callAWSBedrock(prompt: string): Promise<string> {
  void prompt;
  throw new Error(
    "AWS Bedrock provider is disabled in this build. Install @aws-sdk/client-bedrock-runtime and re-enable callAWSBedrock implementation if needed."
  );
}

/**
 * Parse LLM response to QuizQuestion array
 */
function parseQuizResponse(response: string): QuizQuestion[] {
  try {
    // Clean response - remove markdown code blocks if present
    let cleanedResponse = response.trim();
    if (cleanedResponse.startsWith("```json")) {
      cleanedResponse = cleanedResponse.slice(7);
    }
    if (cleanedResponse.startsWith("```")) {
      cleanedResponse = cleanedResponse.slice(3);
    }
    if (cleanedResponse.endsWith("```")) {
      cleanedResponse = cleanedResponse.slice(0, -3);
    }

    const parsed: GeneratedQuiz = JSON.parse(cleanedResponse);
    
    // Validate and transform to QuizQuestion format
    return parsed.questions.map((q, index) => ({
      id: q.id || `q${index + 1}`,
      questionText: q.questionText,
      options: q.options.map((opt, optIndex) => ({
        id: opt.id || `q${index + 1}-${String.fromCharCode(97 + optIndex)}`,
        text: opt.text,
      })),
      correctOptionId: q.correctOptionId,
    }));
  } catch (error) {
    console.error("Failed to parse quiz response:", error);
    throw new Error("Failed to parse generated quiz from LLM response");
  }
}

/**
 * Generate quiz for entire module (combining all page contents)
 */
export async function generateQuizForModule(
  moduleItems: Array<{ title: string; content: string; type: string }>,
  config?: Partial<QuizGeneratorConfig>
): Promise<QuizQuestion[]> {
  // Combine all page contents from the module
  const combinedContent = moduleItems
    .filter((item) => item.type === "page")
    .map((item) => `## ${item.title}\n${item.content}`)
    .join("\n\n");

  if (!combinedContent.trim()) {
    throw new Error("No page content found in module to generate quiz from");
  }

  return generateQuizFromMaterial(
    combinedContent,
    "Module Quiz",
    config
  );
}

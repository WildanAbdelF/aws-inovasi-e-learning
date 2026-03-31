# Auto Quiz Generator - Dokumentasi

## Overview

Fitur Auto Quiz Generator memungkinkan admin untuk secara otomatis membuat soal quiz pilihan ganda (multiple choice) dari konten materi pembelajaran menggunakan Machine Learning / LLM (Large Language Model).

## Arsitektur

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (React)                          │
│  ┌─────────────────┐    ┌─────────────────┐                     │
│  │ AutoQuizGenerator│───▶│ useQuizGenerator│                     │
│  │    Component    │    │      Hook       │                     │
│  └─────────────────┘    └────────┬────────┘                     │
│                                  │                               │
└──────────────────────────────────┼───────────────────────────────┘
                                   │ HTTP POST
                                   ▼
┌─────────────────────────────────────────────────────────────────┐
│                     API Route (Next.js)                          │
│              app/api/quiz/generate/route.ts                      │
│                                 │                                │
└─────────────────────────────────┼────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Quiz Generator Service                        │
│              lib/services/quizGenerator.ts                       │
│                                 │                                │
│    ┌────────────┬───────────────┼───────────────┬────────────┐  │
│    │            │               │               │            │  │
│    ▼            ▼               ▼               ▼            ▼  │
│ ┌──────┐  ┌─────────┐  ┌─────────────┐  ┌──────────┐  ┌─────┐  │
│ │OpenAI│  │ Gemini  │  │AWS Bedrock  │  │ Ollama   │  │ ... │  │
│ │ GPT  │  │         │  │  (Claude)   │  │ (Local)  │  │     │  │
│ └──────┘  └─────────┘  └─────────────┘  └──────────┘  └─────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Setup Instructions

### Opsi 1: OpenAI GPT (Recommended untuk kemudahan)

1. Dapatkan API Key dari [OpenAI Platform](https://platform.openai.com/api-keys)

2. Tambahkan ke `.env.local`:
```env
OPENAI_API_KEY=sk-your-api-key-here
```

3. Edit `lib/services/quizGenerator.ts`, uncomment OpenAI:
```typescript
async function callLLMProvider(prompt: string): Promise<string> {
  return await callOpenAI(prompt);
}
```

**Estimasi Biaya:**
- GPT-4o-mini: ~$0.0001 per quiz (5 pertanyaan)
- GPT-4o: ~$0.001 per quiz (5 pertanyaan)

### Opsi 2: Google Gemini (Gratis hingga limit tertentu)

1. Dapatkan API Key dari [Google AI Studio](https://aistudio.google.com/app/apikey)

2. Tambahkan ke `.env.local`:
```env
GOOGLE_API_KEY=AIza-your-api-key-here
```

3. Edit `lib/services/quizGenerator.ts`, uncomment Gemini:
```typescript
async function callLLMProvider(prompt: string): Promise<string> {
  return await callGemini(prompt);
}
```

**Free Tier:**
- Gemini 1.5 Flash: 15 RPM (requests per minute), 1M tokens/day

### Opsi 3: AWS Bedrock (Untuk produksi enterprise)

1. Setup AWS credentials:
```env
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
```

2. Install AWS SDK:
```bash
npm install @aws-sdk/client-bedrock-runtime
```

3. Edit `lib/services/quizGenerator.ts`, uncomment AWS Bedrock:
```typescript
async function callLLMProvider(prompt: string): Promise<string> {
  return await callAWSBedrock(prompt);
}
```

**Available Models:**
- Claude 3 Sonnet/Opus
- Llama 2
- Titan Text

### Opsi 4: Self-Hosted dengan Ollama (Gratis, lokal)

1. Install [Ollama](https://ollama.ai/)

2. Download model:
```bash
ollama pull llama3.1
```

3. Tambahkan fungsi ke `quizGenerator.ts`:
```typescript
async function callOllama(prompt: string): Promise<string> {
  const response = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "llama3.1",
      prompt: prompt,
      stream: false,
      format: "json",
    }),
  });
  const data = await response.json();
  return data.response;
}
```

**Pros:** Gratis, privasi data terjaga
**Cons:** Kualitas bergantung GPU, perlu hosting sendiri

## Penggunaan di Admin Page

### Integrasi dengan Quiz Editor

Tambahkan `AutoQuizGenerator` ke halaman admin untuk membuat quiz:

```tsx
import { AutoQuizGenerator } from "@/components/quiz";
import { QuizQuestion } from "@/types/course";

function AdminQuizSection({ moduleItems, onQuizGenerated }) {
  const handleQuizGenerated = (questions: QuizQuestion[]) => {
    // Update state dengan quiz yang di-generate
    console.log("Generated questions:", questions);
    onQuizGenerated(questions);
  };

  return (
    <div>
      <h3>Quiz</h3>
      <AutoQuizGenerator
        moduleItems={moduleItems}
        onQuizGenerated={handleQuizGenerated}
      />
    </div>
  );
}
```

### Menggunakan Hook secara langsung

```tsx
import { useQuizGenerator } from "@/lib/hooks";

function MyComponent() {
  const { generateQuiz, isLoading, error } = useQuizGenerator();

  const handleGenerate = async () => {
    const questions = await generateQuiz(
      "Konten materi di sini...",
      "Judul Materi",
      {
        numberOfQuestions: 5,
        difficulty: "medium",
        language: "id",
      }
    );
    console.log(questions);
  };

  return (
    <button onClick={handleGenerate} disabled={isLoading}>
      {isLoading ? "Generating..." : "Generate Quiz"}
    </button>
  );
}
```

## Format Output Quiz

Quiz yang di-generate akan mengikuti format `QuizQuestion`:

```typescript
interface QuizQuestion {
  id: string;
  questionText: string;
  options: QuizOption[];
  correctOptionId: string;
}

interface QuizOption {
  id: string;
  text: string;
}
```

Contoh output:
```json
{
  "questions": [
    {
      "id": "q1",
      "questionText": "Apa tujuan utama dari User Experience (UX) Design?",
      "options": [
        { "id": "q1-a", "text": "Membuat interface terlihat menarik" },
        { "id": "q1-b", "text": "Memastikan produk fungsional dan mudah digunakan" },
        { "id": "q1-c", "text": "Menulis kode aplikasi" },
        { "id": "q1-d", "text": "Membuat animasi website" }
      ],
      "correctOptionId": "q1-b"
    }
  ]
}
```

## Konfigurasi Quiz Generation

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `numberOfQuestions` | number | 5 | Jumlah pertanyaan (3-15) |
| `difficulty` | string | "medium" | Tingkat kesulitan: "easy", "medium", "hard" |
| `language` | string | "id" | Bahasa: "id" (Indonesia), "en" (English) |

## Best Practices

### 1. Konten yang Baik untuk Quiz Generation
- Konten dengan fakta dan konsep yang jelas
- Materi yang memiliki poin-poin penting
- Teks dengan struktur yang baik (heading, paragraf)

### 2. Review Generated Quiz
- Selalu review quiz yang di-generate sebelum publish
- Edit pertanyaan yang kurang tepat
- Pastikan jawaban benar konsisten dengan materi

### 3. Optimasi Biaya
- Gunakan Gemini untuk development (gratis)
- Gunakan GPT-4o-mini untuk produksi (murah)
- Cache quiz yang sudah di-generate untuk materi yang sama

## Troubleshooting

### Error: "Please configure an LLM provider"
➜ Buka `lib/services/quizGenerator.ts` dan uncomment salah satu provider

### Error: "Failed to parse generated quiz"
➜ Model LLM mungkin tidak menghasilkan JSON valid. Coba generate ulang

### Quiz tidak relevan dengan materi
➜ Pastikan konten materi cukup panjang dan informatif (minimal 200 kata)

## Alternatif: Custom ML Model

Jika ingin membuat model sendiri tanpa menggunakan LLM API:

### 1. Question Generation dengan T5/BART
```python
# Python/HuggingFace approach
from transformers import T5ForConditionalGeneration, T5Tokenizer

model = T5ForConditionalGeneration.from_pretrained("valhalla/t5-base-qg-hl")
tokenizer = T5Tokenizer.from_pretrained("valhalla/t5-base-qg-hl")

def generate_questions(context):
    input_text = f"generate question: {context}"
    inputs = tokenizer(input_text, return_tensors="pt", max_length=512)
    outputs = model.generate(**inputs, max_length=64)
    return tokenizer.decode(outputs[0], skip_special_tokens=True)
```

### 2. Distractor Generation
Untuk membuat pilihan jawaban yang salah (distractor):
- Gunakan word embeddings (Word2Vec, FastText)
- Entity extraction untuk mencari entitas serupa
- Paraphrase generation untuk variasi jawaban

### 3. Deploy sebagai API
- Flask/FastAPI untuk Python backend
- Deploy ke AWS Lambda, Google Cloud Functions, atau container

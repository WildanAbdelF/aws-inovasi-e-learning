# Flow Teknis Auto MCQ Generation - Penjelasan Detail

## 1. FLOW KESELURUHAN (High-Level)

```
┌─────────────────────────────────────────────────────────────────┐
│                    ADMIN INTERFACE (UI)                          │
│  - Pilih jumlah soal (3-15)                                     │
│  - Pilih tingkat kesulitan (mudah/sedang/sulit)                 │
│  - Pilih bahasa (Indonesia/English)                             │
│  - Klik tombol "Generate Quiz"                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│              BUSINESS LOGIC LAYER (useQuizGenerator Hook)        │
│  - State management (isLoading, error, generatedQuestions)      │
│  - Prepare data & config                                        │
│  - Call API endpoint                                            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│           API LAYER (POST /api/quiz/generate)                    │
│  - Validate input (content atau moduleItems ada)                │
│  - Validate config (numberOfQuestions: 3-15, difficulty valid)  │
│  - Route ke service layer                                       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│         SERVICE LAYER (Quiz Generator Service)                   │
│  1. Build Prompt (injection content + config)                   │
│  2. Select LLM Provider (Gemini > OpenAI > Dummy)               │
│  3. Call LLM API                                                │
│  4. Parse Response (error recovery)                             │
│  5. Validate & Transform                                        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│              RETURN TO UI                                        │
│  - Display soal di admin interface                              │
│  - Admin bisa review/edit sebelum publish                       │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. DETAILED STEP-BY-STEP FLOW

### **STEP 1: USER TRIGGER (Admin UI)**

```
What happens: Admin click tombol "Generate Quiz"

Input Data:
{
  content: "Machine learning adalah sub-field dari artificial intelligence...",
  // ATAU
  moduleItems: [
    { title: "Topic A", content: "...", type: "page" },
    { title: "Topic B", content: "...", type: "page" }
  ],
  
  config: {
    numberOfQuestions: 5,
    difficulty: "medium",
    language: "id"
  }
}

UI State Change:
- isLoading = false → true (button disabled, spinner visible)
- error = null
```

---

### **STEP 2: BUSINESS LOGIC PROCESSING (React Hook)**

```
Hook: useQuizGenerator()

Action:
const handleGenerateClick = async () => {
  try {
    setIsLoading(true);
    setError(null);
    
    // Call API
    const response = await fetch("/api/quiz/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: courseContent,
        config: { numberOfQuestions, difficulty, language }
      })
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    const data = await response.json();
    setGeneratedQuestions(data.questions); // Store questions in state
    
  } catch (error) {
    setError(error.message); // Display error
    console.error("Generation failed:", error);
    
  } finally {
    setIsLoading(false); // Stop loading
  }
};

Output:
- generatedQuestions state updated
- isLoading reset to false
- error set (if any)
```

---

### **STEP 3: API ENDPOINT VALIDATION (POST /api/quiz/generate)**

```
Route Handler: POST /api/quiz/generate

1️⃣ INPUT VALIDATION:
   Check: apakah ada "content" atau "moduleItems"?
   ├─ Jika tidak ada → Return HTTP 400
   │  {
   │    error: "ValidationError",
   │    message: "Either 'content' or 'moduleItems' is required",
   │    status: 400
   │  }
   └─ Jika ada → Lanjut ke step 2

2️⃣ CONFIG VALIDATION:
   Check: numberOfQuestions (3-15)?
   Check: difficulty (easy/medium/hard)?
   Check: language (id/en)?
   ├─ Jika invalid → Return HTTP 400
   └─ Jika valid → Lanjut ke step 3

3️⃣ ROUTE TO SERVICE:
   if (request.content) {
     // Single content generation
     questions = await generateQuizFromMaterial(
       content,
       title,
       config
     );
   } else {
     // Module generation
     questions = await generateQuizForModule(
       moduleItems,
       config
     );
   }

4️⃣ RETURN RESPONSE:
   HTTP 200 {
     success: true,
     questions: [...],
     count: 5
   }
```

---

### **STEP 4: SERVICE LAYER - PROMPT BUILDING**

```
Function: buildPrompt(content, title, config)

Output: String (structured prompt)

Structure:

PERAN SISTEM:
├─ Anda adalah sistem pembuat kuis otomatis untuk platform e-learning

MATERIAL INFORMATION:
├─ Judul: [title yang diberikan admin]
├─ Bahasa: [config.language]
├─ Tingkat Kesulitan: [config.difficulty]

CONTENT INJECTION:
├─ [Full content materi - ini krusial untuk mitigasi hallucination]
├─ Semua kata kunci dan konsep penting ada di sini
├─ LLM akan reference content ini untuk generate soal

INSTRUCTIONS:
├─ Jumlah soal: [config.numberOfQuestions]
├─ Format: 4 opsi (A, B, C, D)
├─ Satu jawaban benar
├─ CONSTRAINT KRITIS: Semua jawaban HARUS ada di materi
├─ Jangan hallucinate informasi baru

FORMAT OUTPUT:
└─ {
     "questions": [
       {
         "id": "q1",
         "questionText": "...",
         "options": [...],
         "correctOptionId": "...",
         "explanation": "..."
       }
     ]
   }

Example Prompt:

"""
Anda adalah sistem pembuat kuis otomatis untuk platform e-learning.

MATERIAL INFORMATION
Judul: Introduction to Machine Learning
Bahasa: Indonesia
Tingkat Kesulitan: medium

CONTENT
Machine learning adalah sub-field dari artificial intelligence yang fokus pada 
pengembangan algoritma dan model statistik yang dapat belajar dari data tanpa 
diprogram secara eksplisit...

[full content here - bisa panjang ribuan karakter]

INSTRUKSI
1. Hasilkan TEPAT 5 soal
2. Format: 4 opsi (A, B, C, D), satu benar
3. Tingkat kesulitan: medium (application dan analysis level)
4. Semua jawaban HARUS ada di content di atas
5. Output HANYA JSON, tidak ada teks tambahan

FORMAT OUTPUT
{
  "questions": [...]
}
"""
```

---

### **STEP 5: SERVICE LAYER - PROVIDER SELECTION**

```
Function: selectProvider()

Logic Decision Tree:

                      Start
                        │
                        ▼
              Is GOOGLE_API_KEY set?
             /                      \
           YES                       NO
            │                         │
            ▼                         ▼
        Use Gemini API         Is OPENAI_API_KEY set?
        ├─ Model: gemini-1.5   /                    \
        │        -flash-latest YES                   NO
        └─ Temperature: 0.7     │                     │
                                ▼                     ▼
                            Use OpenAI API        Use Dummy
                            ├─ Model: gpt-4o     (for development)
                            │        -mini
                            ├─ Temp: 0.7
                            └─ Max tokens: 2000

Example:
if (process.env.GOOGLE_API_KEY) {
  provider = new GeminiProvider(process.env.GOOGLE_API_KEY);
  console.log("Using Gemini API");
} else if (process.env.OPENAI_API_KEY) {
  provider = new OpenAIProvider(process.env.OPENAI_API_KEY);
  console.log("Using OpenAI API");
} else {
  provider = new DummyProvider();
  console.log("Using Dummy (development)");
}

return provider;
```

---

### **STEP 6: SERVICE LAYER - CALL LLM API**

```
Function: callLLMProvider(prompt, selectedProvider)

GEMINI CALL:
─────────────
const response = await genAI.getGenerativeModel({
  model: "gemini-1.5-flash-latest"
}).generateContent({
  contents: [{
    role: "user",
    parts: [{ text: prompt }]
  }],
  generationConfig: {
    temperature: 0.7,
    maxOutputTokens: 2000,
    responseMimeType: "application/json"
  }
});

const text = response.response.text();
// Returns: JSON string of generated questions

OPENAI CALL:
────────────
const response = await openai.chat.completions.create({
  model: "gpt-4o-mini",
  messages: [
    {
      role: "system",
      content: "You are a quiz generation system"
    },
    {
      role: "user",
      content: prompt
    }
  ],
  temperature: 0.7,
  max_tokens: 2000
});

const text = response.choices[0].message.content;
// Returns: JSON string of generated questions

DUMMY CALL:
───────────
return {
  questions: [
    {
      id: "q1",
      questionText: "[Dummy] Apa itu AI?",
      options: [
        { id: "q1-a", text: "[Dummy] Artificial Intelligence" },
        { id: "q1-b", text: "[Dummy] Automated Input" },
        { id: "q1-c", text: "[Dummy] Advanced Integration" },
        { id: "q1-d", text: "[Dummy] Application Interface" }
      ],
      correctOptionId: "q1-a",
      explanation: "[Dummy] Ini adalah dummy response"
    }
  ]
};

Timing:
├─ Gemini: ~2-5 detik (gratis tier cepat)
├─ OpenAI: ~3-8 detik (lebih reliable untuk quality)
└─ Dummy: ~100 ms (instant, untuk testing)
```

---

### **STEP 7: SERVICE LAYER - RESPONSE PARSING (ERROR RECOVERY)**

```
Function: parseQuizResponse(response: string)

INPUT: String dari LLM API
├─ Bisa plain JSON: {"questions": [...]}
├─ Bisa wrapped markdown: ```json\n{...}\n```
├─ Bisa dengan extra text: "Here's your quiz: {...}"
└─ Bisa malformed JSON: missing quotes, trailing commas, etc

PARSING ALGORITHM:

┌─────────────────────────────────────────────────────┐
│ STEP 1: EXTRACT JSON                                │
│ ─────────────────────────────────────────────────── │
│ Regex: /\{[\s\S]*\}/                                │
│ Goal: Find any JSON object in the response         │
│ Example:                                            │
│   Input: "Here's quiz: {\"questions\": [...]}"     │
│   Output: "{\"questions\": [...]}"                  │
└─────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────┐
│ STEP 2: CLEAN MARKDOWN CODE FENCE                   │
│ ─────────────────────────────────────────────────── │
│ Remove: ```json\n at start                          │
│ Remove: \n``` at end                                │
│ Example:                                            │
│   Input: "```json\n{...}\n```"                      │
│   Output: "{...}"                                   │
└─────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────┐
│ STEP 3: PARSE JSON                                  │
│ ─────────────────────────────────────────────────── │
│ Try: JSON.parse(cleanedJson)                        │
│ If error: throw with message                        │
│ Example:                                            │
│   Input: "{\"questions\": [...]}"                   │
│   Output: { questions: [...] }                      │
└─────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────┐
│ STEP 4: VALIDATE SCHEMA                             │
│ ─────────────────────────────────────────────────── │
│ Check: questions property exists?                   │
│ Check: questions is array?                          │
│ Check: each question has required fields?           │
│   - questionText (string)                           │
│   - options (array of 4 items)                      │
│   - correctOptionId (string)                        │
│ Example:                                            │
│   Input: { questions: [...] }                       │
│   Output: Validated ✓ or Error ✗                    │
└─────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────┐
│ STEP 5: NORMALIZE & TRANSFORM                       │
│ ─────────────────────────────────────────────────── │
│ Assign default IDs if missing                       │
│   - Question: q1, q2, q3, ... qN                    │
│   - Options: q1-a, q1-b, q1-c, q1-d                │
│ Trim whitespace from texts                          │
│ Ensure consistent format                           │
│ Example:                                            │
│   Input: { questions: [...] }                       │
│   Output: QuizQuestion[] (typed)                    │
└─────────────────────────────────────────────────────┘
                        │
                        ▼
                    RETURN
        QuizQuestion[] (ready to use)


ERROR RECOVERY EXAMPLE:

Raw LLM Response:
"""
Sure! Here are 5 quiz questions for your ML course:

```json
{
  "questions": [
    {
      "id": "q1",
      "questionText": "Apa itu machine learning?",
      "options": [
        {"id": "a", "text": "Teknologi yang belajar dari data"},
        {"id": "b", "text": "Program komputer biasa"},
        {"id": "c", "text": "Mesin pembelajaran manual"},
        {"id": "d", "text": "Algoritma prediksi"},
      ],
      "correctOptionId": "a"
    }
  ]
}
```

Hope this helps!
"""

Step 1 (Extract):
  → {
      "questions": [
        {
          "id": "q1",
          ...
        }
      ]
    }

Step 2 (Clean Markdown):
  → {
      "questions": [
        ...
      ]
    }

Step 3 (Parse JSON):
  → Parsed successfully ✓

Step 4 (Validate):
  → Schema valid ✓
  → But: option id "a" should be "q1-a" ✗

Step 5 (Transform):
  → {
      id: "q1",
      questionText: "Apa itu machine learning?",
      options: [
        { id: "q1-a", text: "Teknologi yang belajar dari data" },
        { id: "q1-b", text: "Program komputer biasa" },
        { id: "q1-c", text: "Mesin pembelajaran manual" },
        { id: "q1-d", text: "Algoritma prediksi" }
      ],
      correctOptionId: "q1-a"
    }

FINAL OUTPUT: Ready to display ✓
```

---

### **STEP 8: VALIDATION & TRANSFORMATION**

```
Function: transformToQuizQuestions(parsed)

INPUT: Parsed but unnormalized data

TRANSFORMATIONS:

1. ID Normalization:
   ├─ If no question id → assign q1, q2, q3, ...
   └─ If no option id → assign q1-a, q1-b, q1-c, q1-d

2. Field Cleanup:
   ├─ Trim() all text fields
   ├─ Remove extra whitespace
   └─ Remove HTML tags (if any)

3. Correctness Verification:
   ├─ Check: correctOptionId points to existing option
   ├─ If not → Find best match or flag error
   └─ Ensure exactly 4 options

4. Type Casting:
   └─ Convert to TypeScript interface QuizQuestion[]

EXAMPLE:

Input:
{
  questions: [
    {
      id: undefined,
      questionText: "  Apa itu ML?  ",
      options: [
        { id: "opt1", text: "  Artificial Intelligence  " },
        { id: "opt2", text: "Komputer biasa" },
        { id: "opt3", text: "Mesin pembelajaran" },
        { id: "opt4", text: "Algoritma" }
      ],
      correctOptionId: "opt1"
    }
  ]
}

Output:
{
  id: "q1",
  questionText: "Apa itu ML?",
  options: [
    { id: "q1-a", text: "Artificial Intelligence" },
    { id: "q1-b", text: "Komputer biasa" },
    { id: "q1-c", text: "Mesin pembelajaran" },
    { id: "q1-d", text: "Algoritma" }
  ],
  correctOptionId: "q1-a"
}
```

---

### **STEP 9: RETURN TO API LAYER**

```
API Response Handler:

SUCCESS (HTTP 200):
{
  "success": true,
  "questions": [
    {
      "id": "q1",
      "questionText": "Apa itu machine learning?",
      "options": [
        { "id": "q1-a", "text": "Teknologi yang belajar dari data" },
        { "id": "q1-b", "text": "Program komputer biasa" },
        { "id": "q1-c", "text": "Mesin pembelajaran manual" },
        { "id": "q1-d", "text": "Algoritma prediksi" }
      ],
      "correctOptionId": "q1-a",
      "explanation": "Machine learning adalah sub-field dari AI..."
    },
    // more questions...
  ],
  "count": 5,
  "generatedAt": "2024-05-26T10:30:00Z"
}

ERROR (HTTP 500):
{
  "error": "GenerationError",
  "message": "Failed to parse AI response: Invalid JSON structure",
  "status": 500
}
```

---

### **STEP 10: UPDATE UI STATE**

```
Hook State Update:

// From API response
const data = await response.json();

setGeneratedQuestions(data.questions);
// state.generatedQuestions = [
//   { id: "q1", questionText: "...", options: [...], ... },
//   { id: "q2", questionText: "...", options: [...], ... },
//   // ...
// ]

setIsLoading(false);
// Button enabled again, spinner hidden

setError(null);
// No error message displayed

UI RENDER:
├─ Display 5 soal di admin interface
├─ Each soal show: question, 4 options, mark correct answer
├─ Show admin buttons: Edit, Delete, Add, Publish
└─ Ready for human review
```

---

### **STEP 11: HUMAN-IN-THE-LOOP REVIEW**

```
Admin Review Phase:

Display:
┌─────────────────────────────────────────────────────┐
│ Question 1 of 5                                     │
├─────────────────────────────────────────────────────┤
│ Q: Apa itu machine learning?                        │
│                                                      │
│ A) ☑ Teknologi yang belajar dari data               │ ✓ Correct
│ B) ☐ Program komputer biasa                         │
│ C) ☐ Mesin pembelajaran manual                      │
│ D) ☐ Algoritma prediksi                             │
│                                                      │
│ Explanation: ML adalah...                           │
│                                                      │
│ [Edit] [Delete] [Move Down]                         │
└─────────────────────────────────────────────────────┘

Admin can:
1. Edit question text
2. Edit option text
3. Change correct answer
4. Delete question
5. Add new option
6. Reorder questions
7. Publish to database

After review → Admin click "Publish"
```

---

### **STEP 12: PUBLISH TO DATABASE**

```
Final Step: Save to Supabase

Data to save:
{
  id: uuid(),
  course_id: "course-123",
  module_id: "module-456",
  title: "Auto-generated Quiz",
  description: "Generated by AI Quiz Generator",
  questions: [
    {
      id: "q1",
      questionText: "...",
      options: [
        { id: "q1-a", text: "..." },
        { id: "q1-b", text: "..." },
        { id: "q1-c", text: "..." },
        { id: "q1-d", text: "..." }
      ],
      correctOptionId: "q1-a",
      explanation: "..."
    },
    // ... more questions
  ],
  generated_by: "llm",  // Mark as LLM-generated
  reviewed_by: "admin-id",
  created_at: new Date(),
  updated_at: new Date()
}

Query:
INSERT INTO quizzes (id, course_id, module_id, ...) 
VALUES (...)

Result: ✓ Soal tersimpan dan siap digunakan learners
```

---

## 3. COMPLETE FLOW DIAGRAM (Visual)

```
┌──────────────┐
│ Admin UI     │
│ - Settings   │
│ - Content    │
└──────┬───────┘
       │ Click "Generate"
       ▼
┌──────────────────────────┐
│ Business Logic Hook      │
│ - setIsLoading(true)     │
│ - Prepare data           │
└──────┬───────────────────┘
       │ fetch POST /api/quiz/generate
       ▼
┌──────────────────────────┐
│ API Layer Validation     │
│ - Check inputs           │
│ - Check config           │
└──────┬───────────────────┘
       │ Pass to service
       ▼
┌──────────────────────────┐
│ Service: Build Prompt    │
│ - Inject content         │
│ - Add instructions       │
│ - Format template        │
└──────┬───────────────────┘
       │ Prompt ready
       ▼
┌──────────────────────────┐
│ Service: Select Provider │
│ - Check API keys         │
│ - Gemini > OpenAI > Dummy│
└──────┬───────────────────┘
       │ Provider selected
       ▼
┌──────────────────────────┐
│ Call LLM API             │
│ - Send prompt            │
│ - Wait for response      │
│ (2-8 seconds)            │
└──────┬───────────────────┘
       │ JSON response
       ▼
┌──────────────────────────┐
│ Parse Response           │
│ - Extract JSON           │
│ - Clean markdown         │
│ - Validate schema        │
│ - Normalize IDs          │
└──────┬───────────────────┘
       │ QuizQuestion[]
       ▼
┌──────────────────────────┐
│ Return to Hook           │
│ - setGeneratedQuestions  │
│ - setIsLoading(false)    │
└──────┬───────────────────┘
       │ State updated
       ▼
┌──────────────────────────┐
│ UI Display               │
│ - Show soal di interface │
│ - Enable admin controls  │
└──────┬───────────────────┘
       │ Admin review
       ▼
┌──────────────────────────┐
│ Human Review             │
│ - Edit if needed         │
│ - Verify correctness     │
│ - Click Publish          │
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────┐
│ Save to Database         │
│ INSERT quizzes table     │
└──────────────────────────┘
       │
       ▼
    ✓ DONE
```

---

## 4. CONTOH REAL FLOW (Dari Start Sampai Finish)

```
SCENARIO:
- Admin mau generate 5 soal (medium level, Bahasa Indonesia)
- Dari course "Machine Learning Basics"
- Content ada ~2000 kata tentang ML fundamentals

TIMELINE:

00:00 - Admin klik "Generate Quiz"
        UI: Loading spinner muncul, button disabled

00:01 - Hook: fetch("/api/quiz/generate", {
          content: "Machine learning adalah...",
          config: { numberOfQuestions: 5, difficulty: "medium", language: "id" }
        })

00:02 - API: Validate input ✓
        API: Call service.generateQuizFromMaterial()

00:03 - Service: buildPrompt()
        Output: 2500 character structured prompt

00:04 - Service: selectProvider()
        Result: GOOGLE_API_KEY exists → Use Gemini

00:05 - Service: callGemini(prompt)
        ⏳ Gemini processing...

00:08 - Gemini response:
        ```json
        {
          "questions": [
            { "id": "q1", "questionText": "Apa itu ML?", ... },
            { "id": "q2", "questionText": "Bedanya...", ... },
            ...
          ]
        }
        ```

00:09 - Service: parseQuizResponse()
        Step 1: Extract JSON ✓
        Step 2: Clean markdown ✓
        Step 3: Parse JSON ✓
        Step 4: Validate schema ✓
        Step 5: Transform & normalize ✓

00:10 - Service: Return QuizQuestion[] ✓

00:11 - API: Return HTTP 200 response ✓

00:12 - Hook: 
        setGeneratedQuestions(data.questions)
        setIsLoading(false)
        setError(null)

00:13 - UI: 
        Loading spinner hilang
        5 soal muncul di interface
        Admin bisa review/edit

00:30 - Admin: Selesai review, click "Publish"

00:31 - Database: INSERT soal ke Supabase ✓

✓ SELESAI - Soal ready untuk learners
```

---

## 5. ERROR HANDLING FLOW

```
Error dapat terjadi di berbagai tahapan:

┌─ Validation Error (API Layer)
│  ├─ Missing input
│  ├─ Invalid config
│  └─ Return HTTP 400

├─ Provider Error (LLM Layer)
│  ├─ API key invalid
│  ├─ Rate limit exceeded
│  ├─ Timeout
│  └─ Auto-fallback ke provider lain

├─ Parsing Error (Service Layer)
│  ├─ Invalid JSON response
│  ├─ Missing required fields
│  ├─ Schema validation failed
│  └─ Return HTTP 500 with error message

├─ Network Error (Hook Layer)
│  ├─ Connection timeout
│  ├─ No internet
│  └─ Catch & display error message

└─ UI Error (Display)
   ├─ Show error notification
   ├─ Preserve previous state
   └─ Allow retry

EXAMPLE ERROR FLOW:

Admin click Generate
  │
  ▼
Missing Content
  │
  ▼
API Validation Error
  │
  ▼
Return HTTP 400:
{
  "error": "ValidationError",
  "message": "Either 'content' or 'moduleItems' is required",
  "status": 400
}
  │
  ▼
Hook catch(error)
  │
  ▼
setError("Either 'content' or 'moduleItems' is required")
setIsLoading(false)
  │
  ▼
UI Display Error:
┌─────────────────────┐
│ ⚠️ Error             │
│ Either 'content'... │
│ [Retry]             │
└─────────────────────┘
```

---

## Ringkasan Flow:

1. **UI Trigger** → Admin input data + click generate
2. **Business Logic** → Hook manage state & prepare data  
3. **API Validation** → Check input & route to service
4. **Prompt Building** → Inject content + instructions
5. **Provider Selection** → Choose LLM (Gemini/OpenAI/Dummy)
6. **LLM Call** → Send prompt to AI, wait for response
7. **Response Parsing** → Extract & validate JSON with error recovery
8. **Transformation** → Normalize format & IDs
9. **Return Response** → Send back to UI
10. **UI Update** → Display soal untuk admin review
11. **Human Review** → Admin edit/verify sebelum publish
12. **Save to DB** → Final soal tersimpan

**Total waktu**: ~2-8 detik (tergantung provider dan network)
**Error recovery**: Built-in di parsing & provider fallback
**Quality gates**: Prompt constraints + human review

Jelas ya alurnya? Ada yang mau diperdalam?

# Integrasi LLM untuk Generasi MCQ pada Platform E‑Learning: Studi Desain Sistem dan Implementasi Teknis

## Abstrak
Pembuatan soal pilihan ganda (multiple choice question/MCQ) merupakan praktik asesmen yang efisien, namun proses manualnya membutuhkan waktu dan tenaga tinggi. Kemajuan large language models (LLM) membuka peluang otomatisasi generasi MCQ, tetapi menimbulkan risiko halusinasi serta ketidaksesuaian dengan materi sumber. Studi ini menyajikan desain dan implementasi teknis integrasi LLM untuk generasi MCQ pada platform e‑learning. Kontribusi utama meliputi (1) rancangan arsitektur sistem dengan pipeline end to end dari materi ke MCQ, (2) kontrol kualitas melalui prompt constraints, output schema, dan human in the loop, serta (3) rencana evaluasi untuk menilai kualitas soal dan efisiensi. Studi ini mengacu pada literatur AQG dan distractor generation serta kebutuhan pedagogis dalam asesmen digital.  

**Kata kunci**: LLM, MCQ, automatic question generation, distractor generation, e-learning, desain sistem

---

## 1. Pendahuluan
MCQ digunakan luas dalam asesmen pendidikan karena objektif, mudah diskor, dan efisien. Namun, pembuatan MCQ berkualitas tinggi memerlukan keahlian pedagogis dan waktu yang tidak sedikit, terutama ketika materi pembelajaran terus bertambah. Dalam skala besar, proses manual menjadi hambatan bagi institusi dan platform edtech.

Penelitian tentang automatic question generation (AQG) telah berkembang dari pendekatan berbasis aturan menuju pendekatan neural. Meski demikian, kualitas soal sering tidak konsisten, terutama pada distractor yang tidak plausible atau soal yang tidak terikat pada materi. LLM menawarkan kemampuan generatif yang fleksibel dan natural, namun juga rentan halusinasi, yaitu menghasilkan jawaban yang tidak ada di materi.

Penelitian ini fokus pada desain sistem dan implementasi teknis integrasi LLM untuk generasi MCQ pada platform e‑learning. Tujuan utamanya adalah merancang pipeline yang dapat menghasilkan MCQ relevan, terukur, dan bisa direview oleh pendidik sebelum dipublikasikan.

---

## 2. Tinjauan Pustaka

### 2.1 Automatic Question Generation (AQG)
Literatur AQG menunjukkan evolusi dari aturan sintaksis dan template menuju metode statistik dan neural. Studi awal menekankan proses over generation lalu ranking untuk memilih pertanyaan terbaik. Ranking terbukti penting karena output generatif mentah cenderung memiliki kualitas tidak merata.

### 2.2 Distractor Generation
Distractor adalah faktor penentu daya diskriminasi soal. Riset distractor generation menekankan pentingnya opsi salah yang plausible dan tidak ambigu. Metode learning to rank dan neural generation meningkatkan kualitas distractor dibanding heuristik berbasis kemiripan.

### 2.3 LLM untuk MCQ
LLM dapat menghasilkan stem dan opsi dengan bahasa yang lebih natural. Studi terbaru menunjukkan potensi LLM untuk MCQ, namun hasilnya sangat bergantung pada prompt dan kontrol konteks. Karena itu, prompt constraints dan evaluasi manusia menjadi penting.

### 2.4 Evaluasi Kualitas Soal
Kualitas MCQ umumnya dievaluasi berdasarkan ketepatan jawaban, relevansi terhadap materi, kejelasan stem, dan kualitas distractor. Selain itu, inter rater agreement digunakan untuk menilai konsistensi penilaian ahli.

---

## 3. Kerangka Konseptual dan Rationale Desain
Desain sistem ini berangkat dari prinsip pedagogis berikut:
1. **Relevansi materi**: setiap soal harus dapat diverifikasi pada sumber materi.  
2. **Kejelasan dan keterukuran**: soal menguji kompetensi tertentu dan tidak ambigu.  
3. **Distractor plausible**: opsi salah harus masuk akal untuk menguji pemahaman.  

Dari prinsip tersebut diturunkan kebutuhan teknis:
- **Prompt constraints** untuk menjaga batasan isi.  
- **Output schema** agar hasil konsisten dan mudah divalidasi.  
- **Human in the loop** sebagai mekanisme kontrol mutu.  

---

## 4. Arsitektur Sistem dan Rationale Desain

### 4.1 Diagram Arsitektur Lengkap
```
Lapisan Presentasi (Frontend)
├─ AutoQuizGenerator Component
│   └─ Settings Dropdown (jumlah soal, kesulitan, bahasa)
│   └─ Validation & Error Handling
│   └─ UI State Management (isLoading, error)
└─ Quiz Editor Interface
    └─ Review & Publish Workflow

Lapisan Business Logic (Hook)
└─ useQuizGenerator Hook
    ├─ State Management (isLoading, error, generatedQuestions)
    ├─ Async Callback (generateQuiz, generateQuizFromModule)
    └─ Error Transformation

Lapisan API (Next.js Route)
└─ POST /api/quiz/generate
    ├─ Input Validation
    ├─ Routing (single vs module)
    └─ Error Response Handling

Lapisan Layanan (Service Layer)
└─ Quiz Generator Service
    ├─ Prompt Builder
    ├─ LLM Provider Selection
    │   ├─ OpenAI GPT-4o-mini
    │   ├─ Google Gemini-flash-latest
    │   └─ Fallback Dummy
    ├─ Response Parser
    └─ Validation & Transformation

Lapisan Data (Output)
└─ QuizQuestion JSON Array
    ├─ Persisten ke Local Storage (Demo)
    └─ Ke Database Supabase (Produksi)
```

### 4.2 Komponen dan Tanggung Jawab

**Quiz Generation UI Component (Frontend Layer)**
Komponen UI ini menjadi gerbang interaksi admin untuk memicu generasi soal. Desain mengikuti prinsip smart/dumb component pattern, di mana komponen presentasi hanya menangani UI dan validasi input dasar, sementara logika API layer dipisahkan di business logic layer. Ini memungkinkan reusability dan testability yang lebih baik.

Fitur-fitur:
- **Settings Selection**: dropdown untuk memilih jumlah soal (3–15), tingkat kesulitan (mudah, sedang, sulit), dan bahasa (Indonesia, Inggris)  
- **Content Validation**: sistem memeriksa ketersediaan materi pembelajaran (tipe halaman dengan konten non-kosong)  
- **Loading State**: indikator visual (spinner) dan button disabled selama proses generasi  
- **Error Handling**: notifikasi error jika konten tidak valid atau API request gagal  

Implementasi menggunakan state management pattern (useState) dengan dual responsibility: state untuk settings dan state untuk error handling, plus disabled state prevention untuk menghindari double submission.

**Business Logic Layer - Quiz Generation Hook**
Layer ini mengimplementasikan pattern custom hook untuk memisahkan API logic dari presentasi. Responsibility-nya:
- **State Management**: tracking isLoading, error, generatedQuestions  
- **API Orchestration**: fungsi generateQuiz dan generateQuizFromModule sebagai entry points  
- **Error Transformation**: mengubah HTTP errors menjadi user-friendly messages  

Alasan desain ini berdasarkan prinsip separation of concerns: business logic terpisah dari presentasi layer, sehingga memudahkan unit testing dan reusability di multiple UI contexts.

Interface yang diexpose:
```
BusinessLogicLayer {
  generateQuiz(content, title, config) → Promise<QuizQuestion[]>
  generateQuizFromModule(moduleItems, config) → Promise<QuizQuestion[]>
  state: { isLoading, error, generatedQuestions }
}
```

**API Layer - Request/Response Contract**
API endpoint menangani HTTP requests dengan validasi input:
- **Input Validation**: memastikan `content` atau `moduleItems` ada, return 400 Bad Request jika missing  
- **Routing Logic**: mengarahkan ke service layer yang sesuai (single content generation vs module-level generation)  
- **Error Handling**: menangkap exception dari service layer dan mengembalikan error response dengan HTTP 500 dan message informatif  

Request schema:
```
POST /api/quiz/generate
{
  content?: string,           // Single page content
  moduleItems?: Array<{       // Or multiple module items
    title: string,
    content: string,
    type: string
  }>,
  config?: {
    numberOfQuestions: 3-15,
    difficulty: "easy" | "medium" | "hard",
    language: "id" | "en"
  }
}
```  

**Service Layer - Core Generation Logic**
Service layer adalah inti sistem dengan tanggung jawab:
- **Prompt Engineering**: membangun prompt dengan instruksi terstruktur, context injection dari materi  
- **LLM Provider Selection**: mengimplementasikan strategy pattern untuk fallback (Gemini → OpenAI → Fallback)  
- **Response Parsing**: robust JSON parsing dengan error recovery (regex extraction, markdown cleanup)  
- **Output Transformation**: normalisasi ke QuizQuestion schema standard  

Algorithm umum:
```
1. Input: content/moduleItems + config
2. BuildPrompt(content, config) → structured prompt
3. SelectProvider() → determine which LLM to use
4. CallLLM(prompt) → get response
5. ParseResponse(response) → extract JSON safely
6. ValidateSchema(parsed) → check required fields
7. TransformToQuizQuestion(parsed) → output standard format
8. Return: QuizQuestion[]
```  

### 4.3 Rasionalisasi Desain Berlapis
Arsitektur berlapis ini dirancang dengan inspirasi dari enterprise architecture patterns dan microservice principles. Setiap lapisan memiliki boundary yang jelas:
- **Presentasi** hanya menangani UI dan event.  
- **Business Logic** menangani state dan orchestration API call.  
- **API** menangani HTTP contract dan validasi input.  
- **Service** menangani business rules dan integrasi LLM.  

Keuntungan:
- **Testability**: setiap layer bisa ditest secara terpisah.  
- **Maintainability**: perubahan di satu layer tidak berdampak langsung ke layer lain.  
- **Scalability**: jika nanti ada multiple providers LLM, service layer bisa diperluas tanpa mengubah komponen.  

---

## 5. Implementasi Teknis (Perincian Detail)

### 5.1 Prompt Engineering dan Strategy
Prompt dalam sistem ini dirancang dengan pertimbangan:
1. **Clarity**: instruksi ditulis eksplisit dan terstruktur.  
2. **Constraint**: batasan output jelas (format JSON, satu jawaban benar, dsb.).  
3. **Context injection**: konten materi dimasukkan langsung ke prompt untuk mitigasi halusinasi.  

Struktur prompt:
```
PERAN SISTEM
Anda adalah sistem pembuat kuis otomatis untuk platform e-learning.

INPUT
- Judul: [title]
- Konten: [content]

INSTRUKSI
1. Gunakan [language]
2. Tingkat kesulitan: [difficulty]
3. Hasilkan [numberOfQuestions] soal
4. Format: 4 opsi (A, B, C, D)
5. Satu jawaban benar
6. Jawaban harus ada di materi (constraint kritis)
7. Output HANYA JSON

FORMAT OUTPUT
{
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

JANGAN membuat jawaban yang tidak ada di materi.
```

Strategi ini mengacu pada prinsip prompt engineering dari studi Biancini et al. (2024), yang menunjukkan bahwa prompt constraints dan knowledge injection secara signifikan mengurangi hallucination dalam generasi MCQ berbasis LLM.

### 5.2 LLM Provider Selection dan Fallback Strategy
Sistem mengimplementasikan strategy pattern untuk pemilihan provider:

**Priority Chain**:
1. **Jika GOOGLE_API_KEY ada**: gunakan Gemini (gratis hingga limit, dan paling cepat untuk draft).  
2. **Jika OPENAI_API_KEY ada**: gunakan OpenAI GPT-4o-mini (lebih reliable untuk kualitas tinggi).  
3. **Fallback**: dummy response untuk development tanpa API key.  

Alasan diprioritaskan Gemini adalah cost efficiency di development phase, sedangkan OpenAI untuk production reliability.

**Model Configuration**:
- **OpenAI**: `gpt-4o-mini` dengan `temperature: 0.7` (balance antara creativity dan consistency).  
- **Gemini**: `gemini-flash-latest` dengan `temperature: 0.7`, `responseMimeType: application/json`.  

Parameter `temperature` 0.7 dipilih karena cukup kreatif untuk menghasilkan distractor unik, namun tidak terlalu random yang menyebabkan output tidak fokus.

### 5.3 Response Parsing dan Error Recovery
Parsing implementation menerapkan robust error handling dengan multi-layer recovery strategy:

**Parsing Algorithm**:
```
Input: LLM response string

Step 1: Regex Extraction
  - Gunakan regex /\{[\s\S]*\}/ untuk extract JSON object
  - Berjaga jika ada text sebelum/sesudah JSON
  - Jika tidak match, gunakan trimmed response

Step 2: Markdown Cleanup
  - Hapus ```json code fence
  - Hapus ``` closing fence
  - Hapus newlines di boundary

Step 3: JSON Parsing
  - Parse string to object
  - If error, log dan throw

Step 4: Schema Validation
  - Check kehadiran field wajib: questions array
  - Check tipe data: questions must be array
  - Check item schema: setiap question punya id, questionText, options, correctOptionId

Step 5: Normalisasi
  - Assign default id jika missing: q1, q2, ...
  - Assign option id: q1-a, q1-b, q1-c, q1-d, ...
  - Keseragaman field names

Output: QuizQuestion[] (standard format)
Error: throw dengan message informatif
```

Error recovery strategy ini mengikuti prinsip "fail fast but informative", di mana kesalahan parsing dideteksi segera dengan pesan yang jelas untuk downstream debugging dan monitoring.

### 5.4 Kontrol Kualitas Berbasis Output Schema
Output format JSON yang ketat adalah mekanisme kontrol kualitas pertama. Dengan mendefinisikan schema eksplisit, sistem dapat:
- **Validasi otomatis**: cek struktur JSON dan kehadiran field wajib.  
- **Type safety**: menggunakan TypeScript interface `QuizQuestion` untuk ensure type consistency.  
- **Transformasi konsisten**: normalisasi ID dan struktur opsi agar seragam.  

Schema `QuizQuestion`:
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

### 5.5 Module-Level Quiz Generation
Untuk modul yang terdiri dari multiple learning items, sistem menerapkan context aggregation strategy:

**Algorithm**:
```
Input: moduleItems[] (array of learning objects)
        config (numberOfQuestions, difficulty, language)

Step 1: Filter Items
  - Hanya include items dengan type="page" (pembelajaran content)
  - Skip items tipe lain (video, assignment, dll)

Step 2: Aggregate Content
  - Untuk setiap page item:
    - Format: "## [item.title]\n[item.content]"
    - Join dengan separator "\n\n"
  - Result: satu unified content string

Step 3: Call Generation Service
  - Gunakan combined content sebagai source material
  - Set title to "Module Quiz"
  - Pass config tanpa modifikasi

Step 4: Return
  - Output: QuizQuestion[] (same format as single content)
  - Soal yang dihasilkan mencakup topik dari multiple items
```

Rationale untuk aggregation: dengan memberikan full module context ke LLM, sistem memastikan soal mencakup learning objectives dari seluruh modul, bukan hanya one item. Ini meningkatkan coverage dan inter-topic connections dalam assessment.

### 5.6 Implementasi Human-in-the-Loop Review
Setelah generasi otomatis, sistem menempatkan tahapan review obligatory di admin UI. Alasan ini berdasarkan studi Biancini et al. (2024) yang menunjukkan bahwa even dengan LLM terbaik, human review mengurangi error rate signifikan.

Workflow:
1. Admin trigger generate → soal auto generated.  
2. Soal muncul di preview area (read-only).  
3. Admin bisa edit, hapus, atau add opsi manual.  
4. Baru setelah review, soal bisa di-publish.  

### 5.7 State Management dan Async Handling
Business logic layer menggunakan functional state management pattern untuk ensure consistency:

**State Machine**:
```
Initial State: { isLoading: false, error: null, questions: [] }

Event: generateQuiz(content, config)
  → setState({ isLoading: true, error: null })
  → callAPI(POST /quiz/generate)
  → if success:
      setState({ isLoading: false, questions: response.questions })
      return questions
  → if error:
      setState({ isLoading: false, error: error.message })
      throw error
```

**Pattern Benefits**:
- **Memoization**: function di-cache sehingga tidak trigger re-render di UI
- **State Consistency**: state diupdate atomically (tidak partial updates)
- **Error Propagation**: error di-catch dan di-store di state, plus di-throw untuk handling di caller
- **Cleanup**: isLoading di-reset di finally block untuk handle both success dan error cases

Pattern ini ensures predictable behavior dan easier debugging dalam async workflows.

### 5.8 Configuration dan Environment Variables
Sistem menggunakan environment-based configuration untuk provider selection:

**Configuration Pattern**:
```
Environment Variables:
  OPENAI_API_KEY     (optional)
  GOOGLE_API_KEY     (optional)

Provider Priority Logic:
  if GOOGLE_API_KEY exists → use Gemini API
  else if OPENAI_API_KEY exists → use OpenAI API
  else → use Fallback (dummy/mock)

Model Parameters (tunable):
  temperature: 0.7  (balance creativity vs consistency)
  max_tokens: varies per provider
  response_format: JSON (structured output)
```

**Benefits**:
- **Flexibility**: switch provider hanya dengan environment variable, tanpa code change
- **Cost Optimization**: bisa memilih provider based on budget (Gemini gratis tier vs OpenAI paid)
- **Development-friendly**: fallback dummy response untuk local development tanpa API key
- **Production-ready**: support multiple providers untuk redundancy dan fallback strategy

---

## 6. Implikasi Pedagogis dan Pertimbangan Kualitas

### 6.1 Alignment dengan Kerangka Kognitif
MCQ yang berkualitas harus align dengan level kognitif Bloom's taxonomy. Sistem ini mendukung tiga tingkat kesulitan:
- **Easy**: recall dan comprehension (ingatan, pemahaman dasar).  
- **Medium**: application dan analysis (penerapan, analisis).  
- **Hard**: synthesis dan evaluation (sintesis, evaluasi).  

Prompt engineering dirancang untuk membimbing LLM menghasilkan soal pada level kognitif yang tepat. Namun, validasi empiris level kognitif actual soal masih diperlukan.

### 6.2 Kualitas Distractor dan Discriminative Power
Distractor yang berkualitas harus:
- **Plausible**: jawaban salah yang logis dan masuk akal (bukan obvious).  
- **Distinctive**: berbeda dengan jawaban lain (tidak overlapping).  
- **Relevant**: topik yang sama dengan soal (bukan unrelated).  

LLM mampu menghasilkan distractor natural, namun tanpa kontrol, bisa menghasilkan opsi yang terlalu mudah dibedakan. Review pendidik menjadi penting untuk validate plausibility.

Menurut literatur (Qiu et al., 2020; Liang et al., 2018), distractor quality adalah faktor terbesar yang mempengaruhi discriminative power soal.

### 6.3 Risiko Bias dan Mitigasi
LLM bisa menghasilkan bias implicit berdasarkan data training. Risiko yang mungkin:
- **Gender bias**: soal atau opsi yang mengandung stereotype.  
- **Cultural bias**: contoh atau konteks yang hanya relevan di budaya tertentu.  
- **Language bias**: penggunaan bahasa yang favor group tertentu.  

Mitigasi:
- Review pendidik dengan diverse background.  
- Checklist bias pada rubrik penilaian.  
- Audit terhadap soal yang dihasilkan di awal deployment.

### 6.4 Transparansi dan Ethical Consideration
Penting untuk transparansi kepada learner bahwa soal dibuat dengan AI. Pertimbangan etis:
- Learner harus tahu soal berasal dari LLM (tidak semua item diproduksi manual).  
- Institusi tetap bertanggung jawab atas validitas asesmen.  
- Data materi yang dikirim ke LLM provider perlu privacy policy yang jelas.  

---

## 7. Rencana Evaluasi (Terstruktur)

### 7.1 Desain Penelitian Evaluatif
Studi evaluasi dirancang sebagai **quasi-experimental research** dengan design:
- **Subjek**: 3 course, 15 modul, 75 soal total (5 soal per modul).  
- **Penilai**: 3 pendidik dengan expertise di course masing-masing.  
- **Metode**: comparative assessment antara soal auto-generated vs expected quality.  

### 7.2 Instrumen Penilaian (Rubrik)
Rubrik dirancang berdasarkan literatur item analysis (Tarrant et al., 2006; Hingorjo & Jaleel, 2012):

**Dimensi 1: Correctness (Ketepatan Jawaban)**
- Skor 1: Jawaban benar tidak sesuai materi atau tidak ada.  
- Skor 2: Jawaban benar tapi penjelasan tidak lengkap.  
- Skor 3: Jawaban benar dan penjelasan cukup.  
- Skor 4: Jawaban benar dan penjelasan jelas.  
- Skor 5: Jawaban benar, penjelasan sangat jelas dan komprehensif.  

**Dimensi 2: Relevance (Keterkaitan dengan Materi)**
- Skor 1: Soal tidak relevan atau out of scope.  
- Skor 2: Soal sedikit relevan, topik tidak fokus.  
- Skor 3: Soal cukup relevan dengan materi.  
- Skor 4: Soal sangat relevan, menguji konsep kunci.  
- Skor 5: Soal sangat relevan, menguji deep understanding konsep.  

**Dimensi 3: Clarity (Kejelasan Stem)**
- Skor 1: Stem ambiguous, tidak jelas apa yang ditanya.  
- Skor 2: Stem kurang jelas, perlu banyak interpretasi.  
- Skor 3: Stem cukup jelas, hanya sedikit ambiguity.  
- Skor 4: Stem jelas, pertanyaan spesifik.  
- Skor 5: Stem sangat jelas, unambiguous, dan concise.  

**Dimensi 4: Distractor Quality (Kualitas Opsi Salah)**
- Skor 1: Distractor obvious, learner langsung tahu salah.  
- Skor 2: Distractor kurang plausible, tapi masih ada yang obvious.  
- Skor 3: Distractor cukup plausible, bisa menipu learner basic.  
- Skor 4: Distractor sangat plausible, hanya learner dengan good understanding bisa bedakan.  
- Skor 5: Distractor sangat sophisticated, plausible untuk learner intermediate.  

### 7.3 Inter-Rater Reliability
Tiga penilai independent akan menilai subset soal (contoh: 10% dari 75 soal = ~8 soal) untuk calculate inter-rater agreement. Metrik yang digunakan:
- **Cohen's Kappa** (untuk 2 rater), atau  
- **Fleiss' Kappa** (untuk 3+ rater).  

Target: Kappa > 0.7 (substantial agreement menurut Landis & Koch, 1977).

### 7.4 Efficiency Metrics
- **Time-to-generate**: durasi dari trigger generate hingga output diterima. Target: < 30 detik per 5 soal.  
- **Manual effort**: waktu pendidik untuk review dan edit soal. Bandingkan dengan membuat soal manual dari awal.  
- **Cost**: biaya API per soal (untuk OpenAI / Gemini). Target: < $0.01 per soal.  

### 7.5 Qualitative Data Collection
Wawancara atau survey dengan 3 pendidik untuk collect feedback:
- Persepsi kemudahan penggunaan sistem.  
- Confidence terhadap kualitas soal auto-generated.  
- Saran improvement.  
- Adoption readiness.  

---

## 8. Kesimpulan dan Implikasi Masa Depan

### 8.1 Ringkasan Kontribusi
Studi desain ini memberikan kontribusi:
1. **Arsitektur sistem terstruktur**: pipeline end-to-end dari materi ke MCQ, dengan clear separation of concerns.  
2. **Kontrol kualitas berlapis**: prompt constraints, output schema, dan human-in-the-loop review.  
3. **Rencana evaluasi empiris**: menggunakan rubrik terstruktur dan inter-rater reliability untuk assess quality.  

### 8.2 Implikasi untuk Edtech Platform
Integrasi LLM ke platform e-learning dapat:
- **Mempercepat development materi**: soal bisa dihasilkan cepat, reduce time-to-market course.  
- **Meningkatkan personalisasi**: soal bisa di-generate untuk difficulty level berbeda per learner.  
- **Reduce authoring burden**: pendidik fokus pada review dan quality assurance, bukan manual writing.  

### 8.3 Keterbatasan dan Penelitian Lanjutan
Studi ini belum melakukan validasi empiris. Penelitian lanjutan harus:
- Mengukur actual quality soal dengan data real dari pendidik.  
- Test consistency across 3 course dan domain berbeda.  
- Evaluasi learner performance dan discriminative power soal di lapangan.  
- Compare dengan baseline (manual-written soal dan existing AQG methods).  

### 8.4 Rekomendasi Implementasi
Untuk deployment production:
1. Integrate dengan LMS actual (bukan hanya demo).  
2. Setup monitoring untuk track kualitas soal over time.  
3. Develop training untuk pendidik tentang review dan editing soal AI-generated.  
4. Establish governance policy tentang data privacy (materi sent to LLM provider).  

### 8.5 Kesimpulan Akhir
Desain sistem integrasi LLM untuk generasi MCQ menunjukkan feasibility teknis dan alignment dengan prinsip pedagogis. Dengan kontrol kualitas berlapis dan human-in-the-loop, sistem ini potensi menjadi tool valuable untuk accelerate course development di platform e-learning modern.

---

## Pernyataan Ketersediaan Data
Untuk mendukung transparansi dan reproducibility penelitian, implementasi sistem ini didokumentasikan lengkap dalam paper ini:

- **Main Content**: Sections 1-8 menyajikan research contribution, methodology, design, dan evaluation plan
- **Implementation Details**: Section 9 (Appendix) berisi technical details, type definitions, prompt templates, API examples, evaluation rubric, testing strategy, monitoring, dan deployment guide

Peneliti yang tertarik untuk replicate atau extend penelitian ini dapat mengacu pada:
- Section 9.2-9.4: Type definitions dan service layer pseudocode
- Section 9.5-9.6: API specifications dan request/response examples
- Section 9.7-9.8: Evaluation rubric dan inter-rater reliability methodology
- Section 9.9-9.12: Testing strategy, monitoring, deployment checklist, dan known limitations

Untuk akses ke source code implementasi atau lebih lengkap technical documentation, silakan hubungi corresponding author.

---

## Referensi ke Supplementary Content
- **Section 9**: Complete implementation guide, type definitions, prompt templates, API examples
- **Related Documentation**: AUTO_QUIZ_GENERATOR.md (feature documentation), SUPABASE_SCHEMA.md (database schema) tersedia di project repository

---

## Deklarasi Conflict of Interest
Para author menyatakan tidak ada conflict of interest yang relevan dengan publikasi ini. Tidak ada hubungan finansial, personal, atau profesional yang dapat mempengaruhi hasil penelitian atau interpretasi findings.

---

## Pernyataan Pendanaan
Penelitian ini tidak menerima grant atau dukungan finansial khusus dari organisasi publik, komersial, atau non-profit manapun. Penelitian dilakukan menggunakan resources institusional dan open-source tools yang tersedia.

---

## Kontribusi Author
[Jika paper ini multi-author, sebutkan kontribusi masing-masing. Jika single author, dapat dihapus atau ditulis singkat]

---

## 9. APPENDIX: Implementation Details dan Technical Reference

### 9.1 Arsitektur Folder Project (Reference)

Project menggunakan Next.js App Router dengan struktur berikut:

```
project-root/
├── app/
│   ├── api/quiz/generate/route.ts           (API endpoint)
│   └── [other page routes]
├── components/quiz/
│   └── AutoQuizGenerator.tsx                (UI component)
├── lib/
│   ├── services/quizGenerator.ts            (Core logic)
│   ├── hooks/useQuizGenerator.ts            (React hook)
│   └── [utilities]
├── types/course.ts                          (Type definitions)
|
└── [configuration files]
```

### 9.2 Type Definitions

**Core Quiz Types:**

```typescript
interface QuizQuestion {
  id: string;
  questionText: string;
  options: QuizOption[];
  correctOptionId: string;
  explanation?: string;
  difficulty?: "easy" | "medium" | "hard";
}

interface QuizOption {
  id: string;
  text: string;
}

interface QuizGeneratorConfig {
  numberOfQuestions: number;  // 3 to 15
  difficulty: "easy" | "medium" | "hard";
  language: "id" | "en";
}

interface GeneratedQuiz {
  questions: QuizQuestion[];
  generatedAt?: Date;
  model?: string;
}

interface ModuleItem {
  id: string;
  title: string;
  content: string;
  type: "page" | "video" | "assignment" | "quiz";
}
```

### 9.3 Prompt Engineering Templates

**Template untuk Bahasa Indonesia:**

```
Anda adalah sistem pembuat kuis otomatis untuk platform e-learning.
Tugas: buat MCQ berkualitas tinggi dari materi yang diberikan.

INFORMASI MATERI
- Judul: [TITLE]
- Bahasa: Indonesia
- Tingkat Kesulitan: [DIFFICULTY - mudah/sedang/sulit]

KONTEN PEMBELAJARAN
[MATERIAL_CONTENT]

INSTRUKSI
1. Jumlah soal: [NUM_QUESTIONS]
2. Format: 4 opsi (A, B, C, D), satu benar
3. Tingkat kesulitan:
   - Mudah: recall & comprehension
   - Sedang: application & analysis
   - Sulit: synthesis & evaluation
4. Distractor quality:
   - Plausible (masuk akal)
   - Berbeda satu sama lain
   - Relevan dengan topik
5. CONSTRAINT KRITIS: SEMUA jawaban HARUS ada di materi
6. Prioritas: KUALITAS > KUANTITAS

FORMAT OUTPUT (HANYA JSON):
{
  "questions": [
    {
      "id": "q1",
      "questionText": "...",
      "options": [
        {"id": "q1-a", "text": "[From material]"},
        {"id": "q1-b", "text": "[Distractor]"},
        {"id": "q1-c", "text": "[Distractor]"},
        {"id": "q1-d", "text": "[Distractor]"}
      ],
      "correctOptionId": "q1-a",
      "explanation": "..."
    }
  ]
}
```

### 9.4 LLM Provider Configuration

```typescript
// OpenAI
const OPENAI_CONFIG = {
  model: "gpt-4o-mini",
  temperature: 0.7,
  max_tokens: 2000
};

// Google Gemini
const GEMINI_CONFIG = {
  model: "gemini-1.5-flash-latest",
  temperature: 0.7,
  maxOutputTokens: 2000,
  responseMimeType: "application/json"
};

// Provider selection
function selectProvider() {
  if (process.env.GOOGLE_API_KEY) return new GeminiProvider();
  if (process.env.OPENAI_API_KEY) return new OpenAIProvider();
  return new DummyProvider();  // Fallback
}
```

### 9.5 Service Layer Pseudocode

```
Algorithm: generateQuizFromMaterial(content, config)
1. BuildPrompt(content, config) → prompt
2. SelectProvider() → provider
3. CallLLM(provider, prompt) → response
4. ParseResponse(response):
   a. ExtractJSON(response)
   b. CleanMarkdown(json)
   c. Parse(json)
   d. ValidateSchema(parsed)
   e. Transform(parsed)
5. Return: QuizQuestion[]

Function ParseResponse Error Recovery:
- Try: regex extraction /\{[\s\S]*\}/
- Try: markdown cleanup (remove ```json, ```)
- Try: JSON.parse()
- Validate: questions array, required fields
- Normalize: assign default IDs if missing
- Transform: consistent format (q1, q1-a, etc)
```

### 9.6 API Request/Response Examples

**Request (Single Content):**
```json
POST /api/quiz/generate
{
  "content": "Machine learning adalah sub-field dari AI...",
  "title": "Intro to ML",
  "config": {
    "numberOfQuestions": 5,
    "difficulty": "medium",
    "language": "id"
  }
}
```

**Request (Module):**
```json
POST /api/quiz/generate
{
  "moduleItems": [
    {"title": "Topic A", "content": "...", "type": "page"},
    {"title": "Topic B", "content": "...", "type": "page"}
  ],
  "config": {
    "numberOfQuestions": 8,
    "difficulty": "hard",
    "language": "en"
  }
}
```

**Success Response (HTTP 200):**
```json
{
  "success": true,
  "questions": [
    {
      "id": "q1",
      "questionText": "Apa perbedaan antara...",
      "options": [...],
      "correctOptionId": "q1-b",
      "explanation": "..."
    }
  ],
  "count": 5
}
```

**Error Response (HTTP 400):**
```json
{
  "error": "ValidationError",
  "message": "Either 'content' or 'moduleItems' is required",
  "status": 400
}
```

### 9.7 Evaluation Rubric Detail

Rubrik penilaian dengan 4 dimensi × 5 skala:

**Dimensi 1: Correctness (Ketepatan Jawaban)**
- 1: Tidak sesuai materi atau tidak ada
- 2: Sesuai tapi penjelasan tidak lengkap
- 3: Sesuai dan penjelasan cukup
- 4: Sesuai dan penjelasan jelas
- 5: Sangat jelas, komprehensif, evidence-based

**Dimensi 2: Relevance (Keterkaitan Materi)**
- 1: Tidak relevan / out of scope
- 2: Sedikit relevan, topik tidak fokus
- 3: Cukup relevan
- 4: Sangat relevan, menguji konsep kunci
- 5: Menguji deep understanding

**Dimensi 3: Clarity (Kejelasan Stem)**
- 1: Ambiguous, tidak jelas
- 2: Kurang jelas, banyak interpretasi
- 3: Cukup jelas, sedikit ambiguity
- 4: Jelas, spesifik
- 5: Sangat jelas, unambiguous, concise

**Dimensi 4: Distractor Quality (Kualitas Opsi Salah)**
- 1: Obvious, learner langsung tahu salah
- 2: Kurang plausible
- 3: Cukup plausible, bisa menipu beginner
- 4: Sangat plausible, butuh good understanding
- 5: Sophisticated, plausible untuk intermediate learner

**Quality Threshold**: Rata-rata skor ≥ 3.5/5 per dimensi

### 9.8 Inter-Rater Reliability

**Metrik**: Fleiss' Kappa (untuk 3+ rater)

$$\kappa = \frac{\bar{P}_o - \bar{P}_e}{1 - \bar{P}_e}$$

Dimana:
- $\bar{P}_o$ = observed agreement
- $\bar{P}_e$ = expected agreement by chance

**Interpretasi**:
- κ > 0.7: Substantial agreement (acceptable)
- κ ≥ 0.8: Almost perfect agreement (excellent)

### 9.9 Testing Strategy Outline

**Unit Tests**:
- parseQuizResponse: valid JSON, markdown-wrapped, extra text, invalid schema
- buildPrompt: required sections, content injection, language correctness

**Integration Tests**:
- API endpoint: single content generation, module generation, missing input validation
- Provider selection: fallback chain, error handling per provider

### 9.10 Monitoring Metrics

Metrics to track per generation:
- `provider` (gemini/openai/dummy)
- `duration_ms` (latency)
- `success` (true/false)
- `num_questions_requested` vs `num_questions_generated`
- `error_message` (if failed)

**Critical Errors to Monitor**:
1. API Rate Limit Exceeded → Retry dengan backoff
2. Invalid JSON Response → Log sample, alert team
3. Schema Validation Failed → Flag untuk manual review
4. Content Too Long → Split ke multiple requests

### 9.11 Deployment Checklist

- [ ] Environment variables configured (API keys)
- [ ] Provider fallback chain tested
- [ ] Error handling tested per provider
- [ ] Rate limiting implemented
- [ ] Logging & monitoring enabled
- [ ] Human-in-the-loop UI functional
- [ ] Database schema updated
- [ ] Privacy policy updated (re: data sent to LLM)

### 9.12 Known Limitations dan Mitigasi

| Limitation | Impact | Mitigation |
|-----------|--------|-----------|
| LLM Hallucination | Wrong answers | Prompt constraint + human review |
| Content Length Limit | Long modules fail | Split into chunks |
| Language Issues | Grammar errors | Prompt template tuning |
| Distractor Quality | Too obvious | Manual review + fine-tuning |
| Cost | API charges | Cache + optimize prompts |
| Latency | Slow batches | Async queue + batch processing |

---

## Daftar Pustaka (APA, Diperluas)

Anderson, L. W., & Krathwohl, D. R. (Eds.). (2001). *A taxonomy for learning, teaching, and assessing: A revision of Bloom's taxonomy of educational objectives: complete edition*. New York: Longman.

Biancini, G., Ferrato, A., & Limongelli, C. (2024). Multiple-choice question generation using large language models: Methodology and educator insights. *Adjunct Proceedings of the 32nd ACM Conference on User Modeling, Adaptation and Personalization (UMAP '24)* (pp. 584–590). Association for Computing Machinery. https://doi.org/10.1145/3631700.3665233

CH, D. R., & Saha, S. K. (2020). Automatic multiple choice question generation from text: A survey. *IEEE Transactions on Learning Technologies, 13*(1), 14–25. https://doi.org/10.1109/TLT.2018.2889100

Das, B., Majumder, M., Phadikar, S., & Sekh, A. A. (2021). Automatic question generation and answer assessment: A survey. *Research and Practice in Technology Enhanced Learning, 16*(1), Article 5. https://doi.org/10.1186/s41039-021-00151-1

Hingorjo, M. R., & Jaleel, F. (2012). Analysis of one-best MCQs: the difficulty index, discrimination index and distractor efficiency. *The Journal of the Pakistan Medical Association, 62*(2), 142–147.

Kurdi, G., Leo, J., Parsia, B., Sattler, U., & Al-Emari, S. (2020). A systematic review of automatic question generation for educational purposes. *International Journal of Artificial Intelligence in Education, 30*(1), 121–204. https://doi.org/10.1007/s40593-019-00186-y

Landis, J. R., & Koch, G. G. (1977). The measurement of observer agreement for categorical data. *Biometrics, 33*(1), 159–174.

Liang, C., Yang, X., Dave, N., Wham, D., Pursel, B., & Giles, C. L. (2018). Distractor generation for multiple choice questions using learning to rank. In *Proceedings of the Thirteenth Workshop on Innovative Use of NLP for Building Educational Applications* (pp. 284–290). https://doi.org/10.18653/v1/W18-0533

Qiu, Z., Wu, X., & Fan, W. (2020). Automatic distractor generation for multiple choice questions in standard tests. In *Proceedings of the 28th International Conference on Computational Linguistics* (pp. 2096–2106). https://doi.org/10.18653/v1/2020.coling-main.189

Alhazmi, E., Sheng, Q. Z., Zhang, W. E., Zaib, M., & Alhazmi, A. (2024). Distractor generation in multiple-choice tasks: A survey of methods, datasets, and evaluation. In *Proceedings of the 2024 Conference on Empirical Methods in Natural Language Processing* (pp. 14437–14458). https://doi.org/10.18653/v1/2024.emnlp-main.799

Heilman, M., & Smith, N. A. (2010). Good question! Statistical ranking for question generation. In *Human Language Technologies: The 2010 Annual Conference of the North American Chapter of the Association for Computational Linguistics* (pp. 609–617). Association for Computational Linguistics.

Tarrant, M., Ware, J., & Mohammed, A. M. (2006). Quality of MCQs: The MCSQ (Multiple Choice Stem Quality) assessment tool. *BMC Medical Education, 6*, 19. https://doi.org/10.1186/1472-6920-6-19

---

**Catatan**: Paper ini adalah studi desain/konseptual yang fokus pada perancangan sistem dan implementasi teknis. Untuk publikasi SINTA 3, pertimbangkan untuk melakukan evaluasi empiris dan menambahkan hasil eksperimental. Template ini bisa dikonversi ke format Word atau PDF sesuai kebutuhan jurnal target.

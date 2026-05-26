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

**AutoQuizGenerator Component (Frontend)**
Komponen UI ini menjadi gerbang interaksi admin untuk memicu generasi soal. Desain komponen mengikuti prinsip smart/dumb component pattern, di mana AutoQuizGenerator hanya menangani presentasi dan validasi input dasar, sementara logika API dipindahkan ke hook. Ini memungkinkan reusability dan testability yang lebih baik.

Fitur-fitur:
- Dropdown dropdown untuk memilih jumlah soal (3–15), tingkat kesulitan (mudah, sedang, sulit), dan bahasa (Indonesia, Inggris).  
- Validasi konten: sistem memeriksa apakah ada item dengan `type === "page"` dan memiliki konten non-kosong.  
- Loading state: tombol berubah ke mode loading dengan spinner selama proses generasi.  
- Error display: pesan error ditampilkan dalam badge merah jika konten kosong atau API gagal.  

Implementasi di [components/quiz/AutoQuizGenerator.tsx](components/quiz/AutoQuizGenerator.tsx) menunjukkan pattern ini dengan `useState` untuk settings dan error state, serta `disabled` prop untuk prevent double submission.

**useQuizGenerator Hook (Business Logic)**
Hook ini mengimplementasikan pattern custom hook untuk memisahkan API logic dari UI. Hook mengembalikan object dengan method `generateQuiz` dan `generateQuizFromModule`, serta state management (isLoading, error, generatedQuestions).

Alasan desain ini berdasarkan prinsip separation of concerns: logic API terpisah dari presentasi, memudahkan testing dan penggunaan ulang di component lain.

Contoh:
```typescript
const { generateQuiz, isLoading, error } = useQuizGenerator();
const questions = await generateQuiz(content, title, options);
```

**API Route (Next.js POST)**
Endpoint [app/api/quiz/generate/route.ts](app/api/quiz/generate/route.ts) menangani request dengan validasi minimal:
- Memastikan `content` atau `moduleItems` ada (400 error jika tidak).  
- Memanggil service yang sesuai (single content vs module).  
- Error handling: menangkap exception dari service dan mengembalikan 500 dengan pesan error.  

**Quiz Generator Service (Core Logic)**
Service layer di [lib/services/quizGenerator.ts](lib/services/quizGenerator.ts) adalah inti sistem. Tanggung jawabnya:
- Membangun prompt dengan instruksi yang tepat.  
- Memilih LLM provider (Gemini > OpenAI > Dummy).  
- Parsing response JSON dengan error recovery.  
- Transformasi ke QuizQuestion format.  

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
Parsing implementation di [lib/services/quizGenerator.ts](lib/services/quizGenerator.ts) menerapkan robust error handling:

```typescript
function parseQuizResponse(response: string): QuizQuestion[] {
  try {
    // 1. Ekstrak JSON dengan regex (berjaga jika ada teks sebelum/sesudah)
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    let jsonStr = jsonMatch ? jsonMatch[0] : response.trim();
    
    // 2. Bersihkan markdown code fence
    jsonStr = jsonStr
      .replace(/^```json\n?/, '')
      .replace(/^```\n?/, '')
      .replace(/\n?```$/, '');
    
    // 3. Parse JSON
    const parsed: GeneratedQuiz = JSON.parse(jsonStr);
    
    // 4. Validasi struktur minimal
    if (!parsed.questions || !Array.isArray(parsed.questions)) {
      throw new Error("Property 'questions' tidak ditemukan");
    }
    
    // 5. Transformasi dan normalisasi
    return parsed.questions.map((q, idx) => ({
      id: q.id || `q${idx + 1}`,
      questionText: q.questionText,
      options: q.options.map((opt, optIdx) => ({
        id: opt.id || `q${idx + 1}-${chr(optIdx)}`,
        text: opt.text,
      })),
      correctOptionId: q.correctOptionId,
    }));
  } catch (error) {
    console.error("Parse failed:", error);
    throw new Error("Gagal memproses response dari AI");
  }
}
```

Error recovery strategy ini mengikuti prinsip "fail fast but informative", di mana kesalahan parsing dideteksi segera dengan pesan yang jelas untuk debugging.

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
Untuk modul, sistem menggabungkan konten dari multiple items sebelum kirim ke LLM:

```typescript
export async function generateQuizForModule(
  moduleItems: Array<{ title: string; content: string; type: string }>,
  config?: Partial<QuizGeneratorConfig>
): Promise<QuizQuestion[]> {
  const combinedContent = moduleItems
    .filter((item) => item.type === "page")
    .map((item) => `## ${item.title}\n${item.content}`)
    .join("\n\n");

  return generateQuizFromMaterial(combinedContent, "Module Quiz", config);
}
```

Pendekatan ini memastikan LLM memiliki konteks lengkap dari seluruh modul, sehingga soal yang dihasilkan mencakup topik-topik utama across items.

### 5.6 Implementasi Human-in-the-Loop Review
Setelah generasi otomatis, sistem menempatkan tahapan review obligatory di admin UI. Alasan ini berdasarkan studi Biancini et al. (2024) yang menunjukkan bahwa even dengan LLM terbaik, human review mengurangi error rate signifikan.

Workflow:
1. Admin trigger generate → soal auto generated.  
2. Soal muncul di preview area (read-only).  
3. Admin bisa edit, hapus, atau add opsi manual.  
4. Baru setelah review, soal bisa di-publish.  

### 5.7 State Management dan Async Handling
Hook `useQuizGenerator` menggunakan `useCallback` untuk memoize function dan prevent unnecessary re-renders:

```typescript
const generateQuiz = useCallback(async (content, title, options) => {
  setIsLoading(true);
  setError(null);
  try {
    const response = await fetch("/api/quiz/generate", { ... });
    if (!response.ok) throw new Error(...);
    const data = await response.json();
    setGeneratedQuestions(data.questions);
    return data.questions;
  } catch (err) {
    setError(err.message);
    throw err;
  } finally {
    setIsLoading(false);
  }
}, []);
```

Pattern ini memastikan state consistency dan error propagation yang jelas.

### 5.8 Configuration dan Environment Variables
Sistem mendukung configuration melalui `.env.local`:
```env
OPENAI_API_KEY=sk_...
GOOGLE_API_KEY=AIza_...
```

Strategi ini memungkinkan easy switching antar provider tanpa mengubah kode aplikasi.

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

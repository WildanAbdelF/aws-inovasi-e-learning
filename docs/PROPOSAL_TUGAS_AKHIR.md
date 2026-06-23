# PROPOSAL TUGAS AKHIR
## Integrasi LLM untuk Generasi MCQ pada Platform E-Learning: Studi Desain Sistem dan Implementasi Teknis

**Penulis**: [Nama Mahasiswa]  
**Program Studi**: [Program Studi]  
**Universitas**: [Universitas]  
**Tanggal Proposal**: [Tanggal]

---

## 1. LATAR BELAKANG DAN RUMUSAN MASALAH

### 1.1 Latar Belakang
Pembuatan soal pilihan ganda (MCQ - Multiple Choice Question) merupakan praktik asesmen yang sangat efisien untuk evaluasi pembelajaran skala besar. Namun, proses pembuatan MCQ berkualitas tinggi secara manual memerlukan:
- **Waktu signifikan**: pendidik perlu menghabiskan banyak waktu untuk setiap soal
- **Tenaga ahli**: membutuhkan keahlian pedagogis dan domain knowledge
- **Skalabilitas terbatas**: sulit untuk menghasilkan soal dalam jumlah besar untuk platform e-learning modern

Kemajuan teknologi Large Language Models (LLM) seperti GPT-4 dan Gemini membuka peluang baru untuk otomatisasi generasi MCQ. Namun, integrasi LLM untuk tugas ini memiliki tantangan teknis dan pedagogis:
- **Risiko hallusinasi**: LLM bisa menghasilkan jawaban yang tidak ada dalam materi sumber
- **Kualitas distractor**: opsi salah harus plausible namun berbeda dari jawaban benar
- **Kontrol kualitas**: perlu mekanisme validasi untuk memastikan soal sesuai tujuan pembelajaran

### 1.2 Rumusan Masalah
Penelitian ini berfokus pada pertanyaan penelitian berikut:

1. **Bagaimana merancang arsitektur sistem yang robust untuk integrasi LLM dalam generasi MCQ pada platform e-learning?**
2. **Strategi apa saja yang efektif untuk mengurangi risiko hallusinasi dan meningkatkan kualitas soal yang dihasilkan?**
3. **Seberapa efektif human-in-the-loop review workflow dalam meningkatkan kualitas soal MCQ yang dibuat oleh LLM?**
4. **Bagaimana evaluasi kualitatif dan kuantitatif terhadap kualitas soal yang dihasilkan oleh sistem ini?**

### 1.3 Tujuan Penelitian
1. Merancang dan mengimplementasikan arsitektur sistem terstruktur untuk generasi MCQ berbasis LLM
2. Mengidentifikasi dan menerapkan strategi mitigasi untuk mengurangi hallusinasi
3. Mengembangkan framework evaluasi komprehensif untuk menilai kualitas MCQ
4. Melakukan validasi empiris dengan melibatkan pendidik sebagai rater

---

## 2. METODOLOGI PENELITIAN

### 2.1 Jenis Penelitian
**Design Science Research (DSR)** dengan pendekatan design-evaluation-design iteratif.

**Rasionalisasi**: DSR adalah metodologi yang tepat untuk penelitian yang melibatkan:
- Perancangan artefak (sistem generasi MCQ)
- Implementasi teknis di environment nyata
- Evaluasi dan improvement iteratif

Penelitian ini mengikuti kerangka DSR dari Hevner et al. (2004) dengan tahapan:
1. **Problem Identification & Motivation**: identifikasi gap dalam literature dan kebutuhan praktis
2. **Define Objectives**: define tujuan solusi berdasarkan problem statement
3. **Design & Development**: merancang dan implement sistem
4. **Demonstration**: apply sistem ke context tertentu
5. **Evaluation**: evaluasi solusi terhadap defined objectives
6. **Communication**: dokumentasikan findings dan contribute ke knowledge

### 2.2 Tahapan Penelitian

#### **Fase 1: Analisis Literatur dan Requirement Gathering** (Minggu 1-2)
- **Aktivitas**:
  - Systematic literature review: AQG, distractor generation, LLM for education
  - Wawancara awal dengan 2-3 pendidik untuk understand pedagogical requirements
  - Analisis kebutuhan teknis dan business requirements
  
- **Output**: 
  - Literature summary
  - Requirement specification document
  - Design principle dan constraint definition

#### **Fase 2: Sistem Design dan Architecture** (Minggu 3-5)
- **Aktivitas**:
  - Design arsitektur berlapis (layered architecture)
  - Desain database schema dan data model
  - Desain prompt engineering strategy
  - Create UI/UX mockup dan wireframe
  
- **Deliverables**:
  - Architecture diagram dan documentation
  - High-level design document
  - Prompt templates dan examples
  - UI prototype

#### **Fase 3: Implementasi Teknis** (Minggu 6-10)
- **Aktivitas**:
  - Implementasi frontend: AutoQuizGenerator component
  - Implementasi business logic: useQuizGenerator hook
  - Implementasi API layer: POST /api/quiz/generate endpoint
  - Implementasi service layer: LLM integration, parsing, validation
  - Setup LLM provider integration (OpenAI, Gemini)
  - Testing dan debugging
  
- **Deliverables**:
  - Source code dengan clean code practices
  - API documentation
  - Unit test coverage > 70%
  - Technical documentation

#### **Fase 4: Evaluasi Desain (Quality Assurance)** (Minggu 11-13)
- **Aktivitas**:
  - Functional testing: semua fitur berjalan sesuai spec
  - Edge case testing: error handling, fallback mechanisms
  - Performance testing: response time, API reliability
  - Security testing: input validation, API key management
  
- **Output**: 
  - Test report
  - Quality metrics
  - Bug fixes dan improvements

#### **Fase 5: Evaluasi Empiris (Empirical Validation)** (Minggu 14-16)
- **Aktivitas**:
  - Generasi sample soal: 3 course, 15 module, 75 soal total
  - Recruitment rater: 3 pendidik berpengalaman
  - Penilaian soal menggunakan rubrik terstruktur
  - Calculate inter-rater reliability (Cohen's Kappa / Fleiss' Kappa)
  - Analisis hasil kuantitatif dan kualitatif
  
- **Deliverables**:
  - Dataset hasil generasi MCQ
  - Hasil penilaian dan scoring
  - Statistical analysis (descriptive, reliability, comparison)
  - Qualitative findings dari wawancara

#### **Fase 6: Dokumentasi dan Disseminasi** (Minggu 17-20)
- **Aktivitas**:
  - Write research paper
  - Create technical documentation
  - Prepare presentation / defense materials
  - Reflection dan lessons learned
  
- **Deliverables**:
  - Final paper
  - Implementation guide
  - Video demo
  - Defense presentation

### 2.3 Metodologi Evaluasi (Detailed)

#### **A. Evaluasi Kualitas Soal (Empirical Validation)**

**Design**: Quasi-experimental research dengan comparative rubric-based assessment

**Subjek Penelitian**:
- **Courses**: 3 course berbeda (misal: Intro to AI, Data Structures, Web Development)
- **Modules**: 5 module per course = 15 module total
- **Generated Items**: 5 soal per module = 75 soal total
- **Total Evaluations**: 75 soal × 3 rater = 225 penilaian individual

**Rater (Expert Judges)**:
- Minimal 3 pendidik dengan expertise di masing-masing domain course
- Minimal 3+ tahun pengalaman mengajar dan membuat assessment
- Background: instruktur atau assistant professor di institusi pendidikan

**Instrument**: Rubrik penilaian 4-dimensi × 5-skala

| **Dimensi** | **Level 1** | **Level 2** | **Level 3** | **Level 4** | **Level 5** |
|---|---|---|---|---|---|
| **Correctness** | Tidak sesuai materi | Sesuai tapi penjelasan tidak lengkap | Sesuai, penjelasan cukup | Sesuai, penjelasan jelas | Sangat jelas, komprehensif |
| **Relevance** | Tidak relevan | Sedikit relevan | Cukup relevan | Sangat relevan | Menguji deep understanding |
| **Clarity** | Ambiguous | Kurang jelas | Cukup jelas | Jelas, spesifik | Sangat jelas, unambiguous |
| **Distractor Quality** | Obvious salah | Kurang plausible | Cukup plausible | Sangat plausible | Sophisticated, highly plausible |

**Procedure**:
1. Rater diberi training 2 jam tentang rubrik dan expectations
2. Setiap rater menilai semua 75 soal secara independent (tidak ada komunikasi antar rater)
3. Untuk 10% soal (8 soal), ketiga rater akan menilai → calculate inter-rater reliability
4. Untuk remaining 90% soal, masing-masing rater menilai subset unik
5. Data entry ke spreadsheet dan statistical analysis

**Metrics**:
- **Descriptive Statistics**: Mean, SD, Median, Mode per dimensi
- **Inter-Rater Reliability**: Fleiss' Kappa (3 raters)
  - Target: Kappa > 0.70 (substantial agreement per Landis & Koch, 1977)
- **Quality Score**: Average score across 4 dimensions
  - Target: Mean score ≥ 3.5/5.0 (above average quality)
- **Pass Rate**: % soal dengan score ≥ 3/5 per dimensi
  - Target: ≥ 80% soal mendapat score ≥ 3

#### **B. Evaluasi Efisiensi (Efficiency Metrics)**

| **Metrik** | **Target** | **Measurement Method** |
|---|---|---|
| **Time-to-Generate** | < 30 sec per 5 soal | Measure elapsed time dari API call → response received |
| **Manual Effort** | 5-10 min review per 5 soal | Measure time pendidik untuk review & edit |
| **Cost** | < $0.01 per soal | Track API call cost (OpenAI/Gemini) |
| **API Success Rate** | > 95% | Track successful API calls vs total calls |

#### **C. Evaluasi Usability dan User Experience (Qualitative)**

**Method**: Semi-structured interview dengan 3 rater pendidik

**Question Guide**:
1. Bagaimana pengalaman Anda menggunakan sistem ini?
2. Seberapa mudah menggunakan fitur generate soal?
3. Confidence Anda terhadap kualitas soal yang dihasilkan? (Likert scale 1-5)
4. Berapa lama waktu yang Anda hemat dibanding membuat soal manual?
5. Fitur apa yang perlu ditambahkan atau ditingkatkan?
6. Apakah Anda akan menggunakan sistem ini di kelas Anda?
7. Apa hambatan atau concern utama Anda?

**Output**: Thematic analysis dari interview responses

### 2.4 Populasi dan Sample

**Populasi**:
- Semua platform e-learning yang menggunakan MCQ sebagai assessment tool
- Semua pendidik yang membuat MCQ secara berkala

**Sample**:
- **Pragmatic sampling** (convenience): 3 course dari institusi yang accessible
- **Expert sampling**: 3 pendidik dengan domain expertise di course masing-masing
- **Purposive sampling**: 75 soal yang diverse dalam topik dan difficulty level

**Justifikasi**: Sample size ini sufficient untuk quasi-experimental design dan qualitative evaluation. Untuk DSR approach, kualitas participant dan domain relevance lebih penting daripada statistikal representativeness.

### 2.5 Teknik Pengumpulan Data

| **Data** | **Source** | **Metode** | **Timeline** |
|---|---|---|---|
| Soal MCQ | System output | Automated generation | Minggu 14 |
| Penilaian soal | 3 expert raters | Rubric scoring | Minggu 15 |
| Interview feedback | 3 pendidik | Semi-structured interview | Minggu 16 |
| Performance metrics | System logs | Automated tracking (API response time, success rate) | Ongoing |
| Code quality | Source code | Static analysis, test coverage | Minggu 10-13 |

### 2.6 Teknik Analisis Data

#### **Quantitative Analysis**:
1. **Descriptive Statistics**:
   - Mean, SD, Median per dimensi penilaian
   - Distribution analysis (histogram, box plot)
   - % soal dengan score threshold tertentu

2. **Reliability Analysis**:
   - Fleiss' Kappa untuk inter-rater agreement
   - Cronbach's Alpha untuk internal consistency dimensi

3. **Comparison Analysis**:
   - Perbandingan antar difficulty level (ANOVA one-way)
   - Perbandingan antar dimensi (paired t-test)

#### **Qualitative Analysis**:
1. **Thematic Coding**:
   - Transcript dari interview di-code secara independent
   - Identify recurring themes dan patterns
   - Create code hierarchy (parent code, sub-codes)

2. **Sentiment Analysis**:
   - Analyze user feedback untuk positive/negative sentiment
   - Categorize suggestions for improvement

### 2.7 Validitas dan Reliabilitas

**Internal Validity**:
- **Threats**: Selection bias (hanya 3 pendidik), maturation (waktu penilaian lama)
- **Mitigasi**: Structured rubric, training rater, clear procedure, time-bounded evaluation

**External Validity**:
- **Threats**: Limited to 3 courses, specific institutional context
- **Mitigasi**: Select courses dari diverse domains; generalization cukup untuk DSR phase awal

**Construct Validity**:
- **Threats**: Rubric mungkin tidak capture semua aspect kualitas MCQ
- **Mitigasi**: Rubric based on literature review (Tarrant et al., 2006); validated dengan expert consensus

**Reliability**:
- Inter-rater reliability measured menggunakan Fleiss' Kappa
- Test-retest reliability tidak applicable (one-time measurement)

---

## 3. KERANGKA TEORITIS

### 3.1 Teori yang Mendasari Penelitian

#### **1. Design Science Research (DSR)**
- **Source**: Hevner et al. (2004), "Design Science in Information Systems Research"
- **Kontribusi ke penelitian**: Provide systematic methodology untuk design dan evaluate artefak (sistem)
- **Implementasi**: Follow DSR cycle: problem → design → demonstrate → evaluate → communicate

#### **2. Automatic Question Generation (AQG)**
- **Source**: Literatur dari Qiu et al. (2020), Liang et al. (2018)
- **Konsep kunci**: Over-generation + ranking, importance of distractor quality
- **Aplikasi**: Inform strategy untuk generasi MCQ berkualitas

#### **3. Pedagogical Theory**
- **Bloom's Taxonomy**: Cognitive levels (recall → synthesis)
  - Inform design difficulty levels (easy, medium, hard)
  - Validation bahwa soal cover diverse cognitive domains

- **Assessment Theory**: Principles dari measurement and evaluation
  - MCQ quality dimensions (Tarrant et al., 2006)
  - Item discrimination dan difficulty index

#### **4. Human-in-the-Loop (HITL) Framework**
- **Concept**: AI system dengan human feedback loop
- **Application**: Review dan edit MCQ before publish
- **Benefit**: Reduce error rate dan ensure human responsibility

### 3.2 Kerangka Konseptual

```
Pedagogical Requirements
    ↓
System Architecture Design
    ├─ Frontend (UI Component)
    ├─ Business Logic (Hook)
    ├─ API Layer (Endpoint)
    └─ Service Layer (LLM Integration)
    ↓
Quality Control Mechanisms
    ├─ Prompt Constraints
    ├─ Output Schema Validation
    └─ Human-in-the-Loop Review
    ↓
Generated MCQ
    ↓
Empirical Evaluation
    ├─ Quantitative: Rubric-based scoring
    ├─ Qualitative: Expert feedback
    └─ Efficiency: Metrics tracking
    ↓
Findings & Recommendations
```

---

## 4. KONTRIBUSI PENELITIAN

### 4.1 Kontribusi Akademik (Knowledge Contribution)

1. **Design Contribution**:
   - Arsitektur sistem terstruktur untuk LLM-based MCQ generation
   - Documented design patterns dan rationale

2. **Methodological Contribution**:
   - Rubric-based evaluation framework untuk quality assessment MCQ
   - Inter-rater reliability methodology untuk validate quality

3. **Practical Contribution**:
   - Working implementation dari sistem generasi MCQ
   - Technical best practices untuk LLM integration di e-learning

### 4.2 Manfaat Stakeholder

**Untuk Pendidik**:
- Reduce waktu pembuatan soal
- Assistance dalam generating diverse soal variations
- Quality review workflow untuk maintain standard

**Untuk Platform E-Learning**:
- Accelerate course development
- Enable personalized assessment (soal berbeda difficulty per learner)
- Reduce authoring bottleneck

**Untuk Institusi Pendidikan**:
- Improve assessment quality di scale
- Enable data-driven insights tentang learner performance
- Competitive advantage dalam course offering

**Untuk Peneliti Pendidikan**:
- Contribute ke literature tentang AI in education
- Framework untuk evaluate AI-assisted assessment
- Baseline untuk future research

---

## 5. TIMELINE DAN RENCANA KERJA

| **Fase** | **Aktivitas Utama** | **Minggu** | **Output** |
|---|---|---|---|
| **1. Literature & Requirements** | Systematic review, stakeholder interviews | 1-2 | Requirement spec, design principles |
| **2. System Design** | Architecture design, schema design, prompt design | 3-5 | Design document, prototype |
| **3. Implementation** | Coding frontend/API/service, LLM integration | 6-10 | Source code, API docs, unit tests |
| **4. QA & Testing** | Functional, edge case, performance testing | 11-13 | Test report, quality metrics |
| **5. Empirical Evaluation** | Data collection, expert assessment, analysis | 14-16 | Evaluation data, statistical analysis |
| **6. Documentation & Dissemination** | Paper writing, final documentation, defense prep | 17-20 | Final paper, presentation |

**Total Duration**: 20 minggu (5 bulan)

---

## 6. SUMBER DAYA YANG DIPERLUKAN

### 6.1 Sumber Daya Teknis

| **Resource** | **Detail** | **Availability** |
|---|---|---|
| **Dev Environment** | VS Code, Node.js 18+, npm | Already available |
| **LLM API** | OpenAI (GPT-4o-mini), Google Gemini | Free tier / Institutional account |
| **Database** | Supabase (PostgreSQL) | Free tier sufficient |
| **Version Control** | GitHub | Available |
| **Testing Framework** | Jest, React Testing Library | Open source |
| **Documentation** | Markdown, Mermaid diagrams | Open source tools |

### 6.2 Sumber Daya Manusia

| **Role** | **Count** | **Duration** | **Responsibility** |
|---|---|---|---|
| **Researcher / Developer** | 1 | 20 minggu | Overall project lead, implementation |
| **Academic Advisor** | 1 | Ongoing | Guidance, feedback, validation |
| **Expert Raters** | 3 | 2 minggu (Fase 5) | Evaluate MCQ quality |
| **Pilot Users** | 2-3 | Throughout | Feedback pada iterative design |

### 6.3 Estimated Budget

| **Item** | **Cost** | **Notes** |
|---|---|---|
| **LLM API** | $50-100 | OpenAI/Gemini usage during development & evaluation |
| **Hosting** | $0 (Free tier) | Supabase free tier |
| **Tools & Software** | $0 | Open source tools |
| **Incentive untuk Raters** | $0-50 | Optional, depends on institution |
| **Total** | **$50-150** | Minimal budget requirement |

---

## 7. EXPECTED OUTCOMES

### 7.1 Deliverables

1. **Source Code** (100% complete)
   - Frontend component dengan full features
   - API endpoint dengan validation dan error handling
   - Service layer dengan LLM integration dan fallback
   - Unit tests dengan coverage > 70%

2. **Documentation** (100% complete)
   - Technical documentation (architecture, API specs, deployment guide)
   - User guide untuk pendidik
   - Implementation guide untuk developer
   - README dan inline code comments

3. **Empirical Data** (100% complete)
   - Dataset 75 MCQ yang di-generate
   - Hasil penilaian dari 3 raters (225 penilaian)
   - Statistical analysis (descriptive, reliability, comparison)
   - Interview transcript dan thematic analysis

4. **Final Deliverable**
   - **Skripsi/Thesis paper**: Comprehensive report dengan research findings
   - **Defense Presentation**: Slides dan live demo
   - **Optional**: Published paper untuk conference atau journal

### 7.2 Expected Quality Metrics

| **Metrik** | **Target** |
|---|---|
| Inter-rater Kappa | > 0.70 (substantial agreement) |
| Quality Score (rubric) | Mean ≥ 3.5/5.0 |
| % Soal dengan score ≥ 3/5 | ≥ 80% |
| API Success Rate | > 95% |
| Code Coverage | > 70% |
| Response Time | < 30 sec per 5 soal |

### 7.3 Expected Findings

**Optimal Scenario**:
- LLM dapat menghasilkan MCQ berkualitas dengan proper constraints
- Human-in-the-loop review efektif increase quality
- Pendidik reduce 50%+ waktu dibanding manual creation
- System reliable dan user-friendly

**Pessimistic Scenario**:
- Quality tidak meet expectation → need design improvement
- Hallucination masih sering terjadi → stronger constraints needed
- Human review masih require banyak editing time → reconsider approach

**Either way**: Research will contribute valuable insights tentang feasibility dan limitations

---

## 8. REFERENSI KUNCI

### Research Papers
- Hevner, A. R., et al. (2004). "Design Science in Information Systems Research." *MIS Quarterly*, 28(1), 75-105.
- Biancini, A., et al. (2024). "Large Language Models for Educational Question Generation." *Journal of Educational Technology*.
- Qiu, X., et al. (2020). "Learning to Rank for Automatic Question Generation." *ACL Proceedings*.
- Tarrant, M., et al. (2006). "The Frequency of Item-Writing Flaws in Multiple-Choice Questions." *Medical Teacher*, 28(7).
- Hingorjo, M. R., & Jaleel, F. (2012). "Analysis of One-Best MCQ Scoring Systems." *Journal of Educational Evaluation*.

### Books & Standards
- Bloom, B. S., et al. (1956). *Taxonomy of Educational Objectives: The Classification of Educational Goals*.
- Landis, J. R., & Koch, G. G. (1977). "The Measurement of Observer Agreement for Categorical Data." *Biometrics*, 33(1), 159-174.

---

## 9. RISIKO DAN MITIGASI

| **Risk** | **Probability** | **Impact** | **Mitigation** |
|---|---|---|---|
| LLM API downtime | Medium | High | Use multiple providers + fallback |
| Low inter-rater agreement | Low | High | Training rater + clear rubric |
| Hallucination issue | High | Medium | Strong prompt constraints + review |
| Limited course diversity | Medium | Low | Carefully select 3 diverse courses |
| Rater dropout | Low | Medium | Buffer time + incentive |
| Scope creep | Medium | Medium | Clear requirement spec, change management |

---

## 10. KESIMPULAN

Penelitian ini mengusulkan pendekatan **Design Science Research** untuk merancang, mengimplementasikan, dan evaluate sistem generasi MCQ berbasis LLM. Dengan kombinasi design thinking, systematic implementation, dan rigorous empirical evaluation, penelitian ini akan berkontribusi kepada:

1. **Knowledge**: Pemahaman tentang feasibility dan best practices LLM integration untuk educational assessment
2. **Artifact**: Working system yang dapat digunakan oleh platform e-learning dan pendidik
3. **Practice**: Guidelines dan recommendation untuk edtech practitioners

Metodologi yang dipilih adalah appropriate untuk research question dan achievable dalam timeframe yang diberikan. Expected outcomes adalah research paper berkualitas yang dapat dipublikasikan di education technology venues.

---

**Persetujuan Dosen Pembimbing:**

| Role | Name | Signature | Date |
|---|---|---|---|
| Dosen Pembimbing I | [Nama] | _____ | _____ |
| Dosen Pembimbing II | [Nama] | _____ | _____ |

---

**Appendix: Evaluation Rubric Full Detail** (tersedia di halaman berikutnya)

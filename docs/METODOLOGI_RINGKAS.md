# RINGKASAN METODOLOGI PENELITIAN
## Integrasi LLM untuk Generasi MCQ pada Platform E-Learning

---

## METODOLOGI PENELITIAN - OVERVIEW

### 1. Tipe Penelitian: **Design Science Research (DSR)**

DSR adalah metodologi yang tepat untuk penelitian yang menggabungkan:
- 🎯 Perancangan artefak (sistem software)
- 🔧 Implementasi teknis 
- 📊 Evaluasi empiris
- 🔄 Iterasi improvement

**Mengapa DSR?** 
Penelitian ini tidak hanya menguji hipotesis (empirical), tapi juga merancang dan membangun solusi praktis (engineering). DSR menggabungkan rigor science dengan relevance engineering.

---

## FRAMEWORK DSR - 6 TAHAPAN

```
┌─────────────────────────────────────────┐
│ 1. PROBLEM IDENTIFICATION & MOTIVATION   │
│    → Identify gap: LLM belum optimal     │
│      untuk MCQ generation di e-learning  │
└──────────────┬──────────────────────────┘
               ↓
┌─────────────────────────────────────────┐
│ 2. DEFINE OBJECTIVES OF SOLUTION        │
│    → Rancang sistem yang:                │
│      - Reduce hallucination             │
│      - Improve distractor quality       │
│      - Efficient & user-friendly        │
└──────────────┬──────────────────────────┘
               ↓
┌─────────────────────────────────────────┐
│ 3. DESIGN & DEVELOPMENT                 │
│    → Arsitektur berlapis (Layers)       │
│    → Prompt engineering strategy        │
│    → Quality control mechanisms         │
└──────────────┬──────────────────────────┘
               ↓
┌─────────────────────────────────────────┐
│ 4. DEMONSTRATION                        │
│    → Implementasi & setup di institution│
│    → Generate sample MCQ (75 soal)      │
│    → Collect user feedback              │
└──────────────┬──────────────────────────┘
               ↓
┌─────────────────────────────────────────┐
│ 5. EVALUATION                           │
│    → Quantitative: Rubric scoring       │
│    → Qualitative: Expert interviews     │
│    → Efficiency: Performance metrics    │
└──────────────┬──────────────────────────┘
               ↓
┌─────────────────────────────────────────┐
│ 6. COMMUNICATION                        │
│    → Skripsi/paper publication          │
│    → Technical documentation            │
│    → Presentation & defense             │
└─────────────────────────────────────────┘
```

---

## DETAIL IMPLEMENTATION STRATEGY

### A. DESIGN PHASE (Minggu 1-5)

**Inputs:**
- Literatur review (AQG, distractor generation, LLM)
- Pedagogical requirements (dari 2-3 expert pendidik)
- Technical requirements (dari platform e-learning)

**Outputs:**
```
Architecture Design
├── Frontend Layer
│   └── AutoQuizGenerator Component
├── Business Logic Layer  
│   └── useQuizGenerator Hook
├── API Layer
│   └── POST /api/quiz/generate
└── Service Layer
    └── LLM Integration + Parsing
```

**Key Design Decisions:**
1. **Multi-layer architecture** → separation of concerns
2. **Provider fallback strategy** (Gemini → OpenAI → Dummy)
3. **Structured prompt** dengan constraints
4. **Output schema validation** untuk robustness
5. **Human-in-the-loop** workflow untuk quality control

---

### B. IMPLEMENTATION PHASE (Minggu 6-13)

**Technology Stack:**
- **Frontend**: React/Next.js (TypeScript)
- **Backend**: Next.js API Routes
- **LLM Providers**: OpenAI API + Google Gemini API
- **Database**: Supabase (PostgreSQL)
- **Testing**: Jest + React Testing Library

**Quality Assurance:**
- ✅ Unit tests (> 70% coverage)
- ✅ Integration tests
- ✅ Error handling & edge cases
- ✅ Performance optimization
- ✅ Security validation

---

### C. EVALUATION PHASE (Minggu 14-16)

#### **1. EMPIRICAL EVALUATION (Quantitative)**

**Setup:**
- **Subjects**: 3 courses (diverse domains)
  - Course 1: Intro to AI
  - Course 2: Data Structures  
  - Course 3: Web Development
  
- **Sample**: 75 MCQ (5 per module × 15 modules)
  
- **Raters**: 3 expert pendidik dengan 3+ tahun experience teaching

**Instrument: 4-Dimensional Rubric (5-point Likert)**

| Dimensi | Fokus | Level 1-5 |
|---------|-------|----------|
| **Correctness** | Jawaban benar & penjelasan | Not applicable → Comprehensive |
| **Relevance** | Sesuai dengan materi | Not relevant → Deep understanding |
| **Clarity** | Kejelasan stem soal | Ambiguous → Unambiguous |
| **Distractor Quality** | Plausibility opsi salah | Obvious → Highly sophisticated |

**Procedure:**
```
1. TRAINING (2 jam)
   ↓
2. RATER 1, 2, 3 menilai 8 soal overlap
   ↓ (Calculate Fleiss' Kappa)
   ↓
3. RATER masing-masing nilai subset unik (remaining 67 soal)
   ↓
4. DATA ANALYSIS
   - Descriptive statistics
   - Inter-rater reliability
   - Quality score aggregation
```

**Expected Outcomes:**
- Fleiss' Kappa > 0.70 (substantial agreement)
- Quality score mean ≥ 3.5/5.0
- ≥ 80% soal dengan score ≥ 3/5

#### **2. QUALITATIVE EVALUATION**

**Method**: Semi-structured interviews dengan 3 raters

**Key Questions:**
- Usability: Mudah digunakan?
- Confidence: Percaya kualitas soal? (Likert 1-5)
- Efficiency: Berapa waktu hemat vs manual?
- Adoption: Akan pakai di kelas?
- Improvement: Fitur apa yang perlu ditambah?

**Analysis**: Thematic coding → identify themes & patterns

#### **3. EFFICIENCY METRICS**

| Metrik | Target | How to Measure |
|--------|--------|----------------|
| **Response Time** | < 30 sec / 5 soal | Log API timing |
| **Review Time** | 5-10 min / 5 soal | Measure educator time |
| **Cost** | < $0.01/soal | Track API costs |
| **API Success Rate** | > 95% | Count successful calls |

---

## DATA COLLECTION SUMMARY

```
Timeline: Minggu 14-16 (3 minggu)

Week 14:
├─ Generate 75 MCQ using system
├─ Prepare evaluation materials
└─ Recruit & train 3 raters

Week 15:
├─ Raters score 8 overlap questions
├─ Calculate inter-rater reliability
└─ Raters score remaining 67 questions

Week 16:
├─ Conduct interviews dengan raters
├─ Data entry & cleanup
├─ Statistical analysis
└─ Thematic analysis dari interviews
```

---

## ANALYSIS METHODS

### Quantitative Analysis

**1. Descriptive Statistics**
```
Per dimensi:
- Mean (M) = ∑X / n
- Std Dev (SD) = √(∑(X-M)² / (n-1))
- Median, Mode
- Distribution: histogram, boxplot
```

**2. Inter-Rater Reliability**
```
For 3 raters (8 overlap soal):

Fleiss' Kappa = (P̄ₒ - P̄ₑ) / (1 - P̄ₑ)

Interpretation:
- Kappa > 0.81: Excellent agreement
- Kappa 0.61-0.80: Substantial  ✓ Target
- Kappa 0.41-0.60: Moderate
- Kappa < 0.40: Fair/Poor
```

**3. Internal Consistency**
```
Cronbach's Alpha = k/(k-1) × (1 - (∑σᵢ²/σₜ²))
- Measure: do 4 dimensions measure same construct?
- Target: α > 0.60 (acceptable)
```

### Qualitative Analysis

**1. Thematic Coding**
```
Interview transcript
  ↓
Identify meaning units
  ↓
Code assignment (open coding)
  ↓
Code grouping → categories
  ↓
Create code hierarchy
  ↓
Identify themes
```

**2. Sentiment Analysis**
```
Categorize responses:
- Positive sentiment
- Negative sentiment  
- Neutral sentiment
- Mixed sentiment
```

---

## VALIDITY & RELIABILITY CONSIDERATIONS

### **Internal Validity**
```
Threats:
- Selection bias (only 3 educators)
- Maturation (long evaluation process)
- Instrumentation (rubric limitations)

Mitigation:
✓ Structured rubric based on literature
✓ Rater training & consistency checks
✓ Clear evaluation procedure
✓ Time-bounded (2 weeks max)
```

### **Construct Validity**
```
Does rubric measure "quality MCQ"?

✓ 4 dimensions grounded in literature
  (Tarrant et al., 2006; Bloom's taxonomy)
✓ Expert consensus on rubric design
✓ Internal consistency check (Cronbach's α)
```

### **Reliability**
```
Are measurements consistent?

✓ Inter-rater reliability (Fleiss' Kappa > 0.70)
✓ Internal consistency (Cronbach's α > 0.60)
✓ Structured instrument (no ambiguity)
```

---

## SUMMARY: METODOLOGI PENELITIAN

| Aspek | Detail |
|-------|--------|
| **Tipe** | Design Science Research (DSR) |
| **Tahapan** | 6 tahapan: problem → design → implement → demonstrate → evaluate → communicate |
| **Durasi** | 20 minggu (5 bulan) |
| **Sample** | 75 MCQ dari 3 courses, dinilai oleh 3 expert raters |
| **Instrumen** | 4-dimensional rubric (5-point Likert) |
| **Evaluasi Utama** | Inter-rater reliability (Fleiss' Kappa), quality scores, qualitative feedback |
| **Target Quality** | Kappa > 0.70, quality score ≥ 3.5/5.0, 80% soal acceptable |
| **Contribution** | System design, evaluation framework, empirical validation |

---

## KEUNGGULAN METODOLOGI INI

✅ **Comprehensive**: Menggabungkan design, implementation, dan evaluation  
✅ **Rigorous**: Quantitative (statistics) + Qualitative (interviews)  
✅ **Practical**: Menghasilkan working system yang bisa digunakan  
✅ **Theoretically grounded**: Based on DSR framework dan pedagogical principles  
✅ **Feasible**: Achievable dalam 20 minggu dengan resources available  
✅ **Relevant**: Addresses real problem di e-learning platforms

---

## KONTRIBUSI YANG DIHARAPKAN

```
Knowledge Contribution:
├─ Understanding LLM feasibility untuk MCQ generation
├─ Best practices untuk prompt engineering
├─ Quality evaluation framework
└─ Lessons learned & limitations

Practical Contribution:
├─ Working system implementasi
├─ Technical documentation
├─ Deployment guide
└─ User guide untuk pendidik

Academic Contribution:
├─ Publishable research paper
├─ Conference presentation
└─ Foundation untuk future research
```

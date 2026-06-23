# KOMPARASI METODOLOGI DENGAN PENELITIAN SEJENIS
## Positioning Penelitian dalam Konteks Literatur

---

## 1. LANDSCAPE PENELITIAN LLM + EDUCATION

### Tren Penelitian Utama

```
Timeline & Focus Areas:

2016-2019:
├─ Automatic Question Generation (AQG) dengan neural networks
└─ Distractor generation using learning-to-rank

2020-2022:
├─ BERT-based approaches untuk semantic understanding
├─ Transfer learning untuk domain-specific MCQ
└─ First studies on LLM for education

2023-2024 (Current):
├─ Large Language Models (GPT-4, Gemini) untuk MCQ
├─ Prompt engineering & in-context learning
├─ Quality evaluation & hallucination mitigation
├─ RESEARCH GAP: Limited studies on implementation architecture
│                & empirical evaluation di production settings
└─ Proposed Research: ← THIS THESIS FILLS THE GAP
```

---

## 2. KOMPARASI METODOLOGI DENGAN PENELITIAN LAIN

### Tabel Komparasi Sistematis

| **Aspek** | **Penelitian Ini** | **Biancini et al. (2024)** | **Qiu et al. (2020)** | **Tarrant et al. (2006)** |
|-----------|-------------------|---------------------------|----------------------|--------------------------|
| **Focus** | System design + MCQ quality evaluation | LLM prompt strategies | Learning-to-rank for AQG | MCQ quality metrics |
| **Metodologi** | Design Science Research | Empirical experiment | Machine learning | Literature review + practice analysis |
| **Teknologi** | GPT-4o-mini + Gemini | GPT-3.5 / GPT-4 | Ranking models | N/A (pre-AI) |
| **Artifact** | Working system implementasi | Prompt templates | Ranking model | Rubric & guidelines |
| **Evaluasi** | Rubric-based (4 dimensions) + inter-rater reliability | Prompt effectiveness + user study | Ranking accuracy | Dimensi quality items |
| **Sample Size** | 75 MCQ × 3 raters | ~100 items | Large dataset | 900+ items analysis |
| **Contribution** | Architecture + Implementation | Prompt engineering | Ranking algorithm | Item analysis framework |
| **Novelty** | System design + empirical validation | Prompt strategy | Algorithmic approach | Foundational framework |

---

## 3. MENGAPA DESIGN SCIENCE RESEARCH (DSR)?

### Perbandingan Metodologi Research di Bidang AI+Education

```
TRADITIONAL EMPIRICAL RESEARCH
├─ Question: Does X work better than Y?
├─ Method: Hypothesis testing, statistical comparison
├─ Output: Theory, generalizable findings
└─ Limitation: Tidak menghasilkan artifact/solution praktis

                            ↓
                     OUR RESEARCH
                
DESIGN SCIENCE RESEARCH (DSR)
├─ Question: Bagaimana merancang sistem yang efektif?
├─ Method: Design → Implementation → Evaluation
├─ Output: Working system + validated design principles
└─ Strength: Both rigorous AND practical

                            ↓
                   ENGINEERING RESEARCH
                   
├─ Question: Bagaimana build/develop X?
├─ Method: Engineering process, best practices
├─ Output: System, technical guide
└─ Limitation: Limited theoretical contribution
```

### Karakteristik DSR yang Sesuai dengan Penelitian Ini

✅ **Problem-driven**: Ada real problem → automation MCQ generation  
✅ **Solution-oriented**: Merancang & mengimplementasikan solusi  
✅ **Evaluation-driven**: Validasi melalui empirical assessment  
✅ **Iterative**: Design → implement → evaluate → improve  
✅ **Practical relevance**: Hasil bisa langsung digunakan  

---

## 4. POSITIONING TERHADAP PENELITIAN SEJENIS

### Penelitian A: Biancini et al. (2024) - "Large Language Models for Educational Question Generation"

**Fokus**: 
- Evaluasi efektivitas berbagai prompt strategies untuk MCQ generation
- Study hallucination dalam LLM-generated MCQ
- Best practices untuk prompt engineering

**Metodologi**: 
- Experimental design dengan multiple prompt variations
- Comparative analysis antara prompt types
- User study dengan educators

**Kontribusi**: 
- Knowledge tentang prompt strategies
- Best practices untuk mendapatkan quality output dari LLM

**POSISI PENELITIAN INI**:
```
Biancini et al. (2024):
[What prompts work?] 

PENELITIAN INI:
[Bagaimana designing production system dengan prompt tersebut?]

Biancini jawab: "Use constraint prompts + context injection"
Penelitian ini: "Here's the architecture + implementation + validation"
```

### Penelitian B: Qiu et al. (2020) - "Learning to Rank for Automatic Question Generation"

**Fokus**: 
- Algorithmic approach menggunakan learning-to-rank untuk AQG
- Improve quality melalui ranking mechanism
- Performance evaluation pada benchmark dataset

**Metodologi**: 
- Machine learning approach
- Dataset construction dan training
- Metric evaluation (BLEU, METEOR, etc)

**Kontribusi**: 
- Ranking algorithm untuk AQG
- Empirical results pada large dataset

**POSISI PENELITIAN INI**:
```
Qiu et al. (2020):
[How to rank questions algorithmically?]

PENELITIAN INI:
[How to integrate modern LLM with system design?]
[How to control quality in production?]

Qiu: ML-based ranking
Penelitian ini: Layered architecture + human-in-the-loop
```

### Penelitian C: Tarrant et al. (2006) - "Frequency of Item-Writing Flaws"

**Fokus**: 
- Analyze flaws dalam MCQ written by educators
- Identify common mistakes
- Propose quality guidelines

**Metodologi**: 
- Literature review + analysis of real MCQ samples
- Classification of common flaws
- Best practices guidelines

**Kontribusi**: 
- Framework untuk identify MCQ quality issues
- Foundational rubric untuk item analysis

**POSISI PENELITIAN INI**:
```
Tarrant et al. (2006):
[What are quality dimensions for MCQ?]
→ Establish: Correctness, Clarity, Distractor quality

PENELITIAN INI:
[Can we generate MCQ dengan quality ini menggunakan LLM?]
→ Using Tarrant's dimensions sebagai evaluation rubric
```

---

## 5. UNIQUE CONTRIBUTIONS DARI PENELITIAN INI

### What's Different / What's New?

```
Existing Literature:
├─ Prompt engineering strategies (Biancini)
├─ Algorithmic ranking (Qiu et al.)
├─ Quality evaluation framework (Tarrant)
└─ LLM fundamentals (Brown et al., OpenAI)

RESEARCH GAP:
├─ Bagaimana designing SYSTEM untuk production?
├─ Bagaimana ARCHITECTURE yang robust?
├─ Bagaimana mitigate hallucination di implementation?
├─ Bagaimana HUMAN-IN-THE-LOOP workflow?
└─ Bagaimana EMPIRICAL VALIDATION di real context?

PENELITIAN INI FILL THE GAP:
✓ Comprehensive system design (architecture + components)
✓ Detailed implementation guidance
✓ Quality control mechanisms (prompt + schema + review)
✓ Empirical evaluation dengan 3 expert raters
✓ Practical contribution untuk edtech platforms
```

### Original Contributions

| **Dimensi** | **Kontribusi** | **Status** |
|-------------|---------------|-----------|
| **System Architecture** | 4-layer architecture design for LLM-MCQ | 🔴 Novel - Not in literature |
| **Quality Control** | Integrated prompt + schema + HITL | 🔴 Novel - Comprehensive approach |
| **Evaluation Framework** | 4-dim rubric + Fleiss' Kappa + qualitative | 🟡 Builds on Tarrant, adds empirical validation |
| **Implementation Details** | Service layer, provider fallback, parsing | 🔴 Novel - Practical contribution |
| **Empirical Validation** | Inter-rater reliability study | 🟡 Methodology known, context novel |

---

## 6. MENGAPA DSR LEBIH COCOK DARI PURE EMPIRICAL?

### Skenario Perbandingan

```
Jika menggunakan PURE EMPIRICAL APPROACH:

Hypothesis: "LLM-generated MCQ sama berkualitasnya dengan manual"

Method:
├─ Generate MCQ dengan LLM
├─ Generate MCQ manual
├─ Compare kualitas (t-test, ANOVA)
└─ Result: T-value, p-value, effect size

MASALAH:
├─ Tidak menjawab: "Bagaimana desain sistem yang baik?"
├─ Tidak provide: Architecture, implementation guide
├─ Overhead: Perlu generate manual MCQ (labor-intensive)
├─ Limited scope: Hanya test satu design
└─ Not practical: Tidak helpful untuk praktisi
```

```
Dengan DESIGN SCIENCE RESEARCH:

Question: "Bagaimana desain & evaluate sistem LLM-MCQ yang robust?"

Method:
├─ DESIGN: Arsitektur, prompt strategy, quality control
├─ IMPLEMENT: Working system dengan best practices
├─ DEMONSTRATE: Use case di 3 courses
├─ EVALUATE: Quality dengan expert raters + efficiency metrics
└─ COMMUNICATE: System design + implementation guide

KEUNTUNGAN:
✓ Answer research question secara comprehensive
✓ Produce praktis artifact (working system)
✓ Provide actionable guidance untuk practitioners
✓ Can still include empirical evaluation
✓ More relevant untuk industry + practitioners
```

---

## 7. VALIDASI & RIGOR DALAM DSR

### Skeptisisme: "Apakah DSR cukup rigorous?"

```
CONCERN: DSR kurang rigorous daripada empirical research

JAWABAN: DSR ≠ less rigorous, just DIFFERENTLY rigorous

DSR Rigor Elements:
├─ Design principles berdasarkan literature
├─ Implementation mengikuti engineering standards
├─ Evaluation empiris dengan structured instruments
├─ Inter-rater reliability (statistical validation)
├─ Comprehensive documentation untuk reproducibility
├─ Peer review (dosen pembimbing, thesis committee)
└─ Contribution to knowledge base

Kombinasi:
Research Rigor + Engineering Rigor + Empirical Rigor
```

### Quality Assurance dalam Penelitian Ini

```
DESIGN PHASE:
✓ Literature-grounded principles
✓ Expert consultation (2-3 educators)
✓ Design review dan feedback iteration

IMPLEMENTATION PHASE:
✓ Code standards (clean code, SOLID principles)
✓ Unit tests (70%+ coverage)
✓ Error handling & edge cases
✓ Security validation

EVALUATION PHASE:
✓ Structured rubric (literature-based)
✓ Expert raters (3 independent)
✓ Inter-rater reliability test (Fleiss' Kappa)
✓ Statistical analysis
✓ Qualitative validation (interviews)

COMMUNICATION PHASE:
✓ Full documentation
✓ Source code on GitHub
✓ Technical guide
✓ Thesis paper
```

---

## 8. ALIGNMENT DENGAN INSTITUTIONAL STANDARDS

### Kesesuaian dengan Program Studi

```
Jika Program Studi fokus pada:

SOFTWARE ENGINEERING / CS:
✓ System design & architecture ← THIS RESEARCH
✓ Implementation best practices
✓ Software quality assurance
✓ Integration dengan technologies (LLM, database, API)

EDUCATION / INSTRUCTIONAL DESIGN:
✓ Pedagogical principles (Bloom's taxonomy)
✓ Assessment quality frameworks
✓ Learning analytics
✓ Educational technology evaluation

INFORMATION TECHNOLOGY:
✓ System design
✓ Technology integration
✓ Quality metrics
✓ User experience evaluation
```

**Research ini cocok untuk:** 
- Software Engineering track
- IT Management track
- Educational Technology track

---

## 9. EXPECTED IMPACT & SIGNIFICANCE

### Tingkat Kontribusi

```
THEORETICAL CONTRIBUTION:
- Bagaimana LLM dapat diintegrasikan dalam system design
- Quality control mechanisms untuk AI-generated content
- Framework untuk evaluate AI-assisted assessment

PRACTICAL CONTRIBUTION:
- Working system yang bisa digunakan
- Implementation guide untuk developers
- User guide untuk educators

METHODOLOGICAL CONTRIBUTION:
- Framework untuk empirical evaluation MCQ
- Rubric-based assessment approach
- Inter-rater reliability methodology

INDUSTRY IMPACT:
- Accelerate e-learning course development
- Reduce educator workload
- Enable personalized assessment

RESEARCH IMPACT:
- Foundation untuk future research
- Reference untuk LLM in education
- Benchmark untuk quality metrics
```

### Scope Impact

```
JANGKAUAN APLIKASI:

Direct:
├─ E-learning platforms
├─ Distance education
└─ Corporate training

Indirect:
├─ Traditional schools (supplementary)
├─ Assessment automation
├─ Personalized learning

Potential Users:
├─ Educators (untuk course development)
├─ Platform providers (untuk product feature)
├─ Educational researchers (untuk evaluation framework)
└─ Student (untuk additional practice)
```

---

## 10. KESIMPULAN: WHY THIS RESEARCH MATTERS

### The Research in Context

```
2024 Landscape:
- LLM technology mature & accessible
- E-learning adoption high
- But: Limited production systems & best practices
- Gap: Between capability & practical implementation

This Research:
└─ Bridge the gap between LLM capability and real-world implementation
   ├─ Design system architecture
   ├─ Implement with quality control
   ├─ Validate empirically
   └─ Share knowledge with practitioners
```

### Who Benefits?

```
EDUCATORS:
- Less time creating assessments
- More time on instruction
- Confidence dalam AI-generated questions

EDTECH PLATFORMS:
- Feature untuk support rapid course development
- Competitive advantage
- Improve user satisfaction

INSTITUTIONS:
- Scale assessment capabilities
- Maintain quality standards
- Reduce authoring bottleneck

RESEARCHERS:
- Framework untuk future studies
- Baseline untuk improvements
- Understanding of LLM in education context
```

### Why Design Science is Right Choice

✅ **Produces both knowledge AND artifact**  
✅ **Addresses real problem in industry**  
✅ **Combines rigor with practicality**  
✅ **Allows empirical validation**  
✅ **Directly applicable contribution**  

---

**Final Note**: 

Penelitian ini bukan sekedar "test apakah LLM bisa generate MCQ" (yang sudah dijawab oleh Biancini & literature lain), tetapi "bagaimana DESIGN dan IMPLEMENT sistem production yang robust, scalable, dan berkualitas" — ini adalah kontribusi yang baru dan praktis.

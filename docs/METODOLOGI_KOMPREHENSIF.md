# PENJELASAN METODOLOGI PENELITIAN KOMPREHENSIF
## Integrasi LLM untuk Generasi MCQ pada Platform E-Learning

**Dokumen Lengkap - Untuk Diskusi Detail dengan Dosen**

---

## BAGIAN 1: METODE PENELITIAN (RESEARCH METHOD)

### 1.1 Tipe Penelitian

#### **A. Klasifikasi Utama: Design Science Research (DSR)**

```
RESEARCH TYPOLOGY CLASSIFICATION:

Berdasarkan Tujuan (Purpose):
├─ Exploratory: Understand phenomenon
├─ Descriptive: Describe characteristics
├─ Explanatory: Explain relationships
└─ Prescriptive/Design: Design solution ← THIS RESEARCH

Berdasarkan Pendekatan (Approach):
├─ Qualitative: Rich understanding
├─ Quantitative: Statistical testing
└─ Mixed-Methods: Both ← THIS RESEARCH

Berdasarkan Waktu (Temporal):
├─ Cross-sectional: Snapshot in time
├─ Longitudinal: Over time
└─ Real-time: During process ← THIS RESEARCH

Berdasarkan Setting (Context):
├─ Laboratory: Controlled environment
├─ Field: Natural setting ← THIS RESEARCH
└─ Online: Virtual environment
```

**Definisi DSR** (Hevner et al., 2004):
> Design Science Research adalah metodologi penelitian yang dirancang untuk menghasilkan pengetahuan tentang merancang dan mengembangkan artefak yang diinginkan untuk mengatasi masalah praktis.

#### **B. Karakteristik DSR untuk Penelitian Ini**

| Elemen DSR | Implementasi di Research Ini |
|-----------|------------------------------|
| **Problem Relevance** | LLM belum optimal untuk MCQ generation di e-learning platforms |
| **Design Artifact** | Sistema autogenerator MCQ dengan 4-layer architecture |
| **Design Process** | Iterative: design → implement → evaluate → refine |
| **Evaluation** | Both technical (code quality) + empirical (quality metrics) |
| **Contribution** | New system design + knowledge about feasibility |
| **Communication** | Technical documentation + research paper |

#### **C. Positioning DSR di Research Landscape**

```
        RIGOR
         ↑
         │     DESIGN SCIENCE
         │     RESEARCH
         │    ╱╲  ← Balance
         │   ╱  ╲   rigor & relevance
         │  ╱    ╲
    PURE │╱      ╲  ENGINEERING
   THEORY└────────╲──────────
         │         ╲    ╲
         │          ╲    APPLICATION
         │           ╲
         └─────────────────→ RELEVANCE/PRACTICE
```

DSR memilih sweet spot antara:
- **Pure Theory**: Terlalu abstract, kurang praktis
- **Pure Engineering**: Kurang scientific contribution
- **DSR**: Balanced approach ✓

---

### 1.2 Paradigma Penelitian

#### **A. Philosophical Foundation: Pragmatism**

```
RESEARCH PARADIGMS:

Positivism:
├─ Ontology: Objektive reality exists
├─ Epistemology: Discover through hypothesis testing
└─ Method: Quantitative, experimental
   Problem: Kurang cocok untuk design problems

Interpretivism:
├─ Ontology: Reality socially constructed
├─ Epistemology: Understand meaning & context
└─ Method: Qualitative, in-depth understanding
   Problem: Kurang fokus pada practical solution

Pragmatism (Selected):
├─ Ontology: What works is what matters
├─ Epistemology: Mix of theory & practice
├─ Method: Mixed-methods, iterative
└─ Focus: Practical problem-solving
   ✓ Cocok untuk DSR approach
```

#### **B. Implikasi Pragmatism untuk Penelitian Ini**

```
Pragmatist Lens mengakibatkan:

1. PROBLEM DEFINITION
   ├─ Fokus pada real problem (MCQ creation bottleneck)
   ├─ Bukan hanya academic curiosity
   └─ Solusi harus actionable

2. METHODOLOGY SELECTION
   ├─ Pilih method yang paling efektif (hybrid approach)
   ├─ Bukan dogmatic pada satu paradigm
   └─ Quantitative + qualitative both valued

3. EVALUATION CRITERIA
   ├─ Does it work? (Practical test)
   ├─ Does it contribute knowledge? (Scientific test)
   └─ Both equally important

4. RESEARCH QUESTIONS
   ├─ "How to design..." (practical)
   ├─ "What principles..." (theoretical)
   └─ Balanced
```

---

### 1.3 Research Design Framework

#### **A. Overall Research Design: Mixed-Methods with Sequential Phases**

```
SEQUENTIAL MIXED-METHODS DESIGN:

QUAL → QUAN → QUAL

Phase 1: QUALITATIVE (Weeks 1-2)
├─ Literature review (systematic)
├─ Expert interviews (2-3 educators)
└─ Output: Requirements & design principles

              ↓

Phase 2: QUANTITATIVE + ENGINEERING (Weeks 3-13)
├─ System design & architecture
├─ Implementation (coding)
├─ Technical QA & testing
└─ Output: Working system + code quality metrics

              ↓

Phase 3: MIXED-METHODS (Weeks 14-16)
├─ Generate 75 MCQ (system output)
├─ Quantitative: Rubric scoring + statistics
├─ Qualitative: Expert interviews
└─ Output: Quality validation + user feedback

              ↓

Phase 4: Integration & Communication (Weeks 17-20)
├─ Synthesize findings
├─ Develop design principles
├─ Write paper & documentation
└─ Output: Thesis paper + technical guide
```

#### **B. Strategi Integrasi Qual-Quan**

```
HOW QUALITATIVE AND QUANTITATIVE DATA COMPLEMENT:

Qualitative (Expert Feedback):
"Sistem ini mudah digunakan, tapi opsi salah masih 
sering tidak plausible. Saya perlu mengedit 
3 dari 5 soal sebelum gunakan."

              ↓ INFORMS

Quantitative (Distractor Quality Score):
"Mean score dimensi 'Distractor Quality' = 2.8/5.0
(below target 3.5), dengan SD = 0.9"

              ↓ EXPLAINS

Integration:
"Low distractor quality score validated by qualitative 
finding. Recommendation: Enhance prompt dengan 
specific constraint tentang plausibility criteria."
```

---

## BAGIAN 2: STRATEGI SAMPLING

### 2.1 Sampling untuk Berbagai Fase

#### **A. Phase 1 (Requirements Gathering): Expert Interview**

**Population**: Semua educators dengan MCQ creation experience  
**Target Sample**: 2-3 educators yang diverse

```
SAMPLING METHOD: Purposive Sampling (Expert Sampling)

Criteria for Selection:
✓ Minimal 3 years teaching experience
✓ Regular MCQ creator (at least 1x per semester)
✓ Different domains (prefer: AI, CS, Business)
✓ Willing untuk participate dalam interview

Recruitment:
1. Contact through institutional channels
2. Send information sheet
3. Confirm availability & schedule
4. Total estimated: 2-3 hours per educator

Expected Outcome:
- Requirement specifications
- Pedagogical constraints
- User needs & pain points
```

#### **B. Phase 2 (Implementation): N/A**
Engineering phase, tidak ada sampling needed

#### **C. Phase 3 (Evaluation): MCQ & Rater Sampling**

**Sub-Sample A: MCQ Sample**

```
POPULATION: Semua possible MCQ yang bisa digenerate
            dari 3 courses

SAMPLING STRATEGY: Purposive + Stratified Sampling

Course Selection (Stratified by Domain):
├─ Domain 1: Computer Science (e.g., Intro to AI)
├─ Domain 2: Engineering (e.g., Data Structures)
└─ Domain 3: Business (e.g., Web Development)

Rationale: Domain diversity → assess generalizability

Module Selection (Stratified within course):
├─ Course 1: Module 1-5 (5 modules)
├─ Course 2: Module 1-5 (5 modules)
├─ Course 3: Module 1-5 (5 modules)
└─ Total: 15 modules

Question Generation (Purposive):
├─ Generate 5 MCQ per module
├─ Target mix of difficulty: Easy (40%), Medium (40%), Hard (20%)
├─ Total: 75 MCQ sample
└─ Sample Coverage: 15% to 25% dari total course content

Sample Size Justification:
┌─────────────────────────────────┐
│ 75 MCQ × 3 raters = 225         │
│ per-evaluation point            │
├─────────────────────────────────┤
│ Sufficient untuk:                │
│ - Descriptive statistics        │
│ - Inter-rater reliability (n=8) │
│ - Thematic analysis             │
│ - Domain coverage               │
└─────────────────────────────────┘
```

**Sub-Sample B: Rater Sample**

```
POPULATION: Semua educators di participating institutions

SAMPLING METHOD: Purposive + Expert Sampling

Rater Selection Criteria:
✓ Minimal 3+ years teaching experience
✓ Expert dalam domain course masing-masing
✓ Regular MCQ user/creator
✓ Available untuk 10-15 jam (5 jam training + 5-10 jam evaluation)
✓ Willing untuk participate dalam study

Rater Diversity:
├─ Gender: Mix (if possible)
├─ Experience level: Prefer different levels (junior + senior)
├─ Teaching method: Mix (traditional + online + hybrid)
└─ Institution type: Prefer from different institutions (if feasible)

Recruitment Process:
1. Send invitation dengan detailed information
2. Schedule training session (2 hours)
3. Coordinate evaluation timeline
4. Follow-up untuk interviews

Expected Outcome:
├─ Rater 1: CS educator (AI specialist)
├─ Rater 2: Engineering educator
├─ Rater 3: Business educator
└─ 3 independent perspectives ✓

Inter-Rater Distribution:
├─ All 3 raters evaluate: 8 MCQ (overlap)
│  └─ Purpose: Calculate inter-rater reliability
├─ Rater 1 alone: ~22 MCQ
├─ Rater 2 alone: ~23 MCQ
└─ Rater 3 alone: ~22 MCQ
   └─ Purpose: Efficient resource use, reduce bias
```

### 2.2 Sample Size Justification

```
SAMPLE SIZE DETERMINATION:

For Qualitative Phase (Interviews):
- Guidelines: Saturation point typically 3-5 experts
- Sample: 2-3 educators
- Justification: Interview untuk exploratory → small n sufficient
- Power: Qualitative tidak perlu statistical power calculation

For Quantitative Phase (MCQ Evaluation):
- Population: Unlimited (can generate many more MCQ)
- Sample: 75 MCQ
- Justification: 
  ├─ Sufficient untuk descriptive statistics
  ├─ Allow stratification: 5 per module × 15 modules
  ├─ Manageable untuk 3 raters (225 evaluations)
  ├─ Cover domain diversity
  └─ Balance between rigor & feasibility

For Rater Sample:
- Population: All available educators
- Sample: 3 expert raters
- Justification:
  ├─ Minimum untuk Fleiss' Kappa (n_raters ≥ 3)
  ├─ Feasible dalam timeline (2 weeks evaluation)
  ├─ Allow diverse expertise
  └─ Standard di behavioral science research
```

---

## BAGIAN 3: KOMPARASI DATA (DATA COMPARISON METHODS)

### 3.1 Tipe-Tipe Komparasi

```
DATA COMPARISON MATRIX:

Komparasi Dimensi:
├─ WITHIN-SUBJECT: Perbandingan antar dimensi untuk sama rater
├─ BETWEEN-RATER: Perbandingan skor rater 1 vs rater 2 vs rater 3
├─ WITHIN-COURSE: Perbandingan antar courses
├─ DIFFICULTY-LEVEL: Easy vs Medium vs Hard questions
└─ DOMAIN: CS vs Engineering vs Business
```

### 3.2 Strategi Komparasi Spesifik

#### **A. Within-Subject Comparison: Antar Dimensi**

```
QUESTION: Dimensi mana yang paling problematic?

Data:
├─ Correctness: M = 3.7, SD = 0.8
├─ Relevance: M = 3.5, SD = 0.9
├─ Clarity: M = 3.6, SD = 0.7
└─ Distractor Quality: M = 2.8, SD = 1.1

Method: Repeated Measures ANOVA (atau Friedman Test jika non-normal)

Procedure:
1. Test normality per dimensi (Shapiro-Wilk)
2. If normal: One-way Repeated Measures ANOVA
   - H0: Mean semua dimensi sama
   - H1: Minimal ada 1 dimensi berbeda
3. If non-normal: Friedman Test (non-parametric alternative)
4. Post-hoc: Pairwise comparison (Bonferroni correction)

Expected Outcome:
"Dimensi Distractor Quality significantly lower (p < 0.05) 
compared to other dimensions. Recommendation: Focus on 
improving distractor generation strategy."
```

#### **B. Between-Rater Comparison: Agreement Check**

```
QUESTION: Seberapa konsisten ketiga rater dalam penilaian?

Data: 8 MCQ yang dinilai oleh 3 rater (n=8, raters=3)

Method: Fleiss' Kappa (Inter-Rater Agreement)

Formula:
Fleiss' Kappa = (P̄ₒ - P̄ₑ) / (1 - P̄ₑ)

Where:
- P̄ₒ = Observed agreement (actual agreement)
- P̄ₑ = Expected agreement by chance

Interpretation:
├─ Kappa < 0: Poor agreement (less than chance)
├─ 0.01 - 0.20: Slight agreement
├─ 0.21 - 0.40: Fair agreement
├─ 0.41 - 0.60: Moderate agreement
├─ 0.61 - 0.80: Substantial agreement ✓ TARGET
├─ 0.81 - 1.00: Almost perfect agreement
└─ Target: Kappa ≥ 0.70 (substantial per Landis & Koch)

Procedure:
1. Calculate agreement untuk 8 overlap items
2. Compute Kappa coefficient
3. Calculate 95% CI
4. If Kappa < 0.60: Investigate source of disagreement
   ├─ Rubric clarity issue?
   ├─ Rater training issue?
   └─ Item ambiguity?
5. If Kappa ≥ 0.70: Proceed dengan confidence
```

#### **C. Difficulty-Level Comparison**

```
QUESTION: Apakah kualitas soal berbeda per difficulty level?

Data:
- Easy questions (n=30): Scores per dimensi
- Medium questions (n=30): Scores per dimensi
- Hard questions (n=15): Scores per dimensi

Method: One-way ANOVA (or Kruskal-Wallis if non-normal)

Hypothesis:
- H0: Mean quality score sama untuk semua difficulty levels
- H1: Minimal ada 1 level dengan mean berbeda

Procedure:
1. Check assumption: normality, homogeneity of variance
2. ANOVA test per dimensi
3. Post-hoc (Tukey HSD) untuk pairwise comparison
4. Report effect size (eta-squared)

Expected Pattern:
```
Hypothesis: 
Easier questions punya quality score lebih tinggi 
(karena LLM lebih mudah generate correct answer)
Harder questions punya score lebih rendah 
(karena LLM struggle generate sophisticated distractors)

Analysis:
ANOVA: F(2,72) = 4.23, p = 0.018, η² = 0.105
Post-hoc Tukey:
- Easy vs Medium: p = 0.042 (significant)
- Easy vs Hard: p = 0.008 (significant)
- Medium vs Hard: p = 0.156 (ns)

Conclusion: Difficulty level affects quality, 
dengan easy questions significantly higher quality.
```

#### **D. Domain Comparison: Across Courses**

```
QUESTION: Apakah sistem generalize well across domains?

Data:
- AI Course: Mean quality = X₁, SD = s₁
- DS Course: Mean quality = X₂, SD = s₂
- WEB Course: Mean quality = X₃, SD = s₃

Method: One-way ANOVA

Hypothesis:
- H0: Mean quality sama untuk semua domains
- H1: Ada domain dengan quality berbeda

Expected Finding:
Jika p > 0.05 (tidak significant), artinya sistem 
generalize well across domains. 

Jika p < 0.05 (significant), artinya:
├─ System performs better di certain domain
├─ Might need domain-specific prompt tuning
└─ Important finding untuk recommendation
```

### 3.3 Komparasi: System Performance vs Baseline

```
QUESTION: Bagaimana performa sistem dibanding manual creation?

LIMITATION: Penelitian ini tidak include baseline comparison 
(manual MCQ dari pendidik) karena:
- Labor-intensive untuk generate 75 manual MCQ
- Outside scope dari DSR design focus
- Biancini et al. (2024) already did this

However, dapat reference existing literature:
├─ Biancini et al. report 60-70% quality untuk LLM MCQ
├─ Manual MCQ typically 80%+ quality (Tarrant et al.)
└─ Penelitian ini target: 70%+ quality dengan controls

Potential Future Comparison:
"If time permits, dapat generate 10 manual MCQ untuk 
baseline comparison, untuk validate our quality metrics."
```

---

## BAGIAN 4: METODE PENGOLAHAN DATA (DATA PROCESSING)

### 4.1 Data Collection Process

#### **A. Qualitative Data (Phase 1)**

```
INTERVIEW DATA COLLECTION:

Step 1: PREPARATION
├─ Develop interview guide (semi-structured)
├─ Prepare recording equipment
├─ Schedule 60 minutes per educator
└─ Confirm informed consent

Step 2: INTERVIEW EXECUTION
├─ Start with warm-up questions
├─ Use open-ended questions primarily
├─ Probe deeper untuk clarification
├─ Audio record (with permission)
├─ Take notes on key points
└─ Duration: ~60 minutes

Step 3: TRANSCRIPTION
├─ Audio → Text transcription
├─ Verbatim transcription (preserve exact words)
├─ Time-stamp key segments
├─ Clean up obvious errors (ums, ahs)
└─ Output: Full transcript (typically 8-10 pages per interview)

Step 4: BACKUP & SECURITY
├─ Store audio in secure location
├─ Encrypt transcripts
├─ Remove identifying information (if needed)
└─ Keep backup copy
```

#### **B. Quantitative Data (Phase 3)**

```
MCQ GENERATION & SCORING:

Step 1: MCQ GENERATION
├─ Run system untuk generate 75 MCQ
├─ Store dalam database / JSON format
├─ Export untuk rater review

Step 2: PREPARATION FOR RATERS
├─ Create evaluation form (digital atau paper)
├─ Include 4-dimensional rubric
├─ Randomize MCQ order (reduce bias)
├─ Prepare instruction sheet for raters

Step 3: RATER TRAINING (2 hours)
├─ Explain research context (15 min)
├─ Review rubric dimensi (30 min)
│  ├─ Show examples of score 1, 3, 5
│  ├─ Discuss edge cases
│  └─ Q&A
├─ Practice: Rate 2 sample MCQ together (45 min)
├─ Q&A & clarification (15 min)
└─ Distribute materials

Step 4: INDEPENDENT EVALUATION
├─ Each rater scores assigned MCQ
├─ Fill form: Score per dimensi (1-5 scale)
├─ Optional: Written comments
├─ Timeline: 5-10 days

Step 5: DATA COLLECTION
├─ Collect completed forms
├─ Data entry: Form → Spreadsheet
├─ Double-check entry accuracy
└─ Store securely
```

### 4.2 Data Preparation & Cleaning

```
QUALITY ASSURANCE - DATA CLEANING:

Step 1: INTEGRITY CHECK
├─ Identify missing data
│  ├─ Missing dimension score? → Contact rater
│  ├─ Entire question missing? → Mark as incomplete
│  └─ Handle: Don't impute (remove row atau rater-report)
├─ Check for outliers (value outside 1-5 range)
│  └─ Handle: Verify dengan rater, correct if data entry error

Step 2: CONSISTENCY CHECK
├─ Check if raters followed instructions
├─ Verify pattern (e.g., all scores = 3 → possible non-engagement)
├─ Contact untuk clarification jika suspicious

Step 3: NORMALIZATION
├─ Ensure all scores are on same scale (1-5)
├─ Convert if different format (e.g., 0-10 → 1-5)
├─ Standardize dimension names

Step 4: CODING & LABELING
├─ Add metadata:
│  ├─ Question ID (Q1-Q75)
│  ├─ Rater ID (R1-R3)
│  ├─ Difficulty level (easy, medium, hard)
│  ├─ Domain (AI, DS, WEB)
│  └─ Timestamp
└─ Create dataset ready for analysis

Output: Clean spreadsheet with:
- 225 rows (75 questions × 3 raters, minus non-overlap)
- Columns: Question_ID, Rater_ID, Correctness, Relevance, 
           Clarity, Distractor_Quality, Comments, Metadata
```

### 4.3 Data Coding (Qualitative)

```
INTERVIEW TRANSCRIPT CODING PROCESS:

Step 1: INITIAL READING
├─ Read all transcripts completely
├─ Get familiarized dengan data
├─ Note preliminary themes/patterns

Step 2: OPEN CODING (Line-by-line)
├─ Go through transcript line by line
├─ Identify meaningful units (phrases, sentences)
├─ Assign preliminary codes

Example:
Transcript: "Sistem ini mudah digunakan, tapi saya perlu 
            mengedit distractor karena tidak plausible.
            Mungkin 30% dari soal perlu saya ubah."

Codes: [usability-positive], [distractor-quality-issue], 
       [effort-estimate]

Step 3: CODE ORGANIZATION
├─ List all codes dari semua transcript
├─ Merge similar codes → code hierarchy
├─ Create code dictionary (definition per code)

Example Code Hierarchy:
USABILITY
├─ usability-positive (e.g., "mudah digunakan")
├─ usability-challenge (e.g., "interface bingung")
├─ learnability (e.g., "perlu training")
└─ efficiency (e.g., "cepat/lambat")

CONTENT QUALITY
├─ correctness-good
├─ relevance-issue
├─ clarity-problem
├─ distractor-quality-problem ← recurring theme
├─ hallucination-concern
└─ accuracy-praise

ADOPTION READINESS
├─ intention-positive (akan pakai)
├─ intention-conditional (mungkin pakai kalau...)
├─ concern-privacy (data handling)
└─ concern-reliability (trust in AI)

Step 4: AXIAL CODING (Relationship between codes)
├─ Identify how codes relate
├─ Organize into categories & subcategories
├─ Example relationship:
   [usability-positive] + [distractor-quality-problem]
   = "Easy to use, but need manual refinement"

Step 5: SELECTIVE CODING (Core themes)
├─ Identify central themes across all data
├─ Synthesize findings

Final Themes:
1. USABILITY IS STRONG, BUT QUALITY NEEDS IMPROVEMENT
   └─ Related codes: [usability-positive], [quality-issue]
   
2. DISTRACTOR GENERATION IS BOTTLENECK
   └─ Related codes: [distractor-quality-problem], [effort-estimate]
   
3. ADOPTION CONTINGENT ON QUALITY ASSURANCE
   └─ Related codes: [intention-conditional], [quality-concern]

Step 6: OUTPUT
├─ Thematic summary document
├─ Quote examples per theme
├─ Frequency count (how many educators mention each theme)
└─ Visual: Theme map showing relationships
```

---

## BAGIAN 5: METODE ANALISIS STATISTIK

### 5.1 Descriptive Statistics

```
OBJECTIVE: Describe karakteristik data

CALCULATIONS PER DIMENSI:

Mean (M):
- Formula: M = ∑X / n
- Example: (4 + 3 + 5 + 4 + 3) / 5 = 3.8
- Interpretation: Average quality score

Median:
- Middle value ketika data diurut
- Less affected by outliers dibanding mean
- If n odd: middle value; if even: average 2 middle values

Standard Deviation (SD):
- Formula: SD = √(∑(X - M)² / (n-1))
- Measures: Spread/variability
- Interpretation: SD = 0.8 berarti most scores within M ± 0.8

Example Output:
┌──────────────────────────────────────────┐
│ Quality Metrics Descriptive Statistics   │
├──────────────────┬─────────┬─────────────┤
│ Dimension        │ Mean    │ SD          │
├──────────────────┼─────────┼─────────────┤
│ Correctness      │ 3.7     │ 0.82        │
│ Relevance        │ 3.5     │ 0.91        │
│ Clarity          │ 3.6     │ 0.75        │
│ Distractor Quality│ 2.8    │ 1.10        │
│ OVERALL          │ 3.4     │ 0.89        │
└──────────────────┴─────────┴─────────────┘

Interpretation:
- Overall quality M = 3.4, above "adequate" threshold (3.0)
- But Distractor Quality lower → needs improvement
- SD values indicate consistent evaluation (good inter-rater)
```

### 5.2 Inferential Statistics

#### **A. Normality Testing**

```
WHY: Before choosing parametric vs non-parametric test

METHOD: Shapiro-Wilk Test (good for small-medium n)

Procedure:
1. For each dimension, test if scores normally distributed
2. Null Hypothesis: Data comes from normal distribution
3. If p > 0.05: Assume normal (use ANOVA)
4. If p < 0.05: Non-normal (use Kruskal-Wallis)

Example:
Dimension         W-statistic    p-value    Decision
Correctness       0.94           0.23       Normal ✓
Relevance         0.91           0.05       Borderline
Clarity           0.96           0.45       Normal ✓
Distractor        0.87           0.01       Non-normal ✗

Implication:
- For Correctness & Clarity: Can use ANOVA
- For Distractor Quality: Should use Kruskal-Wallis
```

#### **B. Homogeneity of Variance Testing**

```
PURPOSE: Check if variance equal across groups

TEST: Levene's Test

Procedure:
1. For comparing across difficulty levels (easy, medium, hard)
2. H0: Variances are equal across groups
3. If p > 0.05: Equal variance assumption met
4. If p < 0.05: Variances unequal → use Welch's ANOVA

Example:
F(2, 72) = 1.45, p = 0.24
Conclusion: Equal variance assumption met ✓
```

#### **C. One-Way ANOVA (for difficulty level comparison)**

```
RESEARCH QUESTION: Does question difficulty affect quality?

SETUP:
- Independent variable: Difficulty level (Easy, Medium, Hard)
- Dependent variable: Quality score (1-5)
- Groups: n_easy=30, n_medium=30, n_hard=15

ASSUMPTIONS:
1. Independence: Each question scored independently ✓
2. Normality: Shapiro-Wilk test passed (see 5.2.A) ✓
3. Homogeneity: Levene's test passed (see 5.2.B) ✓

HYPOTHESIS:
- H0: μ_easy = μ_medium = μ_hard (no difference)
- H1: At least one mean is different

CALCULATION:
ANOVA tests ratio of between-group variance to within-group variance

F-statistic = Mean Square Between / Mean Square Within

Interpretation:
- If F large & p small (p < 0.05): Reject H0 → Significant difference
- If F small & p large (p > 0.05): Fail to reject H0 → No significant diff

EFFECT SIZE (Eta-squared):
η² = SS_between / SS_total
- 0.01 = small effect
- 0.06 = medium effect
- 0.14 = large effect

EXAMPLE OUTPUT:
┌─────────────────────────────────────────────┐
│ One-Way ANOVA: Quality by Difficulty Level  │
├─────────────────────────────────────────────┤
│ F(2, 72) = 5.34, p = 0.007, η² = 0.129     │
└─────────────────────────────────────────────┘

Interpretation:
- p = 0.007 < 0.05: Significant difference EXISTS
- η² = 0.129 (large effect): Substantial practical difference
- Conclusion: Difficulty level significantly affects quality

POST-HOC TEST (Tukey HSD):
├─ Easy vs Medium: Mdiff = 0.35, p = 0.08 (ns)
├─ Easy vs Hard: Mdiff = 0.68, p = 0.001 (sig)
└─ Medium vs Hard: Mdiff = 0.33, p = 0.12 (ns)

Interpretation:
- Easy questions significantly better than Hard
- Suggests: LLM struggles more with hard questions
```

#### **D. Kruskal-Wallis Test (Non-Parametric Alternative)**

```
WHEN: Use if normality assumption violated

EXAMPLE: Distractor Quality dimension (non-normal p = 0.01)

PROCEDURE:
1. Same as ANOVA, but uses ranks instead of raw scores
2. H-statistic distributed as chi-square
3. Interpretation similar to ANOVA

OUTPUT:
H(2) = 6.45, p = 0.040

POST-HOC: Mann-Whitney U pairwise tests (with Bonferroni correction)
```

#### **E. Repeated Measures ANOVA (Antar Dimensi)**

```
RESEARCH QUESTION: 
Do quality scores differ across the 4 evaluation dimensions?

SETUP:
- Within-subject factor: Dimension (Correctness, Relevance, Clarity, Distractor)
- Dependent: Quality scores (1-5)
- Subjects: 75 questions (each rated on 4 dimensions)

STRUCTURE:
```
Question  Correctness  Relevance  Clarity  Distractor
Q1        4            3          4        2
Q2        4            4          4        3
Q3        5            4          5        2
...
Q75       3            3          4        3

```

HYPOTHESIS:
- H0: Mean scores same across all 4 dimensions
- H1: At least one dimension differs

PROCEDURE:
1. Check sphericity assumption (Mauchly's test)
2. If violated: Use Greenhouse-Geisser correction
3. Compute F-statistic for within-subject effect
4. If p < 0.05: Significant difference

EXPECTED OUTPUT:
F(3, 222) = 8.42, p < 0.001 (with Greenhouse-Geisser correction)

INTERPRETATION:
- Significant difference: Some dimensions rated higher/lower
- Follow-up: Pairwise comparison identify which dimensions differ

POST-HOC: Bonferroni-corrected pairwise comparisons
├─ Correctness vs Relevance: p = 0.34 (ns)
├─ Correctness vs Clarity: p = 0.42 (ns)
├─ Correctness vs Distractor: p < 0.001 (sig) ✓
├─ Relevance vs Clarity: p = 0.67 (ns)
├─ Relevance vs Distractor: p = 0.003 (sig) ✓
└─ Clarity vs Distractor: p = 0.002 (sig) ✓

Conclusion:
Distractor Quality significantly lower than other dimensions.
```

### 5.3 Reliability Analysis

```
INTERNAL CONSISTENCY (Cronbach's Alpha):

QUESTION: Do 4 dimensions measure same construct (quality)?

FORMULA:
α = (k/(k-1)) × (1 - (∑σᵢ² / σ_total²))

Where:
- k = number of items/dimensions (4)
- σᵢ² = variance per dimension
- σ_total² = total variance

INTERPRETATION:
- α < 0.60: Poor internal consistency
- 0.60 ≤ α < 0.70: Acceptable
- 0.70 ≤ α < 0.80: Good
- α ≥ 0.80: Excellent

EXAMPLE CALCULATION:
σ² values: Correct=0.67, Relev=0.83, Clear=0.56, Distract=1.21
σ²_total = 3.27

α = (4/3) × (1 - 2.27/3.27)
α = 1.33 × 0.31
α = 0.41 (Poor)

INTERPRETATION:
- Low alpha suggests 4 dimensions not measuring single construct
- This is EXPECTED: each dimension measure different aspect
- Solution: Report alpha pero acknowledge dimensi are distinct

ALTERNATIVE: Report per-dimension reliability
- Rater consistency per dimension (already measured by Kappa)
```

### 5.4 Effect Size Reporting

```
WHY: Complement p-values dengan practical significance

COMMON EFFECT SIZE MEASURES:

1. For ANOVA: Eta-squared (η²)
   ├─ Small: 0.01
   ├─ Medium: 0.06
   └─ Large: 0.14

2. For T-test: Cohen's d
   ├─ Small: 0.2
   ├─ Medium: 0.5
   └─ Large: 0.8

3. For Correlation: r (Pearson correlation)
   ├─ Small: 0.1
   ├─ Medium: 0.3
   └─ Large: 0.5

EXAMPLE REPORTING:
"Difficulty level significantly affected quality, F(2,72)=5.34,
p=.007, η²=.129 (large effect), indicating that question difficulty
accounts for approximately 13% of quality variance."
```

---

## BAGIAN 6: ANALISIS KUALITATIF (Qualitative Analysis)

### 6.1 Thematic Analysis Procedure

```
STEP-BY-STEP:

Step 1: FAMILIARIZATION
├─ Read all 3 interviews completely (2-3 times)
├─ Listen to audio if possible
├─ Note initial impressions
└─ Take preliminary notes

Step 2: INITIAL CODING
├─ Read first transcript line-by-line
├─ Highlight meaningful phrases/ideas
├─ Assign codes (no limits initially)
├─ Example codes:
   - "mudah digunakan" → [usability-positive]
   - "perlu mengedit distractor" → [editing-effort]
   - "saya akan pakai" → [adoption-intention]

Step 3: CODE COMPILATION
├─ Extract all codes dari semua transcripts
├─ Create master code list
├─ Organize: Similar codes grouped together

Step 4: THEME IDENTIFICATION
├─ Review codes dan identify patterns
├─ Group codes into themes
├─ Themes harus "coherent" dan "meaningful"

Example:
Codes → Potential Themes:
[usability-positive], [interface-simple], [quick-to-learn]
→ THEME: "System is intuitive and easy to use"

[distractor-problem], [editing-needed], [quality-concern]
→ THEME: "Distractor quality needs improvement"

[adoption-intention], [feature-requests], [conditional-use]
→ THEME: "Adoption contingent on specific improvements"

Step 5: THEME REFINEMENT
├─ Define each theme precisely
├─ Ensure mutually exclusive (minimal overlap)
├─ Check codes consistent within theme
├─ Refine theme boundaries

Step 6: NARRATIVE DESCRIPTION
├─ For each theme, write description
├─ Include representative quotes
├─ Explain theme importance

Example Theme Write-up:

THEME 1: System Usability is Strong

Description: All three educators praised the ease of using 
the system. They found the interface intuitive and the 
workflow clear.

Supporting Quotes:
- Educator 1: "Sistem ini mudah digunakan, serius. Saya 
  cukup click beberapa dropdown dan soal langsung generated."
  
- Educator 2: "Prosesnya straightforward. Gampang dijelaskan 
  ke kolega saya juga."

Frequency: 3/3 educators mentioned (universal positive)

Implication: Usability not a barrier to adoption
```

### 6.2 Sentiment Analysis

```
CATEGORIZING FEEDBACK:

For each major point, classify sentiment:

Positive Sentiment:
"Sistem ini sangat membantu, bisa nghemat waktu berkali-kali lipat"
→ [sentiment-positive], [efficiency-positive]

Negative Sentiment:
"Distractor yang dihasilkan sering tidak masuk akal"
→ [sentiment-negative], [quality-concern]

Mixed/Neutral Sentiment:
"Hasilnya baik untuk topik tertentu, tapi untuk topic lain 
perlu adjustment"
→ [sentiment-mixed], [domain-dependent]

FREQUENCY COUNT:
Positive sentiments: 12 mentions
Negative sentiments: 8 mentions
Neutral/Mixed: 5 mentions

INTERPRETATION:
"Overall sentiment was positive (12/25 = 48%), indicating 
educators generally favor the system despite some concerns."
```

### 6.3 Content Analysis

```
DEEPER INVESTIGATION: What specific issues mentioned?

CODE FREQUENCY TABLE:

Code                          Frequency    %
[usability-positive]          6           24%
[efficiency-positive]         5           20%
[distractor-quality-problem]  7           28%
[editing-effort-estimate]     4           16%
[feature-requests]            2           8%
[adoption-concern]            2           8%
└─────────────────────────────────────────

INTERPRETATION:
- Top concern: Distractor quality (28% of all codes)
- Main benefit: Efficiency (20% positive mentions)
- Opportunity: Room untuk feature improvements (8%)

RANKING OF ISSUES:
1. [distractor-quality-problem] - Most critical
2. [editing-effort-estimate] - Secondary concern  
3. [feature-requests] - Enhancement opportunities
4. [adoption-concern] - Risk factor
```

---

## BAGIAN 7: INTEGRASI HASIL KUANTITATIF & KUALITATIF

### 7.1 Triangulation Strategy

```
MIXED-METHODS INTEGRATION:

Data Source 1: QUANTITATIVE (Rater Scores)
┌─────────────────────────────────────────┐
│ Distractor Quality Score: M = 2.8/5.0   │
│ (Below target 3.5, lowest of 4 dims)    │
└─────────────────────────────────────────┘
                    ↓ VALIDATES
Data Source 2: QUALITATIVE (Interview)
┌─────────────────────────────────────────┐
│ Educator 1: "perlu mengedit distractor  │
│ karena tidak plausible"                 │
│ (Frequency: 3/3 educators mention)      │
└─────────────────────────────────────────┘

TRIANGULATION RESULT:
┌─────────────────────────────────────────┐
│ CONVERGING EVIDENCE: Both quantitative  │
│ scores and qualitative feedback point   │
│ to same issue → Distractor quality is   │
│ main bottleneck                         │
│                                         │
│ IMPLICATION: Strong confidence that     │
│ this is real issue, not artifact of     │
│ measurement method                      │
└─────────────────────────────────────────┘

ALTERNATIVE: DIVERGING EVIDENCE:
If qualitative says "itu bagus", but quantitative scores low
→ Investigate why discrepancy
→ Possible explanations:
   - Raters not understanding rubric correctly
   - Scoring inconsistency
   - Qualitative feedback overly positive (social desirability)
```

### 7.2 Integration in Findings Report

```
COMBINED FINDING:

Quantitative Finding:
- Quality scores descriptive statistics
- Inter-rater reliability (Kappa = 0.75)
- Comparison across difficulty levels (ANOVA significant)
- Efficiency metrics (response time = 20 sec)

Qualitative Finding:
- Usability strongly praised
- Distractor quality main concern
- Adoption conditional on improvement
- Time savings estimated 50%+

INTEGRATED CONCLUSION:
"The system demonstrates good overall quality (M=3.4) with 
strong inter-rater agreement (Kappa=0.75, substantial). 
However, quantitative analysis reveals Distractor Quality 
as significantly lower than other dimensions (p<.001). 
This finding is corroborated by qualitative feedback where 
all 3 educators explicitly mentioned distractor plausibility 
as requiring manual editing. Despite this limitation, 
educators reported high usability satisfaction and 
estimated 50%+ time savings compared to manual creation. 
Recommendation: Focus future improvements on distractor 
generation algorithm."
```

---

## BAGIAN 8: VALIDITAS & RELIABILITAS KESELURUHAN

### 8.1 Internal Validity

```
THREATS TO INTERNAL VALIDITY:

Threat 1: SELECTION BIAS
├─ Issue: Only 3 educators, may not representative
├─ Impact: Findings may not generalize
├─ Mitigation: 
│  ├─ Select diverse domains (CS, Eng, Business)
│  ├─ Acknowledge limitation clearly
│  └─ Frame findings as "promising" not definitive

Threat 2: MATURATION/FATIGUE
├─ Issue: Educators may get tired during long evaluation
├─ Impact: Quality of scores might decline over time
├─ Mitigation:
│  ├─ Limit evaluation to 2 weeks
│  ├─ Provide breaks
│  ├─ Break questions into batches

Threat 3: INSTRUMENTATION
├─ Issue: Rubric interpretation may change during evaluation
├─ Impact: Inconsistent scoring over time
├─ Mitigation:
│  ├─ Detailed rater training
│  ├─ Written rubric with examples
│  ├─ Periodic calibration checks

Threat 4: DIFFUSION OF TREATMENT
├─ Issue: Raters may discuss scores with each other
├─ Impact: Rater scores become dependent (not independent)
├─ Mitigation:
│  ├─ Instruct raters to work independently
│  ├─ Use different batches for different raters
│  └─ No group discussion until after evaluation

Threat 5: RESEARCHER BIAS
├─ Issue: Researcher (you) wants positive results
├─ Impact: May unconsciously influence interpretation
├─ Mitigation:
│  ├─ Blind analysis (don't know which system score)
│  ├─ Have advisor review interpretation
│  └─ Report both positive and negative findings
```

### 8.2 Construct Validity

```
DOES MEASUREMENT MEASURE WHAT IT CLAIMS?

Question: Do 4-dimensional rubric adequately capture "MCQ quality"?

Validity Evidence:

1. CONTENT VALIDITY
├─ Based on literature (Tarrant et al., 2006)
├─ Aligned with Bloom's taxonomy
├─ Covers pedagogically important dimensions
├─ Expert review during rubric design
└─ Conclusion: ✓ Good content validity

2. CRITERION VALIDITY
├─ Can scores predict external criterion?
├─ Example criterion: Learner performance on exam
├─ Challenge: Cannot measure (beyond research scope)
├─ Note: Acknowledge as limitation

3. CONSTRUCT VALIDITY (Discriminant)
├─ Does rubric clearly measure quality (not other constructs)?
├─ Example confound: Rater leniency (some raters always score high)
├─ Control: Fleiss' Kappa helps control for this
└─ Partial evidence: Moderate internal consistency (α not too high)

4. CONVERGENT VALIDITY
├─ Quantitative and qualitative point to same issues
├─ Example: Low distractor scores + mention in interviews
└─ Conclusion: ✓ Good convergent validity
```

### 8.3 External Validity (Generalizability)

```
CAN FINDINGS GENERALIZE BEYOND THIS SAMPLE?

Population Validity:
├─ Sample: 3 educators in Indonesia
├─ Population: All educators using MCQ
├─ Gap: Large → limited generalizability to other countries/contexts
├─ Mitigation: Frame as "preliminary findings in Indonesian context"

Ecological Validity:
├─ Setting: Evaluation of generated MCQ (artificial task)
├─ Real setting: Educators using system in actual course
├─ Gap: Somewhat artificial
├─ Mitigation: Follow-up study dalam production setting

Domain Validity:
├─ Sample: 3 diverse domains (AI, DS, Web)
├─ Generalizability: Likely good for other CS domains
│                     Uncertain for non-CS
├─ Mitigation: Note findings apply to "STEM/CS context"

Temporal Validity:
├─ When: May 2026
├─ LLM capabilities: Rapidly evolving
├─ Limitation: Findings may become dated
├─ Mitigation: Document LLM version used (GPT-4o-mini v.X)
```

### 8.4 Statistical Conclusion Validity

```
ARE STATISTICAL CONCLUSIONS CORRECT?

Threat: TYPE I ERROR (false positive)
├─ Finding significant when actually no effect
├─ Probability: α = 0.05 (5% risk)
├─ Multiple comparisons: Risk increases if doing many tests
├─ Mitigation: 
│  ├─ Pre-specify comparisons (not exploratory)
│  ├─ Use Bonferroni correction for post-hoc tests
│  └─ Report adjusted p-values

Threat: TYPE II ERROR (false negative)
├─ Missing real effect (p > .05 when should be significant)
├─ Probability: β, related to sample size
├─ With small n (75 questions): Risk of Type II
├─ Mitigation:
│  ├─ Report effect sizes (not just p-values)
│  ├─ Acknowledge if finding not significant
│  └─ Note: May need larger sample for power

Reliability of Results:
├─ p-values: Only meaningful if
│  ├─ Assumptions checked (normality, homogeneity)
│  ├─ Statistical test appropriate for data type
│  └─ Not multiple testing without correction
└─ Recommendation: Report CI alongside p-values
   (more informative than p-value alone)

Example Good Reporting:
"Difficulty level significantly affected quality scores,
F(2,72)=5.34, p=.007, η²=.129. Easy questions (M=3.9, 
SD=0.65) were significantly higher quality than hard 
questions (M=3.2, SD=1.15), with 95% CI [0.34, 1.02], 
t(43)=2.68, p=.010, d=0.76 (large effect)."
```

---

## BAGIAN 9: ETHICAL CONSIDERATIONS

### 9.1 Informed Consent

```
WHAT: Educators & participants understand what they're participating in

HOW:
├─ Provide information sheet (sebelum participation)
├─ Explain:
│  ├─ Purpose of research
│  ├─ What participants will do
│  ├─ Time commitment
│  ├─ Risks & benefits
│  ├─ Data privacy & confidentiality
│  └─ Right to withdraw
├─ Obtain written consent
└─ Provide copy to participant

TIMING: Before training session, before any data collection
```

### 9.2 Privacy & Confidentiality

```
DATA HANDLING:

Identifiable Data:
├─ Interview transcripts (contain personal information)
├─ Contact information
└─ Initial assessment: SENSITIVE

Mitigation:
├─ De-identify: Remove names, replace with Educator_1, 2, 3
├─ Store securely: Encrypted drive / password protected
├─ Access: Only researcher + advisor
├─ Retention: Keep only as long as needed
└─ Disposal: Secure delete after study concludes

Generated MCQ:
├─ Anonymous (no personal data)
├─ Scores recorded by rater ID (not name)
└─ Can be shared more broadly

Course Content:
├─ Some content may be proprietary
├─ Mitigation: Paraphrase/anonymize course title
├─ Don't share specific course materials in publication
```

### 9.3 Potential Risks & Benefits

```
RISKS (Minimal):
├─ Time commitment: 10+ hours for each educator
├─ Psychological: Potential pressure to provide positive feedback
└─ Mitigation: 
   ├─ Voluntary, no coercion
   ├─ Reassure: Both positive & negative feedback valued
   └─ Compensation: Small honorarium if possible

BENEFITS:
├─ Direct: Educators get working tool to use
├─ Indirect: Contribute to knowledge about AI in education
├─ Institutional: Platform gets research validation
└─ Academic: Thesis contribution to your degree
```

---

## BAGIAN 10: TIMELINE & RESOURCE MANAGEMENT

### 10.1 Detailed Timeline

```
MINGGU 1-2: QUALITATIVE DATA COLLECTION
├─ Week 1: 
│  ├─ Identify & contact 3 educators
│  ├─ Schedule interviews
│  └─ Prepare interview guide
├─ Week 2:
│  ├─ Conduct 3 interviews (4 hours total)
│  ├─ Audio recording + transcription (8 hours)
│  └─ Initial coding (4 hours)

MINGGU 3-13: SYSTEM DESIGN & IMPLEMENTATION
(No data collection needed)

MINGGU 14: QUANTITATIVE DATA PREPARATION
├─ Generate 75 MCQ (system execution: 1 hour)
├─ Create evaluation forms (2 hours)
├─ Prepare training materials (3 hours)
├─ Recruit & schedule raters (3 hours)
└─ Conduct rater training (2 hours × 3 = 6 hours)

MINGGU 15: PRIMARY EVALUATION PERIOD
├─ Raters independently score (5-8 hours each rater)
├─ Collect completed forms (2 hours)
├─ Data entry & cleaning (4 hours)

MINGGU 16: POST-EVALUATION
├─ Conduct interviews with raters (1 hour each × 3 = 3 hours)
├─ Transcription & initial coding (4 hours)
└─ Data analysis (ongoing, 8+ hours)

MINGGU 17-20: ANALYSIS & REPORTING
├─ Statistical analysis (12 hours)
├─ Qualitative analysis (8 hours)
├─ Integration & interpretation (8 hours)
├─ Write paper (20 hours)
└─ Final review & submission (4 hours)
```

### 10.2 Resource Allocation

```
PERSONNEL TIME:
├─ Researcher (you): ~200 hours total
│  ├─ Data collection: 20 hours
│  ├─ System implementation: 80 hours  
│  ├─ Data analysis: 60 hours
│  └─ Writing & documentation: 40 hours
├─ Advisor: ~20 hours (guidance & review)
└─ Expert Raters: ~30 hours (training + evaluation)

TECHNICAL RESOURCES:
├─ LLM API: $50-100 (OpenAI/Gemini usage)
├─ Hosting: $0 (free tier)
├─ Software: $0 (open source)
└─ Total: ~$50-100

LOCATION:
├─ Interviews: Campus or zoom (flexible)
├─ Evaluation: Remote (raters work from home)
└─ Analysis: Your workspace/office
```

---

## BAGIAN 11: LIMITATIONS & CONSIDERATIONS

### 11.1 Acknowledged Limitations

```
SAMPLING LIMITATIONS:

1. Small Rater Sample (n=3)
├─ Benefit: Manageable, in-depth
├─ Limitation: May not represent all educators
├─ Impact: Low statistical power
├─ Mitigation: Report effect sizes, not just p-values

2. Convenience Sampling
├─ Educators chosen because accessible
├─ May not representative
├─ Might introduce bias (e.g., early adopters)

3. Single Context
├─ One institution/country (Indonesia)
├─ Findings may not generalize internationally

METHODOLOGICAL LIMITATIONS:

4. Rubric Subjectivity
├─ Although structured, still subjective interpretation
├─ Different raters may emphasize differently
├─ Partially addressed by training & Kappa reliability

5. Hawthorne Effect
├─ Educators knowing they're studied may behave differently
├─ Unlikely major issue here (evaluating artifacts not behavior)

6. Selection of 75 MCQ
├─ Sample size sufficient but not large
├─ Remaining uncertainty about consistency

RESEARCH DESIGN LIMITATIONS:

7. No Baseline Comparison
├─ Not comparing to manual-written MCQ
├─ (Would be labor-intensive and outside DSR scope)
├─ Addressed by referencing Biancini et al.

8. Temporal Limitation
├─ One point-in-time measurement
├─ No follow-up evaluation (e.g., 3 months later)
└─ Longitudinal study would strengthen findings
```

### 11.2 Mitigation Strategies

```
PROACTIVE STRATEGIES:

1. Transparency
├─ Clearly state limitations in paper
├─ Don't overstate findings
└─ Honest about scope

2. Acknowledge Trade-offs
├─ DSR by nature involves trade-offs
├─ Small n for depth, large n for breadth
├─ Choose depth given time constraint

3. Frame Appropriately
├─ Not "definitive proof"
├─ But "promising evidence" or "proof of concept"
├─ Encourage future research to extend findings

4. Documentation
├─ Keep audit trail (decisions, changes)
├─ Document assumptions & choices
└─ Enable future researchers to build on work
```

---

## SUMMARY: COMPLETE METHODOLOGY OVERVIEW

```
RESEARCH ARCHITECTURE:

PHILOSOPHY: Pragmatism
                ↓
RESEARCH TYPE: Design Science Research
                ↓
DESIGN: Mixed-Methods Sequential (QUAL → QUAN → QUAL)
                ↓
PHASES:
├─ Phase 1 (Qual): Requirement gathering (interviews)
├─ Phase 2 (Engineering): System design & implementation
├─ Phase 3 (Mixed): Evaluation (scores + interviews)
└─ Phase 4 (Analysis): Data analysis & synthesis
                ↓
SAMPLING:
├─ Educators: Purposive (n=3)
├─ MCQ: Stratified purposive (n=75 from 3 courses)
└─ Raters: Expert sampling (n=3)
                ↓
DATA COLLECTION:
├─ Qualitative: Interview transcripts
├─ Quantitative: Rubric scores (4 dimensions, 1-5 scale)
└─ Efficiency: Performance metrics
                ↓
DATA ANALYSIS:
├─ Quantitative: Descriptive stats, ANOVA, Kappa reliability
├─ Qualitative: Thematic analysis, sentiment analysis
├─ Integration: Triangulation, convergence check
└─ Validity: Internal, construct, external, statistical
                ↓
QUALITY ASSURANCE:
├─ Rater training & consistency checks
├─ Data cleaning & validation
├─ Ethical approval & informed consent
└─ Transparent documentation
                ↓
OUTPUT:
├─ Thesis paper (research findings)
├─ Technical guide (implementation)
├─ Working system (artifact)
└─ Contribution to knowledge base
```

---

**END OF COMPREHENSIVE METHODOLOGY DOCUMENTATION**

Dokumen ini sangat lengkap dan dapat menjadi referensi diskusi detail dengan dosen! 📚

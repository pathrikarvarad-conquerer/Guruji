# Guruji AI — Personalized AI Tutor for Children (Ages 4–12)

**Guruji AI** is an AI-powered personalized educational platform designed for children aged 4–12. It moves far beyond generic conversational chatbots by operating a structured, measurable pedagogical learning loop:

$$\text{Assess} \longrightarrow \text{Diagnose} \longrightarrow \text{Teach} \longrightarrow \text{Practise} \longrightarrow \text{Reassess} \longrightarrow \text{Schedule Revision}$$

---

## 1. Core Subsystems Implemented

### A. Child Learning Experience
- **Interactive Visual Models:**
  - **Base-10 Tens & Ones Workshop:** Manipulate 10-cube rods (दशक) and single unit cubes (एकक) with instant place-value calculation.
  - **Interactive Ten-Frames:** Visual 2×5 counters demonstrating the "Make 10" addition strategy with overflow into a second frame.
  - **Dynamic Number Line Jump:** Backward hops for subtraction and forward hops for addition with animated arc trajectories and landing markers.
  - **Tactile Counting Garden:** 1-to-1 correspondence counting with auditory click chimes and counter tags.
  - **2D Geometry Explorer:** Interactive identification of triangles, squares, circles, and rectangles highlighting straight sides and sharp corner vertices.
- **Structured Lesson Player:**
  - 4-stage progressive flow: Simple explanation $\to$ Worked example with step-by-step progressive reveal $\to$ Comprehension check $\to$ Guided practice.
  - Audio narration (Text-to-Speech) with playback, pause, and speed adjustment (0.8x, 1.0x, 1.2x).
  - Celebration milestones with confetti particles on verified skill mastery.
- **Discovery Diagnostic:** Low-pressure, non-punitive assessment sampling prerequisite skills to produce an initial skill profile.
- **Daily Math Quests:** Personalized daily mission combining 1 new micro-lesson, 3 guided practice challenges, and 1 spaced review.

### B. Intelligent AI Tutor & Deterministic Grading Engine
- **Deterministic Math Grading:** Strict calculation functions evaluate answers for mathematical truth without relying on LLM arithmetic hallucinations.
- **Misconception Detection Taxonomy:**
  - `tens_ones_reversed`: Detecting reversed place-value digits (e.g. 34 instead of 43).
  - `counted_rods_as_single_units`: Treating a ten-rod as 1 instead of 10.
  - `hopped_forward_instead_of_backward`: Adding instead of subtracting on number lines.
  - `forgot_to_add_carried_ten`: Adding unit digits without carrying the ten into the tens column.
  - `wrote_both_digits_in_ones_column`: Placing 2-digit numbers into a single column.
- **Server-Side Gemini Integration (`@google/genai`):**
  - Uses `gemini-3.8-flash` on the Express backend (`server/ai.ts`) with telemetry headers and validated JSON schemas.
  - Generates age-adapted analogies (using familiar items like crayons, mangoes, or toy blocks) and 3-tiered hints (Nudge $\to$ Guided step $\to$ Visual clue).
  - High-fidelity educational fallbacks prevent interruption if external API quotas are constrained.

### C. Parent Trust Dashboard & Resource Centre
- **Genuine Measured Analytics:**
  - Real study duration, session count, and independent vs. hint-assisted answer counts.
  - Skill status ledgers: `learning`, `practising`, `provisional_mastery`, `retained`.
  - Observed misconceptions log with constructive, low-pressure home-support tips.
  - Spaced revision schedules with automated review intervals (Day 1, Day 3, Day 7).
  - Practical offline home-learning activities (e.g., grouping matchsticks with rubber bands, floor tape number hops).
- **Parent Resource Centre:**
  - Secure upload of school textbook excerpts, worksheets, and syllabus notes.
  - Automated topic extraction and curriculum skill mapping with confidence scores.
  - Vetted, ad-free educational video catalogue (Numberblocks, Khan Academy Kids, Math Antics).
- **Privacy & Safety Controls:**
  - Child profile CRUD, avatar selector, accessibility configurations.
  - Complete account wipe and cascading deletion of all child profiles and learning logs.

---

## 2. Repository Structure

```text
├── server.ts                   # Express entry point mounting /api and Vite middlewares
├── server/
│   ├── ai.ts                   # Server-side Gemini integration and educational fallbacks
│   ├── curriculumData.ts       # Structured math curriculum, lessons, question bank, videos
│   ├── db.ts                   # ACID-safe file database with seed data and cascade delete
│   ├── grading.ts              # Deterministic grading & misconception taxonomy
│   ├── planner.ts              # Adaptive learning planner & state transition state machine
│   └── routes.ts               # Express REST API routes (/api/auth, /api/children, etc.)
├── src/
│   ├── App.tsx                 # Root application controller and view routing
│   ├── main.tsx                # Client entry point
│   ├── index.css               # Tailwind CSS v4 styling & educational typography
│   ├── types/                  # TypeScript interface definitions
│   ├── utils/audio.ts          # Web Speech synthesis & Web Audio chimes manager
│   └── components/
│       ├── Navbar.tsx          # 3-Zone Top Bar contract header
│       ├── LandingPage.tsx     # Educational landing page explaining the 6-stage loop
│       ├── AudioNarration.tsx  # TTS narration bar with speed controls
│       ├── child/
│       │   ├── ChildDashboard.tsx       # Daily quest, adventure map, progress cards
│       │   ├── LessonPlayer.tsx         # 4-stage lesson engine with tiered hints
│       │   └── DiagnosticAssessment.tsx # Low-pressure discovery assessment
│       ├── parent/
│       │   ├── ParentDashboard.tsx      # Real measured analytics & misconception logs
│       │   ├── ParentResourceCentre.tsx # Document upload, syllabus mapping, videos
│       │   └── ParentSettings.tsx       # Profile CRUD, accessibility & account wipe
│       └── visuals/
│           ├── TensOnesBlocks.tsx       # Base-10 rods and unit cubes visualizer
│           ├── TenFrame.tsx             # Visual ten-frames for addition to 10
│           ├── NumberLine.tsx           # Dynamic SVG number line with hop arcs
│           ├── CountingBeads.tsx        # Tactile 1-to-1 counting garden
│           └── ShapesVisualizer.tsx     # 2D geometry vertices & side explorer
├── tests/
│   └── learning.test.ts        # Automated tests for grading, transitions, & cascade deletion
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 3. Setup and Run Instructions

### Prerequisites
- Node.js $\ge$ 18.0.0
- npm $\ge$ 9.0.0

### Installation
```bash
# Install dependencies
npm install
```

### Running Locally
```bash
# Starts the full-stack server on http://localhost:3000
npm run dev
```

### Running Automated Tests
```bash
# Runs the deterministic grading and state transition tests
npm test
```

---

## 4. Environment Variables

Create a `.env` file (copied from `.env.example`):

```bash
# GEMINI_API_KEY: Configures server-side AI explanations and document syllabus mapping
GEMINI_API_KEY="your-gemini-api-key"

# APP_URL: Base applet URL
APP_URL="http://localhost:3000"

# DATA_DIR: Local directory for database persistence and document records
DATA_DIR="./data"
```

*Note: If `GEMINI_API_KEY` is not provided, the platform automatically utilizes its built-in educational fallback layer so that child learning remains uninterrupted.*

---

## 5. Automated Test Results

All 7 core test cases pass:
1. `normalizeMarathiDigits converts Devanagari numerals to ASCII digits`
2. `Deterministic grading marks independent correct answer with full score`
3. `Deterministic grading identifies reversed digits misconception`
4. `Deterministic grading recognizes Marathi input correctly`
5. `Hint-assisted answer does not count as independent mastery`
6. `Adaptive learning planner promotes to provisional mastery after 3 consecutive independent successes`
7. `Child deletion cascades and cleans all child-specific data`

---

## 6. Completed vs. Future Features

| Feature | Status | Implementation Details |
|---|---|---|
| **Deterministic Math Grading** | **Completed** | Full validation against arithmetic keys with digit normalization |
| **Misconception Detection** | **Completed** | Specific taxonomy for place-value, regrouping, & hop direction |
| **Adaptive Learning Loop** | **Completed** | 6-stage engine with spaced revision scheduling (1d, 3d, 7d) |
| **Interactive Visual Models** | **Completed** | Base-10 rods, Ten-Frames, Number Lines, Counting Beads, Shapes |
| **Bilingual Support** | **Completed** | English and Marathi (मराठी) across lessons, questions, and UI |
| **Parent Insights & Reports** | **Completed** | Genuine database metrics, misconception logs, offline home tips |
| **School Resource Mapping** | **Completed** | Notes/worksheet text processing and syllabus skill alignment |
| **Vetted Educational Videos** | **Completed** | Curated Numberblocks, Khan Academy Kids, and Math Antics embed |
| **Parent & Child Isolation** | **Completed** | Authorization checks and cascading profile & data deletion |
| **Speech Pronunciation Scorer** | *Future* | Planned for reading fluency assessment when speech models mature |
| **School/Teacher Classrooms** | *Future* | Prepared architecture for multi-tenant school dashboards |

---

## 7. Recommended Next Development Steps
1. Expand the curriculum library with multiplication arrays and fraction division for ages 9–12.
2. Integrate native voice recognition input for children who prefer speaking their answers.
3. Add PDF file upload binary extraction using `pdf-parse` on the backend.

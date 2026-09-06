# SWE Interview Prep

[Browse the public curriculum](https://learn.significanthobbies.com/curriculum/)
— 18 tracks, 222 concepts, and 24 sequenced roadmaps without requiring
JavaScript or sign-in.

**Product:** [learn.significanthobbies.com](https://learn.significanthobbies.com)


A comprehensive interview preparation platform for mastering DSA, Low-Level Design, System Design, and Behavioral interviews.

## Problem

Technical interview preparation is fragmented across multiple tools: LeetCode for coding, Excalidraw for diagrams, ChatGPT for hints, and Anki for spaced repetition. Switching between tools breaks flow and makes it hard to track progress holistically.

SWE Interview Prep consolidates everything into a single platform with integrated code execution, diagram drawing, AI assistance, and spaced repetition review.

## Deployment & External Services

| Concern | Service |
|---------|---------|
| Hosting | Cloudflare Pages (`swe-interview-prep`) + Pages Functions backend (`functions/api/[[path]].js`) |
| Database | Cloudflare D1 |
| Auth | Google One Tap (JWT cookie) |
| File storage | Cloudflare R2 (`swe-interview-prep-assets`) — hosts the Go WASM interpreter |
| Analytics | PostHog (via `local posthog-js wrapper`) |
| AI | Vercel AI SDK via `@ai-sdk/openai-compatible` against a BYO OpenAI-compatible endpoint (per-request `aiConfig` or `AI_*` env). Dev bridge streams local claude/codex/gemini CLIs. |
| CI/CD | GitHub Actions — `ci.yml` on push/PR; `deploy.yml` is manual (`workflow_dispatch`) |

## Features

- **Interactive Code Editor** - Write and run TypeScript (transpiled and executed in-browser via sucrase) or Go (client-side WASM interpreter, with an `/api/go-run` → go.dev fallback) in Monaco Editor (VS Code engine)
- **Visual Design Tool** - Draw system architecture diagrams with Excalidraw integration
- **BYO-Endpoint AI Hints** - Get Socratic guidance without spoilers through any OpenAI-compatible endpoint (dev: local claude/codex/gemini CLIs)
- **Spaced Repetition System** - Concept mastery via FSRS (`ts-fsrs`); Anki decks can be imported
- **LeetCode Import** - Fetch problems directly via LeetCode API
- **Progress Tracking** - Monitor mastery across 18 learning tracks spanning interview fundamentals, systems, AI-native engineering, developer tools, applications, and multimodal computing
- **Pattern-Based Learning** - Group problems by algorithmic patterns (sliding window, two pointers, etc.)

## Architecture

```mermaid
graph TB
    subgraph "Frontend - React 19 + Vite"
        A[React Router] --> B[Pages]
        B --> C[Dashboard]
        B --> D[ProblemView]
        B --> E[AnkiReview]
        B --> F[ImportProblem]

        D --> G[Monaco Editor]
        D --> H[Excalidraw]
        D --> I[AI Chat]

        J[Hooks Layer] --> K[useAI]
        J --> L[useCodeExecution]
        J --> M[useConcepts / FSRS]
        J --> N[useProgress]

        O[Contexts] --> P[AuthContext]
        O --> Q[CategoryContext]
    end

    subgraph "Dev AI bridge - in-process (Vite plugin)"
        R[/api/chat] --> S[claude CLI]
        R --> T[codex CLI]
        R --> U[gemini CLI]
    end

    subgraph "Cloudflare Pages Functions + D1"
        V[Cloudflare D1] --> W[user_imported_problems]
        V --> X[user_progress]
        V --> Y[user_learning_notes]
        V --> Z[concept_mastery FSRS]
        AA[Google One Tap] --> AB[JWT Cookie]
    end

    subgraph "External APIs"
        AC[LeetCode API] --> AD[Problem Import]
        AE[OpenAI API]
        AF[Anthropic API]
        AG[Google Gemini API]
    end

    K --> R
    K --> AE
    K --> AF
    K --> AG

    L --> V
    M --> V
    N --> V
    P --> AA

    F --> AC

    style R fill:#f9f,stroke:#333,stroke-width:2px
    style V fill:#bbf,stroke:#333,stroke-width:2px
    style G fill:#bfb,stroke:#333,stroke-width:2px
    style H fill:#bfb,stroke:#333,stroke-width:2px
```

**Key Components:**

- **Frontend**: React 19 SPA with TailwindCSS, Monaco Editor for code, Excalidraw for diagrams
- **Dev AI bridge**: in-process Vite plugin (`vite-plugin-local-ai.js`) streams the claude/codex/gemini CLIs at `/api/chat` so local dev needs no API keys; ships nothing to prod
- **Backend**: The production Cloudflare Pages Function (`functions/api/[[path]].js`) serves auth, `/api/progress`, the consolidated `/api/learning?action=…` surface, the Reader adapter, and the `/api/ai` catalog. AI generation uses an OpenAI-compatible endpoint; `/api/chat` and `/api/go-run` are dev/legacy handlers not deployed by the Pages Function
- **Database**: Cloudflare D1 stores user progress, notes, FSRS concept mastery (`concept_mastery`), and imported problems through the Pages `DB` binding
- **Auth**: Google One Tap posts credentials to `/api/auth/google`; the server issues an httpOnly JWT cookie
- **External Integrations**: LeetCode API for problem import, multiple AI providers for hints

## Run Steps

### Prerequisites

- Node.js: `.nvmrc` pins `20.18.0`; CI/deploy run on Node 22 (either works, 20.18.0 is the floor)
- pnpm
- Cloudflare account for production deploys
- Cloudflare D1 database for production runtime data

### Setup

1. **Clone and install**
   ```bash
   git clone https://github.com/Significant-Hobbies/swe-interview-prep.git
   cd swe-interview-prep
   pnpm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env.local
   ```

   Required build-time value:
   ```bash
   VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
   ```

   Required runtime values for Cloudflare Pages Functions:
   ```bash
   GOOGLE_CLIENT_ID=your_google_oauth_client_id
   JWT_SECRET=your_jwt_secret
   ```

   D1 is a Pages binding, not an environment secret. For an isolated local
   database, run `pnpm db:migrate:local` and `pnpm dev:pages`.

   Optional AI/provider values can be supplied through the UI per request or via server env fallbacks such as `AI_ENDPOINT_URL`, `AI_API_KEY`, and `AI_MODEL`.

3. **Validate local env**
   ```bash
   pnpm validate:env:build
   pnpm validate:env:runtime
   ```

4. **Start development server**
   ```bash
   pnpm dev
   ```

   Opens at `http://localhost:5173`. The dev AI bridge runs in-process (no separate server); `/api/chat` streams your logged-in claude/codex/gemini CLIs.

### Production Build

```bash
pnpm build
pnpm preview
```

Production deploys through Cloudflare Pages:

```bash
pnpm deploy
```

The deploy path validates env, builds `dist/`, and runs `wrangler pages deploy dist/ --project-name=swe-interview-prep`. Deploys are manual: the `deploy.yml` GitHub Action is `workflow_dispatch`-only (no push-to-`main` auto-deploy). `pnpm ready` / `validate:env:deploy` gate the deploy on env + tests + build.

---

**Tech Stack**: React 19, TypeScript, TailwindCSS, Vite, Cloudflare Pages Functions, Cloudflare D1
**License**: MIT

<!-- ACTIVE-AI-TASK-LOG:START -->
## Active AI Task Log

This historical task ledger is retained for context; current work lives in this repository's GitHub Issues and reusable automation lives in Workflows and Skills.

- Business lane: P0 Can make money
- Rule: do not create another broad "improve the UI" task unless the acceptance criteria differ materially from the tasks listed here.
- Source of truth for current work: this repository's GitHub Issues; `PROJECT_STATUS.md` records durable shipped truth.

| Task | Status | Priority | Last known note |
| --- | --- | --- | --- |
| `f6544982` swe-interview-prep: show interview outcome proof in hero | done | medium | 2026-05-27 — updated hero to focus on interview prep, added compact mock interview result |
| `5261150e` swe-interview-prep: make value + proof obvious above the fold | done | high | 2026-05-25 18:52:42 |
| `6b17627a` [fleet-smoke] swe-interview-prep/web analytics endpoint 404 | done | medium | 2026-05-25 17:25:17 |
| `bc1219df` swe-interview-prep: add one-click mock interview proof | done | high | 2026-05-26 — added sample question + feedback preview cards + primary "Start a mock interview" CTA to Login page |
| `6bf51c84` swe-interview-prep: add post-answer feedback sample | done | high | 2026-05-26 — added SampleFeedbackPanel on Mock setup screen (example prompt + answer + 4 rubric score bars + missed patterns); renamed CTA to "Start practice" |
| `d585ad1e` swe-interview-prep: add interview readiness score explainer | done | high | 2026-05-26 — added ScoreExplainerPanel showing per-dimension raises/lowers tips (Clarity, Correctness, Tradeoffs, Communication); shown on setup screen and results screen |
| `97949bda` swe-interview-prep: add weak-topic next-step card | done | medium | 2026-05-26 — added NextStepCard component; shown statically (Tradeoffs/68) in SampleFeedbackPanel and dynamically (lowest-avg dimension) in completed session view; directs user to Practice → Drills |
| `f66caa8c` swe-interview-prep: add role-specific practice picker proof | done | medium | 2026-05-26 — added Login role picker (Frontend / Backend / System design tabs) on landing; each tab swaps a sample question card (prompt + kind + tags); defaults to Backend, no auth required |
| `10c4e62c` swe-interview-prep: add paid mock-interview outcome preview | done | high | 2026-05-26 — added PaidMockPackPreview component on Mock setup screen: hiring signal verdict (Strong Yes / L4–L5), overall readiness score bar, blurred written analysis teaser, pattern gaps list, personalized drill roadmap preview; one full-width CTA button ("Get my mock pack") with click-to-confirm state; no backend/auth/data changes |
<!-- ACTIVE-AI-TASK-LOG:END -->

## External learning resources

- [raw-bits-to-react](https://github.com/renderffx/raw-bits-to-react) — CPU → cache → TCP → browser engine → JS VM → Fiber React → 60 fps. A deep-dive into React internals from the hardware up.

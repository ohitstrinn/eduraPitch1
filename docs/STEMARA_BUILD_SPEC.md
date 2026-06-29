# Stemara — Full Implementation Spec

> Build directive for Claude Code. The route map in `src/App.jsx` is the source of truth.
> This document deepens each route into an implementation-ready spec. It does not redraw the routes.

**Existing routes (do not change without reason):**

| Route | Screen | Access |
|---|---|---|
| `/` | Landing | Public |
| `/login` | Student + Founder login | Public |
| `/signup` | Student signup | Public |
| `/dashboard` | Student dashboard | Student |
| `/syllabus` | Syllabus upload | Student |
| `/study` | AI Study Hub | Student |
| `/chat` | AI Chat | Student |
| `/directory` | School directory | Student |
| `/pitch` | Pitch deck mode | Public |
| `/demo` | Demo mode | Public |
| `/founder/dashboard` | Founder dashboard | Founder |

---

## A. Product Brief

### A.1 What Stemara is
Stemara is an AI-powered, **school-specific** study companion for New Hampshire college students. It parses a student's syllabus, builds an adaptive study plan, and provides a school-aware AI tutor — all themed and positioned for the exact institution the student attends. Stemara launches across four NH schools (UNH, SNHU, MCC, NCC), each with its own color theme, value proposition, messaging angle, and pitch deck.

### A.2 Vision (one paragraph)
Most edtech tools are one-size-fits-all: the same generic study app whether you're a research-track junior at a flagship university or a working parent earning credits at a community college. Stemara's bet is that **personalization starts at the institution level**. A UNH research student and an MCC first-generation student have fundamentally different needs, schedules, budgets, and goals — so Stemara gives each school its own version of the product, its own voice, and its own pitch. The same engine (syllabus parsing + adaptive planning + AI tutoring) is wrapped in a school-specific experience, proving to colleges that Stemara understands *their* students, not just students in general.

### A.3 Who it's for
- **Primary user:** enrolled students at UNH, SNHU, MCC, NCC.
- **Secondary user (buyer/champion):** college administrators, department heads, student-success offices.
- **Internal user:** the founder, who needs to see signups and testing interest to drive outreach.

### A.4 Core product loop
Select school → test before signup → sign up → upload syllabus → get a study plan → study with AI chat → earn points → return.

### A.5 Quality bar
Premium, marketable, demo-ready. Every screen has a goal, a value statement, a CTA, and at least one "wow" moment (animation, live interaction, or school-specific reveal).

---

## B. School Personalization Strategy

### B.1 Principle
Personalization is layered top-down:
1. **Institution layer** — theme, voice, positioning, pitch angle (this is the differentiator).
2. **Program layer** — major/track shapes study recommendations.
3. **Course layer** — parsed syllabus drives the concrete plan.
4. **Session layer** — chat adapts to the active course.

The institution layer is the one that must feel unmistakably distinct in a demo.

### B.2 The four modes

| | UNH | SNHU | MCC | NCC |
|---|---|---|---|---|
| **Type** | Research university | Online-first university | Community college | Community college |
| **Color** | Navy `#1b3a6b` + gold | Orange `#e8530a` + navy | Green `#006633` | Purple `#5e35b1` + yellow |
| **Modality** | In-person + hybrid | Online-first + campus | In-person + hybrid | In-person + hybrid |
| **Angle** | Research-first companion | Async learner's companion | Equity-first support | Local-first career launcher |
| **Emotional tone** | Prestige, rigor, tradition | Flexibility, scale, freedom | Access, dignity, transformation | Practicality, community, outcomes |
| **Hero promise** | "Master complex research tracks" | "Learn on your schedule, anywhere" | "Real support, free for every student" | "Connect your classes to NH jobs" |

### B.3 The MCC vs SNHU distinction (required)
MCC and SNHU **share** access/value language (affordability, flexibility, serving non-traditional students). They must still **diverge** on:
- **School type:** SNHU is a degree-granting university with national scale (170K+); MCC is a local 2-year community college (~5K).
- **Modality:** SNHU is online-first; MCC is in-person/hybrid local.
- **Positioning:** SNHU's pitch is *scale* ("10% adoption = 17,000 students"); MCC's pitch is *equity* ("free for every student, pilot-first").
- **Pitch buyer:** SNHU sells to a large online-program org; MCC sells to a local student-success office.

This distinction is the centerpiece of the pitch-deck story — it proves Stemara isn't lazily reusing one deck.

### B.4 How modes are applied technically
- A single `SchoolContext` holds the active school object from `src/data/schools.js`.
- All theming reads `school.colors.*` inline (no Tailwind recompile needed for dynamic colors).
- Copy strings (`tagline`, `pitch`, `valueProps`, `pitchAngle`, `pitchPoints`) live in the school object so adding a 5th school = one data entry, zero component changes.
- Persistence via `localStorage('stemara_school')`.

---

## C. Screen-by-Screen Implementation Spec

> Format per screen: **Purpose · User value · Layout · Components · Data · Actions/State · School variations · Polish · Mock vs live.**

### C.1 Landing — `/` (`src/pages/Landing.jsx`)
- **Purpose:** convert a cold visitor into a tester or signup; communicate the multi-school differentiator instantly.
- **User value:** "There's a version of this built for *my* school."
- **Layout:** sticky top nav (logo, Demo, Pitch deck, Sign in) → hero (badge, headline, subhead, dual CTA) → stats strip → school selector grid (2×2) → feature trio → full-width footer CTA band.
- **Components:** `PreSignupModal` (overlay), school cards, animated stats, `framer-motion` hero entrance.
- **Data:** `SCHOOL_LIST` from `schools.js`. No auth required.
- **Actions/State:** `hoveredSchool` (live theme preview on hover), `school` (selected, persisted), `showModal`. Hovering a school recolors the entire hero in real time — primary wow factor.
- **School variations:** hero headline, subhead, and accent color all swap to the hovered/selected school. Each school card shows its emoji, type chip, tagline, pitch angle, and top 2 value props.
- **Polish:** 500ms color transition on background; hover lift + shadow on cards; pulsing "live" badge; selected-school inline CTA pair.
- **Mock vs live:** fully live UI; CTAs route to real `/login` `/signup`; modal writes to localStorage now (Supabase/Formspree later).

### C.2 Pre-signup Modal (`src/components/PreSignupModal.jsx`)
- **Purpose:** capture testing interest **before** any account exists — the core behavioral requirement.
- **User value:** "I can express interest in 30 seconds, no password, no commitment."
- **Layout:** centered modal, 4-step wizard with a 4-segment progress bar. Step 1 school grid → Step 2 major list → Step 3 interest level → Step 4 name + email → success state.
- **Components:** `ModalWrapper` (backdrop blur + click-out), `StepPanel` (slide transitions), progress segments.
- **Data in:** `SCHOOL_LIST`, `MAJORS`, `INTEREST_LEVELS`. **Data out:** `{ id, school, major, interestLevel, name, email, submittedAt, tag:'testing-interest' }`.
- **Actions/State:** `step`, `formData`, `submitted`. `canAdvance()` gates each step. Submit appends to `localStorage('stemara_interests')` and calls `onSubmit`.
- **School variations:** modal accent color follows the selected school from step 1 onward (progress bar, buttons, selected states).
- **Polish:** per-step slide animation, confetti-style success screen, school-colored CTA.
- **Mock vs live:** writes localStorage now. Live path: POST to Formspree **and** insert into Supabase `testing_interest`, then fire Slack webhook.

### C.3 Student Login — `/login` (`src/pages/StudentLogin.jsx`)
- **Purpose:** authenticate returning students; provide a founder entry point.
- **User value:** fast re-entry into the student's school-themed experience.
- **Layout:** split screen. Left brand panel (school context card if a school is selected). Right: tabbed form (Student | Founder), inline school picker if none selected.
- **Components:** tab switcher, school quick-pick grid, form, demo-credential hint card.
- **Data:** writes session via `AuthContext.login(userData, type)`.
- **Actions/State:** `tab`, `email`, `password`, `error`, `loading`. Student login is permissive for demo (any `email@x` + 4+ char password). Founder requires exact creds.
- **School variations:** left panel and primary button colored by selected school; brand card shows the school name + tagline.
- **Polish:** loading state on submit, error chip, demo hint cards so a presenter never fumbles credentials.
- **Mock vs live:** mock credential check now. Live: `supabase.auth.signInWithPassword`; founder gated by a Supabase role claim, not a hardcoded string.

### C.4 Signup — `/signup` (`src/pages/Signup.jsx`)
- **Purpose:** create a student account with enough data to personalize immediately.
- **User value:** "By the time I land in the app, it already knows my school and major."
- **Layout:** split screen, 3-step wizard. Step 1 school → Step 2 account (name/email/password) → Step 3 major.
- **Components:** progress bar, school grid, account form, major list.
- **Data out:** `{ name, email, school, major, points:0, plan:'free', joinedAt }` → `localStorage('stemara_signups')` + `AuthContext.login`.
- **Actions/State:** `step`, `form`, `canNext()` validation per step, `loading`.
- **School variations:** left-panel copy changes per step; all accents follow chosen school; email placeholder uses `school.website`.
- **Polish:** animated progress, validation gating, school-colored selected states.
- **Mock vs live:** localStorage now. Live: Supabase `auth.signUp` + `profiles` row insert + Slack "new signup" ping.

### C.5 Student Dashboard — `/dashboard` (`src/pages/StudentDashboard.jsx`)
- **Purpose:** the home base; surface recent course, plan, study tools, chat, and points. **Matches the Edura mockup layout.**
- **User value:** one glance shows what to do next.
- **Layout (mobile-first, max-w-md):** header (avatar, logo, profile) → welcome line → **credits/points gradient bar** with "Earn More" → **2×2 card grid**: (Recent course + Continue/Upload) · (Plan/subscription) · (AI Study Hub 3-tool launcher) · (Campus Chat preview w/ on-off toggle) → recent AI tutor strip → **fixed inline chat input** → **fixed bottom nav** (School · Syllabus · Home(center) · AI Tools · Profile).
- **Components:** gradient points bar, course card, plan card, study-hub mini-grid, chat preview card, bottom nav with raised center button.
- **Data:** `user` (name, points, plan), `school.sampleCourses[0]` as the "recent" course.
- **Actions/State:** `chatMsg` (Enter routes to `/chat`); nav links to all student routes; logout from avatar.
- **School variations:** points bar gradient = `primary → dark`; "Earn More" uses `colors.accent`; all card accents and the recent-course label use school theme; chat preview greets with school short name.
- **Polish:** staggered card entrance (`framer-motion` delays), gradient points bar, raised center nav button, floating chat bar.
- **Mock vs live:** points and plan are mock; layout/nav fully live. Live: points + recent course from Supabase.

### C.6 Syllabus Upload — `/syllabus` (`src/pages/SyllabusUpload.jsx`)
- **Purpose:** the signature feature — turn a syllabus into a structured plan.
- **User value:** "I drop a PDF and get my whole semester organized."
- **Layout:** three states. **Upload:** dashed drag/drop zone + browse button + school-specific tips card. **Parsing:** animated progress bar + rotating status messages. **Done:** success banner → course info → deadline list → AI recommendations → CTA pair (Build study plan / Upload another).
- **Components:** drop zone (drag state), progress bar, parsed-result cards.
- **Data out (parsed shape):** `{ courseName, courseCode, professor, creditHours, semester, deadlines[], weeklyTopics[], studyRecommendations[] }`.
- **Actions/State:** `step` (upload→parsing→done), `file`, `parsed`. `handleFile` simulates a 2.8s parse.
- **School variations:** tips card lists the active school's value props; all accents themed.
- **Polish:** drag-hover color flip, bouncing robot during parse, sequential status reveal, weighted-deadline chips.
- **Mock vs live:** **parsing is mocked** (`MOCK_PARSED`). Live: send file to a parsing endpoint (LLM extraction via Claude API) returning the same shape; store under `syllabi`.

### C.7 AI Study Hub — `/study` (`src/pages/StudyRecommendations.jsx`)
- **Purpose:** convert the plan into active studying.
- **User value:** "Here's exactly what to do this week, plus tools to do it."
- **Layout:** this-week plan (5-day checklist) → tool grid (Flashcards, Quiz, Summarizer, Planner, Explain, Tutor) → expandable **live flashcard generator** → school study-tips card.
- **Components:** day rows with done-states, tool cards (badge + icon), flashcard flipper with prev/next.
- **Data:** `MOCK_PLAN`, `STUDY_TOOLS`, `MOCK_CARDS`; `school.pitchPoints` for tips.
- **Actions/State:** `activeTool`, `flashInput`, `flashCards`, `currentCard`, `flipped`, `generating`. Generate simulates 1.5s then shows interactive cards.
- **School variations:** accents, badges, and the tips card content per school.
- **Polish:** 3D-ish card flip animation, completed-task strikethrough, generate spinner.
- **Mock vs live:** flashcards/plan mocked. Live: generate from uploaded notes via Claude API; plan derived from parsed deadlines.

### C.8 AI Chat — `/chat` (`src/pages/ChatFeature.jsx`)
- **Purpose:** the always-on, **school-aware** tutor — a core feature, not an afterthought.
- **User value:** "It answers about *my* courses, not generic web results."
- **Layout:** full-screen messenger. Header (back, AI avatar, online + school-mode indicator) → message stream (user right / AI left) → typing indicator → quick-prompt chips (first turn) → input bar.
- **Components:** message bubbles, animated typing dots, quick-prompt row, send button.
- **Data:** seeded greeting using `user.name` + `school.name`; `getAIResponse(message, school)` intent-routes (schedule/explain/quiz/study/default).
- **Actions/State:** `messages`, `input`, `typing`; auto-scroll to bottom; 1.2–2s simulated latency.
- **School variations:** greeting and "{school} mode" indicator; default responses interpolate `school.shortName`.
- **Polish:** bouncing typing dots, message entrance animation, timestamped bubbles, horizontal-scroll prompt chips.
- **Mock vs live:** **responses mocked** via keyword routing. Live: stream from Claude API with a system prompt injected from the school profile + active course + parsed syllabus (RAG). See §J.

### C.9 School Directory — `/directory` (`src/pages/SchoolDirectory.jsx`)
- **Purpose:** the school-specific data/profile view; reinforces "built for your campus."
- **User value:** programs, courses, and guidance specific to the student's school.
- **Layout:** gradient school header → 3 quick stats (students, founded, modality) → "Why Stemara for {school}" card → programs chips → sample-courses list (each links to upload) → switch-school grid.
- **Components:** gradient header, stat tiles, value-prop list, program chips, course rows.
- **Data:** full active `school` object. Empty-state if no school selected.
- **Actions/State:** course rows link to `/syllabus`; other-school chips link back to landing with `?school=`.
- **School variations:** entire screen is the school profile — every field is school data.
- **Polish:** gradient hero, chip wrap, course upload shortcuts.
- **Mock vs live:** school catalog is static data now. Live: pull programs/courses from a `school_catalog` table.

### C.10 Pitch Deck Mode — `/pitch` (`src/pages/PitchDeck.jsx`)
- **Purpose:** prove to a college audience that **separate, school-specific decks exist** and personalization is the thesis.
- **User value (for founder/buyer):** a ready-to-present, school-tailored narrative.
- **Layout:** two modes. **Select:** 2×2 grid of deck cards + a "why different decks" explainer block. **Present:** school banner → animated slide → controls (prev, dot nav, next).
- **Components:** deck cards, slide renderer (`SlideContent` by type: cover/problem/solution/value/cta), dot navigation.
- **Data:** `DECK_SLIDES[schoolId]` — 5 slides each.
- **Actions/State:** `mode`, `activeSchool`, `slide`. Selecting a deck enters present mode at slide 0.
- **School variations:** every deck has unique copy; the explainer block explicitly calls out UNH-vs-SNHU-vs-MCC-vs-NCC differences (the MCC/SNHU distinction required by the brief).
- **Polish:** dark presentation chrome, slide slide-in/out, gradient cover slides, numbered problem/solution rows.
- **Mock vs live:** fully live (static decks). Future: editable decks per school from CMS/Supabase.

### C.11 Demo Mode — `/demo` (`src/pages/DemoMode.jsx`)
- **Purpose:** let anyone preview any school's full student experience with no signup — the demo-video and meeting tool.
- **User value:** instant, frictionless tour of each school mode.
- **Layout:** dark hero → 2×2 school cards (gradient hero + expandable value props + "Demo {school}" CTA) → "what you'll see" feature grid.
- **Components:** expandable school cards, launch buttons, feature grid.
- **Data:** `SCHOOL_LIST`.
- **Actions/State:** `activeSchool` (expand), `launching`. Launch sets school context + logs in a `isDemo:true` student and routes to `/dashboard`.
- **School variations:** each card fully themed; launching applies that school everywhere downstream.
- **Polish:** gradient card heros, expand animation, launching state.
- **Mock vs live:** live; uses the same demo-student session as everything else.

### C.12 Founder Dashboard — `/founder/dashboard` (`src/pages/FounderDashboard.jsx`)
- **Purpose:** the founder's command center — signups, testing interest, and school/pitch assets for outreach.
- **User value:** "I can see who's interested, at which school, with what major, and follow up."
- **Layout:** dark app shell, left sidebar nav, 5 tabs: **Overview** (KPIs, interest-by-school bars, recent signups), **Signups** (filterable table), **Testing Interest** (submission cards), **Schools** (data profiles), **Pitch Decks** (launch into `/pitch`).
- **Components:** sidebar, KPI cards, animated bar chart, data table with school filter, interest cards, profile cards.
- **Data:** merges `MOCK_SIGNUPS` + `localStorage('stemara_signups')`; reads `localStorage('stemara_interests')`. Derives KPIs live.
- **Actions/State:** `activeTab`, `filter`. Sign-out clears session.
- **School variations:** school-colored chips/bars throughout; profiles render all four schools.
- **Polish:** dark premium UI, animated growth bars, hover table rows, KPI accent colors.
- **Mock vs live:** mock seed data merged with real localStorage submissions. Live: query Supabase `testing_interest` + `profiles`; founder access gated by role.

---

## D. Data Model

> Current persistence is `localStorage`. Below is the recommended Supabase schema for the live version. Keep field names aligned with the current objects so the adapter swap is mechanical.

### D.1 `profiles` (extends `auth.users`)
| field | type | notes |
|---|---|---|
| `id` | uuid (PK, = auth.uid) | |
| `name` | text | |
| `email` | text | |
| `school` | text | enum: `unh\|snhu\|mcc\|ncc` |
| `major` | text | from `MAJORS` |
| `points` | int | default 0 |
| `plan` | text | `free\|premium` |
| `is_demo` | bool | default false |
| `created_at` | timestamptz | |

### D.2 `testing_interest` (pre-signup, no auth) — see §H schema
### D.3 `signups` — covered by `profiles`; keep a view for the founder table.
### D.4 `syllabi`
| field | type | notes |
|---|---|---|
| `id` | uuid | |
| `user_id` | uuid FK | |
| `course_code` | text | |
| `course_name` | text | |
| `professor` | text | |
| `credit_hours` | int | |
| `semester` | text | |
| `deadlines` | jsonb | `[{type,title,date,weight}]` |
| `weekly_topics` | jsonb | `[{week,topic}]` |
| `recommendations` | jsonb | `string[]` |
| `raw_file_url` | text | storage bucket ref |

### D.5 `chat_messages`
| field | type | notes |
|---|---|---|
| `id` | uuid | |
| `user_id` | uuid FK | |
| `course_code` | text | nullable (active course) |
| `role` | text | `user\|assistant` |
| `content` | text | |
| `created_at` | timestamptz | |

### D.6 `school_catalog` (optional, for live directory)
`school`, `programs jsonb`, `sample_courses jsonb`, `value_props jsonb`, `messaging jsonb`.

### D.7 Static config (stays in code)
`src/data/schools.js` remains the school-mode config (colors, copy, pitch). It's product config, not user data — version it with the code.

---

## E. Integration Plan

| Service | Use | Insertion point | Status |
|---|---|---|---|
| **Vercel** | Hosting/CI | `vite build` → `/dist`; add `vercel.json` SPA rewrite to `/index.html` | Ready |
| **Supabase** | Auth + DB + RLS | Replace `AuthContext.login/logout` with `supabase.auth`; swap localStorage reads in Founder/Signup/Modal for table queries | Adapter-ready |
| **Formspree** | Public testing form | `PreSignupModal.handleSubmit` → also `fetch(FORMSPREE_URL)` | Stubbed |
| **Slack** | Internal alerts | Server route / Supabase Edge Function on insert into `testing_interest` and `profiles` → Slack incoming webhook | Stubbed |

**Adapter pattern:** introduce `src/lib/api.js` exporting `saveInterest()`, `saveSignup()`, `login()`, `getFounderData()`, `sendChat()`. Today they wrap localStorage; flip them to Supabase without touching components.

**Env vars (live):** `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_FORMSPREE_ID`, `SLACK_WEBHOOK_URL` (server-side only), `ANTHROPIC_API_KEY` (server-side only — never in client).

---

## F. School Mode Configuration Plan

- **Single source:** `src/data/schools.js`. Each school exports: `id, name, shortName, type, location, modality, colors{primary,secondary,accent,bg,light,dark}, emoji, tagline, description, pitch, pitchAngle, valueProps[], programs[], studentCount, founded, website, pitchPoints[], sampleCourses[]`.
- **Pitch decks:** `DECK_SLIDES[id]` in `PitchDeck.jsx` (consider moving to `src/data/decks.js` for symmetry).
- **Adding a 5th school:** add one object to `SCHOOLS` + one `DECK_SLIDES` entry. Zero component edits. This is the extensibility proof.
- **Theming contract:** components only read `school.colors.*` inline; never hardcode a school color in a component.

---

## G. Founder Dashboard Schema (data the dashboard consumes)

```
FounderView {
  kpis: {
    totalSignups: int,
    totalInterests: int,
    highInterest: int,
    schoolsReached: int
  },
  interestBySchool: { unh:int, snhu:int, mcc:int, ncc:int },
  signups: [{
    id, name, email, school, major,
    interestLevel: 'high'|'medium'|'low'|null,
    tag: string, submittedAt|joinedAt: ISO
  }],
  interests: [{           // pre-signup modal submissions
    id, name, email, school, major,
    interestLevel, submittedAt, tag:'testing-interest'
  }],
  schools: SCHOOLS[]      // static profiles for the Schools tab
}
```
Access control (live): `profiles.role = 'founder'` checked via RLS; non-founders redirected.

---

## H. Testing Submission Schema (pre-signup)

```
testing_interest {
  id: uuid,
  name: text,
  email: text,
  school: 'unh'|'snhu'|'mcc'|'ncc',
  major: 'STEM'|'Business'|'Humanities'|'Health'|'Education'|'Undeclared'|'Other',
  interest_level: 'high'|'medium'|'low',
  tag: text default 'testing-interest',
  source: text default 'landing_modal',
  submitted_at: timestamptz default now()
}
```
Validation: name length > 1, email contains `@`, all three selections required before submit (already enforced by `canAdvance()`). On insert → Formspree mirror + Slack notify.

---

## J. Chat Architecture Recommendation

- **Today (mock):** `getAIResponse(message, school)` keyword-routes to canned answers; UI simulates latency + typing.
- **Live target:** thin server route (Vercel Edge Function or Supabase Edge Function) calling the **Claude API** with streaming.
- **System prompt assembly (server-side):**
  1. Base tutor persona ("You are Stemara's study tutor…").
  2. **School layer** — inject `school.name`, `type`, `modality`, `pitchAngle`, tone guidance from the school profile.
  3. **Course layer** — inject the active parsed syllabus (deadlines, topics) as context (lightweight RAG).
  4. **Student layer** — name, major, plan.
- **Persistence:** append each turn to `chat_messages` keyed by `user_id` + `course_code`.
- **Safety:** keep the "study support only" disclaimer; never expose the API key client-side; rate-limit per user.
- **Streaming:** stream tokens to the existing bubble UI; keep the typing-dot fallback for connection setup.

---

## K. Pitch Deck Structure (per school — 5 slides each)

Each deck follows the same 5-beat arc but with school-specific content (already in `DECK_SLIDES`):
1. **Cover** — school name + pitch angle + one-line promise.
2. **Problem** — 4 school-specific pain points.
3. **Solution** — 4 Stemara capabilities mapped to those pains.
4. **Value** — one bold statement of why this school + Stemara fits.
5. **CTA** — the specific ask (pilot, partnership, scale).

Per-school emphasis:
- **UNH:** research complexity → structured planning → prestige/partnership pilot.
- **SNHU:** async isolation → 24/7 + mobile + competency tracking → **scale** ask (17K @ 10%).
- **MCC:** affordability/first-gen → **free tier + equity** → free pilot ask.
- **NCC:** classroom-to-job gap → local employer integration → flagship community-college co-build.

The `/pitch` select view must keep the "why different decks?" explainer that articulates the MCC-vs-SNHU divergence.

---

## L. Build Order

1. **Foundations** *(done)* — data layer (`schools.js`, `mockData.js`), `SchoolContext`, `AuthContext`, routing in `App.jsx`.
2. **Acquisition path** *(done)* — Landing + Pre-signup Modal + Login + Signup.
3. **Core student loop** *(done)* — Dashboard → Syllabus → Study Hub → Chat → Directory.
4. **Founder + story** *(done)* — Founder Dashboard, Pitch Deck, Demo Mode.
5. **Adapter layer** *(next)* — `src/lib/api.js` to centralize persistence calls.
6. **Live integrations** — Supabase auth+DB, Formspree, Slack, Claude chat route.
7. **Polish pass** — responsive QA, empty states, loading skeletons, a11y, OG/meta for sharing.
8. **Deploy** — Vercel + env vars + SPA rewrite.

---

## M. Mock vs Live Plan

### Mock first (ship the demo on these)
- AI chat responses (keyword routing).
- Syllabus parsing result (`MOCK_PARSED`).
- Flashcards + weekly plan.
- Founder seed data (`MOCK_SIGNUPS`, `MOCK_STATS`).
- Points/plan values.
- School catalog (static `schools.js`).

### Must be real for the demo
- Navigation + routing across all 12 screens.
- School selection + theming + persistence.
- Login/logout/session + protected routes.
- Pre-signup modal **actually saving** interest (localStorage) and that data **appearing** in the founder dashboard — the end-to-end story must be real.
- Signup actually creating a session and appearing in the founder table.
- Demo mode launching any school's full experience.
- Pitch deck navigation across all four school decks.

---

## N. Risks & Assumptions

- **Assumption:** localStorage is acceptable for the demo; data is per-browser and not shared. *Mitigation:* swap to Supabase via the adapter before any multi-user demo.
- **Risk:** founder credentials are currently hardcoded. *Mitigation:* move to Supabase role-based access before exposing publicly.
- **Risk:** API keys must never reach the client. *Mitigation:* all Claude/Slack calls go through server functions.
- **Risk:** dynamic inline colors can't use Tailwind's JIT for arbitrary states (e.g. `focus:border-{school}`). *Mitigation:* inline styles already used for dynamic theming; keep that pattern.
- **Risk:** school facts (student counts, founding years, programs) are illustrative. *Mitigation:* verify against public sources before any college meeting.
- **Assumption:** four schools now; architecture supports N schools with no code changes (data-driven). Validated by the config plan in §F.
- **Risk:** bundle size (~426KB) from framer-motion. *Mitigation:* acceptable for demo; consider route-level code-splitting in the polish pass.

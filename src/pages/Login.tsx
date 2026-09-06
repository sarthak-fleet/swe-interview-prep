import { ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from '../contexts/AuthContext';
import curriculumSummary from '../data/public-curriculum-summary.json';
import { GitHubRepoLink } from '../components/GitHubRepoLink';
import { SiteHeader } from '../components/SiteHeader';
import { GoogleSignInButton } from '../components/GoogleSignInButton';
import { getGoogleClientId } from '../lib/googleClientId';

const PRINCIPLES = [
  {
    title: 'Always answer "what next?"',
    body: 'The dashboard picks one concept to learn, one drill to solve, and the reviews that are due. No decision fatigue.',
  },
  {
    title: 'No learning without an artifact',
    body: 'Every concept maps to drills and something you build — code, a benchmark, a design doc. Theory becomes proof.',
  },
  {
    title: 'Roadmaps with real progress',
    body: 'Structured paths from a 9-day reset to a 12-month run at AI infrastructure depth. Progress is mastered concepts, not pages read.',
  },
];

const SURFACES = [
  {
    tag: '01',
    title: 'Dashboard',
    body: 'One evidence-backed priority for today, chosen from your path, unfinished practice, and reviews that are due.',
  },
  {
    tag: '02',
    title: 'Learn',
    body: `${curriculumSummary.counts.concepts} concepts, ${curriculumSummary.counts.roadmaps} roadmaps, primary sources, role-fit planning, and clear prerequisites.`,
  },
  {
    tag: '03',
    title: 'Practice',
    body: `${curriculumSummary.counts.drills} drills in a Monaco and Excalidraw workspace, with Socratic help and an explain-back gate.`,
  },
  {
    tag: '04',
    title: 'Wars',
    body: 'One-minute Blitz checks and thirty-minute Tradeoff battles diagnose gaps, then send you back to the exact concept to repair.',
  },
];

const FEATURED_TRACK_IDS = new Set([
  'dsa',
  'system-design',
  'backend',
  'infrastructure-platforms',
  'ai-systems',
  'behavioral',
]);

const FEATURED_TRACKS = curriculumSummary.tracks.filter((track) =>
  FEATURED_TRACK_IDS.has(track.id)
);

const CURRENT_STATE = [
  {
    label: 'Product state',
    value: 'A mature personal-use learning system in maintenance-only mode.',
  },
  {
    label: 'Guest access',
    value: 'Start without an account. Guest progress stays in this browser.',
  },
  {
    label: 'Signed-in access',
    value: 'Google sign-in keeps learning and competitive progress across sessions.',
  },
  {
    label: 'Commercial state',
    value: 'There is no paid tier, subscription, or checkout.',
  },
];

export default function Login() {
  const { continueAsGuest, user } = useAuth();
  const navigate = useNavigate();
  const [debugInfo, setDebugInfo] = useState<string>('');

  useEffect(() => {
    if (user) navigate('/dashboard', { replace: true });
  }, [navigate, user]);

  const startMockAsGuest = () => {
    continueAsGuest();
    navigate('/mock');
  };

  useEffect(() => {
    document.getElementById('lcp-shell')?.remove();
    setDebugInfo(getGoogleClientId() ? 'Client ID configured' : 'Google sign-in unavailable');
  }, []);

  return (
    <div className="relative min-h-screen bg-black text-white">
      <SiteHeader
        onNavigate={continueAsGuest}
        actions={
          <>
            <button
              onClick={continueAsGuest}
              className="hidden px-2 py-1.5 font-mono text-xs text-white/50 transition-colors hover:text-white sm:inline-flex"
            >
              Guest
            </button>
            <a
              href="#sign-in"
              className="inline-flex h-11 items-center rounded-md border border-white/10 px-3 text-xs font-medium text-white/65 transition-colors duration-150 hover:border-white/20 hover:bg-white/[0.04] hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/50"
            >
              Sign in
            </a>
          </>
        }
      />

      <main id="main-content">
        {/* Hero */}
        <section className="relative">
          <div className="dot-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)]" />
          <div className="mx-auto grid w-full max-w-5xl gap-16 px-6 pt-24 pb-20 sm:pt-32 lg:grid-cols-[minmax(0,1.35fr)_minmax(18rem,0.65fr)] lg:items-end lg:pt-40">
            <div>
              <div className="mb-6 font-mono text-xs uppercase tracking-[0.18em] text-white/65">
                Personal SWE learning OS · interview practice
              </div>
              <h1 className="max-w-4xl text-balance text-5xl font-bold tracking-tight text-white sm:text-7xl lg:text-[5.25rem] lg:leading-[0.95]">
                Turn interview prep into engineering you can prove.
              </h1>
              <p className="mt-8 max-w-2xl text-pretty text-base leading-relaxed text-white/70 sm:text-lg">
                SWE Interview Prep gives software engineers one loop for learning a mechanism,
                practising it, building evidence, explaining it back, and retaining it. Use it for
                DSA, system design, AI and infrastructure depth, or a role-specific interview plan.
              </p>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                  onClick={continueAsGuest}
                  className="group inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black transition-all hover:bg-white/90"
                >
                  Open today&apos;s plan
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </button>
                <button
                  onClick={startMockAsGuest}
                  className="inline-flex min-h-11 items-center justify-center gap-2 px-2 py-2.5 text-sm font-medium text-white/70 transition-colors hover:text-white"
                >
                  Or try a mock interview
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-4 font-mono text-xs leading-5 text-white/65">
                No account needed. Guest work stays in this browser; sign in when you want durable
                progress.
              </p>
              {import.meta.env.DEV && debugInfo && (
                <p className="mt-4 font-mono text-xs text-white/30">{debugInfo}</p>
              )}
            </div>

            <aside className="border-y border-white/[0.1] py-6 lg:border-y-0 lg:border-l lg:py-2 lg:pl-8">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-cyan-300/80">
                The evidence contract
              </p>
              <dl className="mt-6 divide-y divide-white/[0.08]">
                <div className="grid grid-cols-[5rem_1fr] gap-4 py-4 first:pt-0">
                  <dt className="font-mono text-xs text-white/60">Learn</dt>
                  <dd className="text-base leading-7 text-white/80">
                    A mental model, primary source, and prerequisite path.
                  </dd>
                </div>
                <div className="grid grid-cols-[5rem_1fr] gap-4 py-4">
                  <dt className="font-mono text-xs text-white/60">Build</dt>
                  <dd className="text-base leading-7 text-white/80">
                    Code, diagrams, benchmarks, decisions, or explanations.
                  </dd>
                </div>
                <div className="grid grid-cols-[5rem_1fr] gap-4 py-4">
                  <dt className="font-mono text-xs text-white/60">Verify</dt>
                  <dd className="text-base leading-7 text-white/80">
                    Socratic prompts and a Feynman explain-back, never answer dumping.
                  </dd>
                </div>
                <div className="grid grid-cols-[5rem_1fr] gap-4 py-4 last:pb-0">
                  <dt className="font-mono text-xs text-white/60">Retain</dt>
                  <dd className="text-base leading-7 text-white/80">
                    FSRS schedules the next retrieval from demonstrated learning state.
                  </dd>
                </div>
              </dl>
            </aside>
          </div>
        </section>

        {/* Principles */}
        <section className="border-t border-white/[0.08]">
          <div className="mx-auto w-full max-w-5xl px-6 py-20">
            <div className="mb-12 font-mono text-xs uppercase tracking-[0.18em] text-white/65">
              The loop
            </div>
            <div className="grid gap-12 md:grid-cols-3">
              {PRINCIPLES.map((p, i) => (
                <div key={p.title}>
                  <div className="mb-3 font-mono text-xs text-white/60">0{i + 1}</div>
                  <h3 className="text-lg font-semibold tracking-tight text-white">{p.title}</h3>
                  <p className="mt-3 text-base leading-7 text-white/75">{p.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Product proof */}
        <section className="border-t border-white/[0.08]">
          <div className="mx-auto w-full max-w-5xl px-6 py-20">
            <div className="font-mono text-xs uppercase tracking-[0.18em] text-cyan-300/90">
              A real first session
            </div>
            <div className="mt-5 grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)] lg:items-start">
              <div>
                <h2 className="max-w-2xl text-balance text-3xl font-bold tracking-tight text-white sm:text-5xl">
                  The promise becomes a concrete plan.
                </h2>
                <p className="mt-5 max-w-2xl text-base leading-7 text-white/70">
                  A new guest is not dropped into a content library. The dashboard picks a reachable
                  concept, names the evidence required, and links learning to a build task. This is
                  the first plan the product generates for the AI Search &amp; Infrastructure path.
                </p>

                <div className="mt-10 overflow-hidden rounded-xl border border-white/[0.12] bg-white/[0.025]">
                  <div className="flex items-center justify-between border-b border-white/[0.1] px-5 py-4 font-mono text-xs text-white/55">
                    <span>Dashboard · new learner</span>
                    <span>45 min</span>
                  </div>
                  <div className="p-5 sm:p-7">
                    <p className="font-mono text-xs text-cyan-300">TODAY&apos;S PRIORITY</p>
                    <h3 className="mt-3 max-w-xl text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                      Build a causal model of Tokenization.
                    </h3>
                    <p className="mt-4 max-w-xl text-base leading-7 text-white/75">
                      Start with the first reachable concept, then prove the model by producing a
                      working search tokenizer and explaining one failure mode.
                    </p>
                    <ol className="mt-7 divide-y divide-white/[0.08] border-y border-white/[0.08]">
                      {[
                        ['5m', 'Learn the concept', 'Tokenization'],
                        ['19m', 'Build a search tokenizer', 'Artifact'],
                        ['11m', 'Implement BM25 search', 'Ship in Playground'],
                      ].map(([time, action, detail]) => (
                        <li
                          key={action}
                          className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-3 py-4 sm:grid-cols-[3rem_minmax(0,1fr)_auto]"
                        >
                          <span className="font-mono text-xs text-white/60">{time}</span>
                          <span className="text-[15px] font-medium text-white">{action}</span>
                          <span className="col-start-2 text-sm text-white/70 sm:col-start-auto">
                            {detail}
                          </span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>

              <aside className="space-y-4 lg:pt-20">
                <div className="rounded-xl border border-white/[0.12] p-6">
                  <p className="font-mono text-xs uppercase tracking-[0.16em] text-white/65">
                    Evidence required
                  </p>
                  <p className="mt-4 text-base leading-7 text-white/80">
                    Write an explain-back with one example and one failure mode. Produce code that
                    handles punctuation, casing, and stop words.
                  </p>
                </div>
                <div className="rounded-xl border border-white/[0.12] p-6">
                  <p className="font-mono text-xs uppercase tracking-[0.16em] text-white/65">
                    What completion unlocks
                  </p>
                  <p className="mt-4 text-base leading-7 text-white/80">
                    The next concept or a longer review interval. Reading a page alone does not
                    count as mastery.
                  </p>
                </div>
              </aside>
            </div>

            <div className="mt-16 border-t border-white/[0.08] pt-12">
              <div className="mb-10 font-mono text-xs uppercase tracking-[0.18em] text-white/65">
                Four entry points, one learning model
              </div>
              <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
                {SURFACES.map((s) => (
                  <div key={s.title}>
                    <div className="mb-3 font-mono text-xs text-white/60">{s.tag}</div>
                    <h3 className="text-lg font-semibold tracking-tight text-white">{s.title}</h3>
                    <p className="mt-3 text-base leading-7 text-white/75">{s.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Current state */}
        <section className="border-t border-white/[0.08]">
          <div className="mx-auto w-full max-w-5xl px-6 py-20">
            <div className="font-mono text-xs uppercase tracking-[0.18em] text-white/65">
              Current state
            </div>
            <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
              <div>
                <h2 className="max-w-xl text-balance text-3xl font-bold tracking-tight text-white sm:text-5xl">
                  Open to use. Honest about its state.
                </h2>
                <p className="mt-5 max-w-xl text-base leading-7 text-white/75">
                  This is mature personal software, kept available for engineers who find the same
                  evidence-first loop useful. It is not presented as a subscription business or an
                  actively expanding course platform.
                </p>
              </div>
              <dl className="divide-y divide-white/[0.08] border-y border-white/[0.08]">
                {CURRENT_STATE.map((item) => (
                  <div
                    key={item.label}
                    className="grid gap-2 py-5 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-6"
                  >
                    <dt className="font-mono text-xs text-white/65">{item.label}</dt>
                    <dd className="text-base leading-7 text-white/80">{item.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        {/* Public curriculum */}
        <section className="border-t border-white/[0.08]">
          <div className="mx-auto w-full max-w-5xl px-6 py-20">
            <div className="font-mono text-xs uppercase tracking-[0.18em] text-white/65">
              Public curriculum
            </div>
            <div className="mt-5 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
              <div>
                <h2 className="max-w-3xl text-balance text-3xl font-bold tracking-tight text-white sm:text-5xl">
                  {curriculumSummary.counts.tracks} tracks. {curriculumSummary.counts.concepts}{' '}
                  concepts. One connected map.
                </h2>
                <p className="mt-5 max-w-3xl text-base leading-7 text-white/75">
                  Start with interview fundamentals across DSA, system design, backend engineering,
                  infrastructure, AI systems, and behavioral judgment. Thirteen deeper tracks cover
                  the systems and product work behind them. Every concept includes a mental model,
                  primary source, practice direction, review prompt, and path to build evidence.
                </p>
              </div>
              <a
                href="/curriculum/"
                className="inline-flex min-h-11 shrink-0 items-center gap-2 text-sm font-semibold text-cyan-300 hover:text-cyan-200"
              >
                Browse curriculum <ArrowRight className="h-4 w-4" />
              </a>
            </div>
            <div className="mt-12 grid gap-px overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.08] sm:grid-cols-2 lg:grid-cols-3">
              {FEATURED_TRACKS.map((track) => (
                <a
                  key={track.id}
                  href={`/curriculum/tracks/${track.id}.html`}
                  className="bg-black p-5 transition-colors hover:bg-white/[0.04]"
                >
                  <h3 className="text-base font-semibold text-white">{track.title}</h3>
                  <p className="mt-2 text-[15px] leading-6 text-white/70">{track.description}</p>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="relative border-t border-white/[0.08]">
          <div className="dot-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />
          <div className="mx-auto w-full max-w-3xl px-6 py-24 text-center">
            <h2 className="text-balance text-3xl font-bold tracking-tight text-white sm:text-5xl">
              Open today&apos;s plan.
            </h2>
            <p className="mt-4 text-base text-white/75">
              Start as a guest. Sign in only when you want your learning state to survive this
              browser.
            </p>
            <div
              id="sign-in"
              className="mt-10 flex scroll-mt-24 flex-col items-center justify-center gap-3 sm:flex-row"
            >
              <button
                onClick={continueAsGuest}
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black hover:bg-white/90"
              >
                Open today&apos;s plan <ArrowRight className="h-4 w-4" />
              </button>
              <GoogleSignInButton size="large" />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/[0.08]">
        <div className="mx-auto grid w-full max-w-5xl gap-10 px-6 py-12 sm:grid-cols-[minmax(0,1.5fr)_repeat(2,minmax(0,0.75fr))]">
          <div>
            <p className="font-semibold text-white">SWE Interview Prep</p>
            <p className="mt-3 max-w-md text-base leading-7 text-white/65">
              A personal learning OS that turns software-engineering study into retained,
              artifact-backed understanding.
            </p>
            <p className="mt-4 font-mono text-xs text-white/55">
              Maintenance-only · no paid tier · © {new Date().getFullYear()}
            </p>
          </div>
          <nav aria-label="Product" className="text-sm">
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-white/60">Product</p>
            <div className="mt-4 flex flex-col gap-3">
              <Link
                to="/about"
                className="inline-flex min-h-11 items-center text-white/70 hover:text-white"
              >
                About
              </Link>
              <Link
                to="/changelog"
                className="inline-flex min-h-11 items-center text-white/70 hover:text-white"
              >
                Changelog
              </Link>
              <Link
                to="/privacy"
                className="inline-flex min-h-11 items-center text-white/70 hover:text-white"
              >
                Privacy
              </Link>
            </div>
          </nav>
          <nav aria-label="Browse" className="text-sm">
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-white/60">Browse</p>
            <div className="mt-4 flex flex-col gap-3">
              <a
                href="/curriculum/"
                className="inline-flex min-h-11 items-center text-white/70 hover:text-white"
              >
                Public curriculum
              </a>
              <a
                href="/system-design/"
                className="inline-flex min-h-11 items-center text-white/70 hover:text-white"
              >
                System-design cases
              </a>
              <GitHubRepoLink
                href="https://github.com/Significant-Hobbies/swe-interview-prep"
                className="inline-flex min-h-11 items-center text-white/70 hover:text-white"
              />
            </div>
          </nav>
        </div>
      </footer>
    </div>
  );
}

import { useEffect } from 'react';

import { GitHubRepoLink } from '../components/GitHubRepoLink';
import { CHANGELOG_RELEASES, CHANGELOG_REPOSITORY } from '../data/changelog';

export default function Changelog() {
  useEffect(() => {
    document.title = 'Changelog · SWE Prep';
  }, []);

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-12 text-white sm:px-8 sm:py-16">
      <header className="max-w-3xl">
        <p className="font-mono text-xs font-semibold text-cyan-300">PRODUCT HISTORY</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-6xl">Changelog</h1>
        <p className="mt-5 max-w-[65ch] text-base leading-7 text-white/55">
          Meaningful improvements to the curriculum, practice loop, and personal learning system.
        </p>
        <nav className="mt-6 flex flex-wrap gap-5 text-sm" aria-label="Project links">
          <a className="text-cyan-300 hover:text-cyan-200" href={`${CHANGELOG_REPOSITORY}/issues`}>
            Roadmap
          </a>
          <GitHubRepoLink
            href={CHANGELOG_REPOSITORY}
            className="inline-flex items-center text-cyan-300 hover:text-cyan-200"
          />
        </nav>
      </header>

      <ol className="mt-12 space-y-4">
        {CHANGELOG_RELEASES.map((release) => (
          <li key={`${release.date}-${release.title}`}>
            <article className="rounded-xl bg-white/[0.04] p-5 ring-1 ring-white/[0.08] sm:p-7">
              <time
                className="font-mono text-xs font-semibold text-white/35"
                dateTime={release.date}
              >
                {new Date(`${release.date}T00:00:00`).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
              <h2 className="mt-2 text-xl font-semibold tracking-tight sm:text-2xl">
                {release.title}
              </h2>
              <ul className="mt-4 list-disc space-y-2 pl-5 leading-7 text-white/55">
                {release.outcomes.map((outcome) => (
                  <li key={outcome}>{outcome}</li>
                ))}
              </ul>
            </article>
          </li>
        ))}
      </ol>
    </div>
  );
}

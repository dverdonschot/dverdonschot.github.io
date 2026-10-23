# AGENTS.md — personal-site

Dennis's personal website and blog. Plain HTML, CSS and JavaScript,
built by `node build.js` into `dist/`. Read `README.md` for the
shape of it, `docs/` for detail.

## Hard constraints

- **Forgejo is the source of truth.** `origin` is
  `ewt-lab/personal-site`; `github` is the GitHub Pages mirror.
  Never push to GitHub by hand: the mirror overwrites it. Push to
  `origin` and let `scripts/sync-to-github.sh` do the rest.
- **`src/CNAME` must say `dennis-verdonschot.nl`.** It is what makes
  GitHub Pages serve the custom domain. The build copies it into
  `dist/` untouched.
- **Every absolute URL points at `dennis-verdonschot.nl`.** Canonals,
  `og:url`, the RSS feed and the sitemap. `dverdonschot.github.io`
  still serves the site, but it is not the address we link to.
- **Everything under `src/` is copied into `dist/` verbatim.** That
  is how the weekly AI Model Radar report rides along in
  `src/radar/`. Do not put build artefacts in `src/`.
- **No secrets.** The tracked `.env` holds Nostr test keys and
  disabled publishing flags only. Real keys never go in this repo.

## Workflow for agents

- `npm ci && npm run build` must succeed before a commit. The
  GitHub Actions workflow does the same on push.
- Root-relative links (`/blog.html`) are correct for the site
  itself; use absolute URLs only for other hosts (the radar at
  `radar.dennis-verdonschot.nl`, Typetutor at `typetutor.org`).
- After pushing to `origin`, run `scripts/sync-to-github.sh` (or
  wait for the timer) so GitHub Pages redeploys.

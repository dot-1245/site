thx for read me.
https://dot1245.net/

## Local development

Run commands from this directory with Node.js 22.12+ (or a supported newer version).

```sh
npm install
npm run dev
```

`npm run check` checks Astro and TypeScript. `npm run build` generates the static
site in `dist/`; `npm run preview` serves that build locally.

Profile, system specifications, and contact links live in `src/data/profile.ts`.
The design uses M PLUS 1 from Google Fonts with a local sans-serif fallback.
Theme choice is saved in the browser; motion respects the system's reduced-motion
setting. Reference files in `AGENTS/ref/` are not part of the built site.

## Cloudflare Workers

The site uses Workers Static Assets to serve `dist/`, configured in
`wrangler.jsonc`. It does not need an Astro server adapter.

For Workers Builds, use `npm run build` as the build command,
`npx wrangler deploy` as the deploy command, and `npx wrangler preview` as the
preview command. The Worker name is `site`.

For a manual deployment, run `npm run build` before `npx wrangler deploy`.

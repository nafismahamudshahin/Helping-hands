<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# HelpingHands

Volunteer-event platform. Single Next.js App Router app (no monorepo), early stage: one page plus a shared navbar. The root README is stock create-next-app boilerplate — its paths and package-manager list are wrong; trust this file and the config instead.

## Stack facts that differ from defaults

- **shadcn style `base-nova`** (`components.json`): UI components wrap **Base UI** (`@base-ui/react`), NOT Radix. Compose with the polymorphic `render` prop (`<Button render={<Link href="/login" />} />`), not `asChild` — `asChild` does not exist here. `Sheet` is Base UI `Dialog` underneath.
- Add shadcn components with `npx shadcn@latest add <name>` rather than pasting snippets from memory; the CLI picks up this repo's Base UI style.
- **Tailwind v4, CSS-first**: there is no `tailwind.config` or `postcss.config`. Theme tokens and the `dark` variant (`&:is(.dark *)`) live in `src/app/globals.css`; CSS is compiled through the Turbopack loader rule in `next.config.ts` — don't add a PostCSS setup.
- `cn` is the npm [`cn`](https://github.com/shadcn-ui/cn) package (compiled clsx + tailwind-merge drop-in) and is imported directly: `import { cn } from "cn"`. `src/lib/utils.ts` only re-exports it. It really merges Tailwind classes, so pass conflicting utilities to override component defaults.
- Theming is `next-themes` with `attribute="class"`, wired in `src/components/theme-provider.tsx` (rendered inside `<body>` in the root layout; `suppressHydrationWarning` on `<html>` is required). When adding a light/dark icon pair, render BOTH and let `dark:` CSS hide one — conditional rendering on `resolvedTheme` causes hydration mismatches.
- React Compiler is enabled (`reactCompiler: true`). Respect its rules (no impure renders, careful with refs/mutations).
- Layouts use Next 16's generated `LayoutProps<"/">` type — keep it, don't swap in a hand-written props type.
- npm is the package manager (only `package-lock.json` exists).

## Commands

- `npm run dev` — dev server on Turbopack. It re-writes the auto-managed `AGENTS.md` blocks above (plus a `nextjs-agent-feedback` block, since `experimental.agentFeedback` is on) and appends missing ones at the end of this file; commit them with your work.
- `npm run lint` — ESLint only (flat config, `eslint.config.mjs`), no `--fix`.
- Typecheck: `npx tsc --noEmit` — there is no script for it; `npm run build` also runs TypeScript.
- `npm run build` / `npm run start` — production build and serve.
- **There is no test runner, CI, or env setup in this repo** — don't invent test commands; `.env*` is gitignored and unused so far.
- Full check before handing work back: `npm run lint && npx tsc --noEmit && npm run build`.

## Code layout

- `src/app/` — routes. `layout.tsx` renders `ThemeProvider` + `Navbar` above `children`; add new pages under `src/app/<route>/page.tsx`.
- `src/components/ui/` — shadcn-generated primitives (`button`, `sheet`); prefer regenerating over hand-editing.
- `src/components/` — app components: `navbar.tsx` (client component, uses `usePathname` for active links), `mode-toggle.tsx`, `theme-provider.tsx`.
- `@/*` aliases to `src/*` (tsconfig).
- `public/images/` — brand assets; `logo.png` is the HelpingHands logo used in the navbar (its dark-green wordmark needs the `dark:invert dark:hue-rotate-180` filter applied in `navbar.tsx` to stay visible on dark backgrounds).
- Navbar routes (`/upcoming-events`, `/manage-events`, `/joined-events`, `/login`) are placeholders — those pages don't exist yet and 404 until created.

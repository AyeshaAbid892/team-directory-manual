<p align="center">
  <img src="./header.svg" alt="Roster — Team Directory banner" width="100%" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18.3-149eca?style=flat-square&logo=react&logoColor=white" alt="React 18.3" />
  <img src="https://img.shields.io/badge/Vite-5.4-646cff?style=flat-square&logo=vite&logoColor=white" alt="Vite 5.4" />
  <img src="https://img.shields.io/badge/License-MIT-14b8a6?style=flat-square" alt="MIT License" />
  <img src="https://img.shields.io/badge/Status-Production--styled-0f766e?style=flat-square" alt="Status" />
</p>

<h1 align="center">Roster</h1>
<p align="center"><b>A fully interactive team directory — built the way a real product team builds one, not the way a tutorial builds one.</b></p>

<br/>

## Table of contents

1. [What this project is](#1-what-this-project-is)
2. [Why it exists — the story behind the build](#2-why-it-exists--the-story-behind-the-build)
3. [Feature tour — everything that's clickable](#3-feature-tour--everything-thats-clickable)
4. [Tech stack — and why each piece was chosen](#4-tech-stack--and-why-each-piece-was-chosen)
5. [Project structure](#5-project-structure)
6. [Architecture — how data flows through the app](#6-architecture--how-data-flows-through-the-app)
7. [Deep dive — every file, explained](#7-deep-dive--every-file-explained)
8. [Design system — the "Roster" visual language](#8-design-system--the-roster-visual-language)
9. [Getting started](#9-getting-started)
10. [Available scripts](#10-available-scripts)
11. [Deployment](#11-deployment)
12. [Known limitations & what's next](#12-known-limitations--whats-next)
13. [License](#13-license)

<br/>

## 1. What this project is

**Roster** is a team-profile directory web app — the kind of internal tool a People Ops or HR team would actually be handed at a real company. You can:

- Browse every team member as a searchable, sortable, filterable card grid (or switch to a list view).
- Click any card to open a full profile panel.
- Add a brand-new team member through a validated form — they appear in the directory instantly.
- Edit or remove an existing member.
- Follow/unfollow people, with live counts.
- Export the currently visible list to a real CSV file.

It's built with **React 18** and **Vite 5**, with zero backend — all state lives in memory via React hooks, which means it runs anywhere a static site can be hosted (Vercel, Netlify, GitHub Pages) with no server to maintain.

> **Brief version:** it's a React CRUD app for managing a team roster, styled to look like a real SaaS product, not a class demo.

<br/>

## 2. Why it exists — the story behind the build

This project didn't start as one big spec — it was built up in **four deliberate phases**, each one solving a different problem. Understanding *why* each phase happened explains most of the architectural decisions below.

### Phase 1 — The component-tree fundamentals
The very first version existed to prove out a specific, strict component hierarchy:

```
App → Section → Card → TeamMember → SkillBadge
```

The goal there was to demonstrate three core React concepts correctly and unambiguously:
- **The `children` prop** — `TeamMember` was rendered *inside* `Card` via `<Card><TeamMember /></Card>`, not passed as a named prop, to prove the difference is understood.
- **Prop drilling** — a single `onFollow` callback, defined once at the top in `App`, had to travel down through two layers that never called it themselves (`Section` and `Card`) before finally being invoked in `TeamMember`. This was implemented with `Children.map` + `cloneElement`, which is what makes the forwarding *real* — a runtime prop injection — rather than something wired directly from the top.
- **All six prop types** in one place — string, number, boolean, array, object, and function — each demonstrated on real data instead of dummy placeholders.

That version's job was correctness and clarity, not visual polish.

### Phase 2 — Turning it into a real, functional tool
The fixed five-component tree was a teaching structure, not a product structure. The second phase rebuilt the app around **actual functionality**:
- A `useState`-driven data layer replaced the static, read-only array.
- **Add Member** became a real, validated form — not a mock button.
- **Search and filtering** were added, because a directory nobody can search through isn't a directory, it's a list.
- The visual design moved from a generic "bootcamp card grid" to a light, precise, People-Ops-console aesthetic (more on this in [§8](#8-design-system--the-roster-visual-language)).

### Phase 3 — Making every element earn its place ("high-end" pass)
The third phase's mandate was blunt: **nothing on screen should be decorative.** If it's rendered, it should do something when clicked. This is the phase that added:
- **Click-to-open profile drawers** (not just static cards).
- **Edit and Delete**, completing the CRUD loop that Phase 2 started (Create + Read existed; Update + Delete were missing).
- **Sorting**, a **grid/list view toggle**, **clickable stat tiles**, **clickable skill chips that double as filters**, and a **real CSV export** — the small, unglamorous features that separate an internal tool people actually use from a demo people click through once.

### Phase 4 — Presentation layer (this README + the banners)
The last phase is the one you're reading: packaging the project the way it would ship inside a real engineering org — a documented architecture, a rationale trail for each decision, and custom brand assets (`header.svg` / `footer.svg`) instead of a plain wall of Markdown text.

<br/>

## 3. Feature tour — everything that's clickable

| Element | What happens when you click it | Where it's implemented |
|---|---|---|
| **A member card** (anywhere except the Follow button or a skill chip) | Opens the full profile drawer for that person | `MemberCard.jsx` → `onOpen(member)` |
| **A skill chip** (on a card *or* inside the drawer) | Filters the entire directory to that skill, instantly | `onSkillClick` → sets `query` in `App.jsx` |
| **Follow / Following button** | Toggles follow state for that person; shows a toast | `useTeamDirectory.js` → `toggleFollow()` |
| **"Members" stat tile** | Resets all filters and clears search | `StatsRow.jsx` → `handleStatClick('total')` |
| **"Admins" stat tile** | Jumps straight to the Admins filter tab | `handleStatClick('admins')` |
| **"Countries" / "Unique skills" stat tiles** | Surfaces the underlying breakdown as a toast message | `handleStatClick('countries' \| 'skills')` |
| **Filter tabs** (All / Admins / Following) | Filters the visible member list | `FilterTabs.jsx` |
| **Sort menu** | Reorders the list: Recently added / Name A–Z / Role A–Z | `SortMenu.jsx` |
| **Grid/List toggle** | Switches the card layout | `ViewToggle.jsx` |
| **Export button** | Downloads the *currently visible* (filtered/sorted) members as a `.csv` file | `utils/exportCsv.js` |
| **Add member button** | Opens a validated form; the new person appears immediately, no reload | `AddMemberModal.jsx` (add mode) |
| **Edit (✎) inside the drawer** | Opens the same form, pre-filled, to update that person | `AddMemberModal.jsx` (edit mode, via the `member` prop) |
| **Delete (🗑) inside the drawer** | Opens a confirmation dialog before permanently removing the person | `ConfirmDialog.jsx` |
| **Copy email (✉) inside the drawer** | Copies a generated email address to the clipboard | `navigator.clipboard.writeText(...)` |
| **Search bar** | Live-filters by name, role, skill, or location as you type | `Topbar.jsx` → `setQuery` |
| **Search clear (×)** | Clears the query in one click | `Topbar.jsx` |
| **Toast notification** | Click it to dismiss immediately, instead of waiting for the auto-timeout | `Toast.jsx` |

<br/>

## 4. Tech stack — and why each piece was chosen

| Technology | Why this, specifically |
|---|---|
| **React 18** | Function components + hooks give the cleanest way to express "one source of truth, many views of it" — which is exactly what a directory is: one list, rendered as cards, filtered by a search bar, summarized by a stats row, and detailed in a drawer. |
| **Vite 5** | Near-instant dev server startup and hot module reload. For a UI-heavy project where you're constantly tweaking CSS and re-checking the browser, this matters more than almost anything else in the toolchain. |
| **Plain CSS (no framework)** | Every component owns its own `.css` file, scoped by a BEM-style class prefix (`.member-card__skill`, `.member-card__skill--active`, etc.). No Tailwind, no CSS-in-JS — this keeps the bundle small and makes the design system (§8) explicit and readable rather than hidden behind utility classes. |
| **No backend / no database** | The brief was a *directory*, not a *multi-user system*. Keeping all state in `useState`/`useMemo` inside one hook means the entire app is a static bundle — deployable to any static host, with zero infrastructure to run or pay for. |
| **No component library (no MUI, no Ant Design)** | Off-the-shelf component libraries are exactly what makes a project *look* AI-generated or templated. Every control here — the modal, the drawer, the dropdown, the toast — is hand-built to match one consistent design language. |

<br/>

## 5. Project structure

```
team-directory-pro/
├── index.html                     # Vite entry HTML — loads fonts, mounts #root
├── vite.config.js                 # Vite + @vitejs/plugin-react config
├── package.json                   # Dependencies + npm scripts
├── header.svg                     # README banner (top)
├── footer.svg                     # README banner (bottom)
├── .gitignore
├── README.md                      # You are here
└── src/
    ├── main.jsx                   # React root — mounts <App /> into #root
    ├── index.css                  # Design tokens (CSS variables) + global reset
    ├── App.jsx                    # Composition root — wires every piece together
    ├── App.css                    # Page shell layout
    │
    ├── data/
    │   └── team.js                # Seed data — 7 realistic team members
    │
    ├── hooks/
    │   └── useTeamDirectory.js    # THE single source of truth: state + all CRUD logic
    │
    ├── utils/
    │   ├── avatar.js              # Deterministic initials + color per person
    │   └── exportCsv.js           # Builds and downloads a CSV Blob
    │
    └── components/
        ├── Topbar/                # Logo, search bar, Export button, Add Member button
        ├── StatsRow/              # Clickable summary metrics (4 tiles)
        ├── FilterTabs/            # All / Admins / Following
        ├── SortMenu/              # Dropdown: Recently added / Name / Role
        ├── ViewToggle/            # Grid ↔ List layout switch
        ├── MemberGrid/            # Lays out cards; falls back to EmptyState
        ├── MemberCard/            # One person's card (grid or list variant)
        ├── MemberDrawer/          # Full profile slide-in panel
        ├── AddMemberModal/        # The Add/Edit form (one component, two modes)
        ├── ConfirmDialog/         # Generic "are you sure?" dialog (used for delete)
        ├── EmptyState/            # "No members found" state
        └── Toast/                 # Transient, click-to-dismiss notifications
```

**Rule followed throughout:** every component gets its own folder with exactly one `.jsx` and one `.css` file. No component is ever combined into another file, and no two components share a stylesheet. This is what makes it possible to delete or replace any single piece (say, swap `SortMenu` for a different control) without touching anything else.

<br/>

## 6. Architecture — how data flows through the app

This is the single most important thing to understand about the codebase, so it gets its own section instead of being buried in a file-by-file list.

### The core idea: one hook, one source of truth

Almost every serious React bug comes from the same root cause: the same piece of data being duplicated in two different `useState` calls that drift out of sync. Roster avoids this by putting **all directory data** — the member list, the search query, the active filter, the sort order, and who's being followed — inside **one custom hook**: `useTeamDirectory()`.

```js
// src/hooks/useTeamDirectory.js
export function useTeamDirectory() {
  const [members, setMembers] = useState(() => /* seed data */);
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [following, setFollowing] = useState(() => new Set());
  // ...derives `visibleMembers` and `stats` from the above with useMemo
  return { members: visibleMembers, stats, query, setQuery, /* ...everything */ };
}
```

`App.jsx` calls this hook once and destructures everything it needs. Every component below `App` receives only the specific pieces of state and the specific callbacks it needs as props — never the whole hook. This is the same pattern real production codebases use it to keep components independently testable: a `MemberCard` doesn't know or care that a hook exists, it just receives a `member` object and some callback props.

### Why derived state uses `useMemo`, not more `useState`

Notice that `visibleMembers` (the filtered + sorted list actually shown on screen) is **not** its own `useState`. It's computed with `useMemo` from `members`, `query`, `activeFilter`, `sortBy`, and `following`:

```js
const visibleMembers = useMemo(() => {
  let list = members;
  if (activeFilter === 'admins') list = list.filter((m) => m.isAdmin);
  else if (activeFilter === 'following') list = list.filter((m) => following.has(m.id));

  const q = query.trim().toLowerCase();
  if (q) list = list.filter((m) => /* matches name, role, city, country, or a skill */);

  const sorted = [...list];
  if (sortBy === 'name') sorted.sort((a, b) => a.name.localeCompare(b.name));
  else if (sortBy === 'role') sorted.sort((a, b) => a.role.localeCompare(b.role));
  else sorted.sort((a, b) => b.addedAt - a.addedAt);

  return sorted;
}, [members, activeFilter, query, following, sortBy]);
```

This matters for one concrete reason: **if the filtered list were its own state**, every time you added a member, deleted one, typed in the search box, or changed the sort order, you'd have to remember to manually re-run the filter/sort logic and re-set that state — and it's exactly the kind of thing that's easy to forget in one of five different event handlers, causing the UI to silently show stale data. With `useMemo`, the filtered-and-sorted list is *always* correct by construction, because it's recalculated automatically whenever any of its five dependencies change.

### The CRUD layer: one shape, three operations

Add, Edit, and Delete all funnel through the same small set of functions, so there's exactly one place that knows what a "member record" looks like:

```js
function toMemberRecord(formValues, existing = {}) {
  return {
    id: existing.id ?? makeId(),
    name: formValues.name.trim(),
    role: formValues.role.trim(),
    age: Number(formValues.age),
    isAdmin: formValues.isAdmin,
    skills: formValues.skills.split(',').map((s) => s.trim()).filter(Boolean),
    address: { city: formValues.city.trim(), country: formValues.country.trim() },
    addedAt: existing.addedAt ?? Date.now(),
  };
}
```

- **`addMember(formValues)`** calls `toMemberRecord(formValues)` with no `existing` object, so it generates a fresh `id` and `addedAt` timestamp, then prepends the result to the `members` array.
- **`updateMember(id, formValues)`** calls `toMemberRecord(formValues, existingMember)`, which *keeps* the original `id` and `addedAt` (via the `existing.id ?? ...` / `existing.addedAt ?? ...` fallback pattern) but overwrites every other field with the freshly-submitted values.
- **`removeMember(id)`** filters the member out of the array, and — this is the detail that's easy to miss — also removes them from the `following` Set, so you can't end up "following" someone who no longer exists in the directory.

Because Add and Edit share `toMemberRecord`, the same trimming and parsing rules (skills get split on commas and trimmed, age gets coerced to a `Number`, blank skills get filtered out) apply identically whether you're creating a new person or editing an existing one. That's also *why* `AddMemberModal` is a single component with an `open`/`member` prop pair instead of two separate `AddMemberModal` / `EditMemberModal` files — the form, the validation, and the submit shape are genuinely identical; only the initial values and the button label differ.

### UI state vs. data state — kept deliberately separate

`App.jsx` holds a second, smaller batch of state that has nothing to do with the hook:

```js
const [viewMode, setViewMode] = useState('grid');       // presentation only
const [addModalOpen, setAddModalOpen] = useState(false); // is a modal open?
const [editingMember, setEditingMember] = useState(null);
const [openProfileId, setOpenProfileId] = useState(null);
const [pendingDeleteMember, setPendingDeleteMember] = useState(null);
const [toastMessage, setToastMessage] = useState('');
```

None of this belongs inside `useTeamDirectory` on purpose. Whether the drawer is open, which modal is showing, and what the current toast message says are facts about *this specific render of the UI*, not facts about the team roster itself. Mixing the two would make the hook harder to reuse (imagine wanting the same directory data on a second page with a different layout — you'd inherit modal state you don't want) and harder to reason about.

### The click chain for one real interaction, end to end

To make the architecture concrete, here's exactly what happens when you click **Edit** inside a member's profile drawer:

1. `MemberDrawer` calls the `onEdit(member)` prop it was given, passing the full member object it's currently displaying.
2. In `App.jsx`, that prop is wired to an inline function: `onEdit={(member) => { setOpenProfileId(null); setEditingMember(member); }}` — it closes the drawer and stores which member is being edited.
3. React re-renders. `App.jsx` passes `open={Boolean(editingMember)}` and `member={editingMember}` to the *second* `<AddMemberModal>` instance (the app renders two: one permanently wired for "add," one for "edit").
4. `AddMemberModal` sees `member` is non-null, calls its internal `memberToForm(member)` helper to pre-fill every field, and swaps its heading/button text to "Edit …" / "Save changes".
5. On submit, it calls `onSubmit(form)` — which in `App.jsx` is `handleEditSubmit`, which calls `updateMember(editingMember.id, formValues)` from the hook, closes the modal, and shows a confirmation toast.

Every step is one prop or one small function — there's no global event bus, no context provider, and no prop drilled more than two levels. For an app this size, that's a deliberate choice: `useContext` or a state library (Redux, Zustand) would be solving a problem this app doesn't have yet (see [§12](#12-known-limitations--whats-next)).

<br/>

## 7. Deep dive — every file, explained

### `src/data/team.js`
Seven realistic seed members, each with a full field set (`name`, `role`, `age`, `isAdmin`, `skills`, `address: { city, country }`). This file has **no logic** — it's pure data — which is what lets `useTeamDirectory` map over it once on mount and stamp each seed record with a synthetic `addedAt` timestamp (staggered by a second per record) so that "Recently added" sorting has something meaningful to sort by even before you add anyone yourself.

### `src/utils/avatar.js`
Two small, pure functions:
- **`getInitials(name)`** — splits on whitespace, takes the first letter of the first word and the first letter of the last word, and uppercases them. `"Amara Chen"` → `"AC"`.
- **`getAvatarPaletteIndex(seed)`** — a tiny hand-rolled string hash (`hash = hash * 31 + charCode`, a common technique borrowed from Java's `String.hashCode()`) reduced into a 1–6 range with modulo. The same name **always** produces the same number, which is why "Amara Chen"'s avatar is reliably teal every time you reload the page, instead of a random color that flickers on every re-render — a subtle detail, but the kind of consistency real products get right and demos usually don't bother with.

### `src/utils/exportCsv.js`
`downloadMembersCsv(members, filename)` turns the array of member objects into actual CSV text — properly escaping any cell that contains a comma, quote, or newline by wrapping it in quotes and doubling internal quotes (the standard CSV escaping rule) — wraps that text in a `Blob`, creates a temporary `<a download>` element pointing at an object URL, clicks it programmatically, then cleans up both the link element and the object URL. This is a **real file download**, not a fake button — open the file in Excel or Google Sheets and it's valid, properly-quoted CSV.

### `src/hooks/useTeamDirectory.js`
Covered in depth in [§6](#6-architecture--how-data-flows-through-the-app). This is the file to read first if you want to understand the app.

### `src/App.jsx`
The composition root. Its job is narrow on purpose: call the hook, hold the small amount of UI-only state described above, define the handler functions that connect the two, and render every component exactly once, passing down only the props each one needs. It does not contain any filtering, sorting, or CSV logic itself — all of that is delegated, which keeps this file readable top to bottom.

### `src/components/Topbar/`
Sticky header containing the logo mark, the live search input (with a clear `×` button that only renders when there's a query), a result counter (`"3 of 7"`, shown only while searching), an **Export** button, and the **Add member** button. The search input is a fully controlled input — `value={query}` / `onChange={(e) => onQueryChange(e.target.value)}` — there is no local state inside `Topbar` at all; it's a "dumb" presentational component that reflects whatever `App` tells it to.

### `src/components/StatsRow/`
Four numbers — Members, Admins, Countries, Unique skills — each rendered as a `<button>`, not a `<div>`, specifically so they're keyboard-focusable and screen-reader-announced as interactive controls. Clicking one calls `onStatClick(item.id)`, and `App.jsx` decides what that means (reset filters, jump to the Admins tab, or show a breakdown toast).

### `src/components/FilterTabs/`
Three tabs — All / Admins / Following — implemented with `role="tablist"` / `role="tab"` / `aria-selected` for accessibility, and a single `active` string prop rather than three boolean props, so there's no way for two tabs to be "active" at once by mistake.

### `src/components/SortMenu/`
A custom dropdown (not a native `<select>`, to allow full styling control) that closes itself when you click anywhere outside it — implemented with a `ref` and a `mousedown` listener attached to `document` while the menu is open, and removed again when it closes, so there's no listener leaking after the component stops needing it.

### `src/components/ViewToggle/`
Two icon buttons (grid / list) using `aria-pressed` to communicate the current state to assistive tech. Purely presentational — it holds no state itself, it just reports clicks upward.

### `src/components/MemberGrid/`
Takes the already-filtered-and-sorted `members` array and either renders a grid of `MemberCard`s (or a stacked list, depending on the `layout` prop) or renders `EmptyState` if the array is empty. This is also where the "no results" logic lives — `MemberGrid` doesn't know or care *why* the list is empty (no search matches vs. an empty "Following" filter), it just reacts to length.

### `src/components/MemberCard/`
The single most interaction-dense component in the app. The whole `<article>` is clickable (`onClick={() => onOpen(member)}`, plus `role="button"` + `tabIndex={0}` + an `onKeyDown` handler for Enter/Space, so it's keyboard-accessible too) — but the Follow button and each skill chip need to act *independently* of that outer click. This is handled with a small `stop()` helper:

```js
const stop = (handler) => (event) => {
  event.stopPropagation();
  handler();
};
// used as: onClick={stop(() => onToggleFollow(member.id, name))}
```

Without `stopPropagation()`, clicking Follow would also bubble up and trigger the card's own `onClick`, opening the drawer at the same time you meant to just follow someone. This one function is what makes "everything is clickable" actually usable instead of chaotic.

### `src/components/MemberDrawer/`
The full-profile slide-in panel. Generates a plausible-looking email (`name.toLowerCase().replace(/[^a-z]+/g, '.') + '@company.com'`) and a human-readable "member since" date from the `addedAt` timestamp. Exposes four real actions — Follow/Unfollow, copy email, Edit, Delete — plus clickable skill chips that filter the directory and close the drawer in one action. Closes on **Escape** via a `keydown` listener scoped to exist only while the drawer is open.

### `src/components/AddMemberModal/`
One form, two jobs. The mode is entirely determined by one prop: `member`. When `member` is `null` (or omitted), it's in **add mode** — blank fields, "Add team member" heading, "Add member" button. When `member` is a real object, `memberToForm(member)` converts it back into form-shaped strings (numbers become strings for the input, the `skills` array is joined back into a comma-separated string) and the modal becomes **edit mode**. Validation happens on submit (`validate()` checks that name/role/city/country/skills are non-empty and age is a positive number) and populates an `errors` object that renders inline messages under each field — nothing submits silently or fails silently.

### `src/components/ConfirmDialog/`
A small, fully generic "are you sure?" dialog — it takes a `title`, a `description`, a `confirmLabel`, and `onConfirm`/`onCancel` callbacks. It has no idea it's currently being used for deleting a team member; it could be reused for any destructive confirmation in the app without modification.

### `src/components/EmptyState/`
Shown when a search or filter combination returns zero members. It reads the current `query` to give a specific, helpful message ("Nothing matches 'xyz'...") instead of a generic "no data" message, and offers a one-click way back (`Clear search`).

### `src/components/Toast/`
A single, app-wide toast (not a queue/stack — this app never needs more than one message on screen at once). Auto-dismisses after 2.6 seconds via `setTimeout`, but is also rendered as a real `<button>` so clicking it dismisses immediately. The `useEffect` cleanup (`return () => clearTimeout(timer)`) matters here: without it, if a *second* toast message replaced the first before the first's timer fired, you could end up with a stray timeout closing a toast that was never shown yet.

<br/>

## 8. Design system — the "Roster" visual language

All visual decisions are centralized as CSS custom properties in `src/index.css`, so nothing is a hardcoded color scattered across a dozen files.

| Token category | Examples | Reasoning |
|---|---|---|
| **Surface colors** | `--color-bg: #f6f7f9`, `--color-surface: #ffffff` | A near-white, slightly warm-gray background with pure-white cards creates depth through *contrast between two whites*, not shadows — the same trick Notion and Linear use, and it reads as more "engineered" than a heavy drop-shadow-everywhere look. |
| **The single accent color** | `--color-accent: #0f766e` (a deep teal) | Real, professional interfaces commit to **one** confident accent color and use it consistently for every primary action (Follow, Add member, focus rings) — not a rainbow of button colors. Teal was chosen specifically to avoid the extremely common "generic SaaS indigo/blue" look. |
| **Avatar palette** | 6 deterministic background/foreground pairs | Gives every person a distinct, consistent identity color without needing uploaded profile photos — a common pattern in tools like Linear and GitHub. |
| **Typography** | `Space Grotesk` for headings, `Inter` for body text, `JetBrains Mono` for counts/metadata | A geometric display face for headings signals "product," not "document" — while `Inter` keeps body copy highly legible at small sizes, and the monospace face on numbers (stat counts, result counters) is a small, deliberate touch that makes data feel like data. |
| **Spacing scale** | `--space-1` (4px) through `--space-7` (48px) | A consistent 4px-based scale means every gap, padding, and margin in the app is one of seven values — nothing is an arbitrary `17px` that only exists because it "looked right" in one spot. |
| **Motion** | `--duration-fast` (140ms) / `--duration-base` (220ms), `cubic-bezier(0.22, 1, 0.36, 1)` easing | Every hover, modal, and drawer transition uses the same two durations and the same easing curve, so the app has one consistent "feel" to its motion instead of every component inventing its own timing. |

<br/>

## 9. Getting started

**Prerequisites:** Node.js 18+ and npm.

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev
```

Open the URL Vite prints (typically `http://localhost:5173`). Changes to any file hot-reload instantly.

<br/>

## 10. Available scripts

| Command | What it does |
|---|---|
| `npm run dev` | Starts the Vite dev server with hot module reload |
| `npm run build` | Type-checks nothing (this is JS, not TS) and produces an optimized production bundle in `dist/` |
| `npm run preview` | Serves the production build from `dist/` locally, so you can sanity-check the real build before deploying |

<br/>

## 11. Deployment

The app builds to a fully static bundle — no server, no environment variables, no database — so it deploys anywhere that serves static files.

**Vercel / Netlify:**
1. Push this repository to GitHub.
2. Import it in Vercel or Netlify.
3. Build command: `npm run build`
4. Output directory: `dist`
5. Deploy. Every subsequent push redeploys automatically.

<br/>

## 12. Known limitations & what's next

Being upfront about this is part of building something that reads as genuinely professional rather than a project that pretends to be finished:

- **No persistence.** Everything lives in React state — refresh the page and you're back to the seed data. The natural next step is swapping `useTeamDirectory`'s `useState` calls for calls to `localStorage`, or better, a real backend (the hook's public interface — `addMember` / `updateMember` / `removeMember` — is already shaped like it could call an API instead of a `setState`, without changing a single component that consumes it).
- **No authentication.** "Admin" is just a badge on a data field right now, not an access-control system.
- **No automated tests.** The component boundaries (each one takes plain props, no component reaches into global state directly) were specifically kept simple to make unit testing straightforward to add later with React Testing Library.
- **No pagination.** Fine for a team of 7–200 people rendered client-side; a directory of thousands would want virtualization or server-side pagination.

<br/>

## 13. License

MIT — use it, fork it, learn from it, ship it.

<br/>

<p align="center">
  <img src="./footer.svg" alt="Roster footer" width="100%" />
</p>

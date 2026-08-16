---
name: pocketledger-ui
description: How to change the look of the PocketLedger web UI — colours, panels, typography, spacing, layout, tables, form controls, animation — and how to verify the change in a real browser before calling it done. Use this whenever the work touches web/src/theme, web/src/styles.css, or anything under web/src/components, and whenever the user asks for a restyle, a palette swap, a "make it prettier" pass, a new panel or field, or a layout move. The UI is gluestack-ui running on react-native-web, which quietly refuses a lot of ordinary CSS — reach for this before writing styles, not after they fail to apply.
---

# PocketLedger UI work

The web app is React through **gluestack-ui**, which renders **react-native-web** views. It looks
like the web and mostly is, but the style layer is React Native's: there is no cascade inside
components, no pseudo-elements, no transitions, and a handful of properties simply get dropped.
Knowing where the seam is saves most of the time this work takes.

## Where a change belongs

Work down this list and stop at the first layer that can express what you want. Going lower than
you need is how a palette ends up scattered across twelve files.

1. **`web/src/theme/palette.ts`** — the five brand colours, plus the derived shades and low-alpha
   veils built from them. A palette swap should be a one-file edit; if it isn't, something below
   is hard-coding a hex it should be reading from a token.
2. **`web/src/theme/config.ts`** — palette names mapped to *roles*: `$surface`, `$text`, `$hint`,
   `$line`, `$accent`, `$onAccent`, `$credit`, `$debit`, `$well`. Components should name the role,
   never the colour — `bg="$accent"` says why, `bg="#ee6c4d"` only says what.
3. **Component props and `sx`** — layout, spacing, font size, letter spacing, breakpoints. This is
   where most changes land.
4. **`web/src/styles.css`** — only what the RN style system genuinely cannot do (see below).

## What react-native-web will not do, and the way round it

RN styles have no pseudo-elements, no `transition`, no `backdrop-filter`, no multi-layer
`box-shadow`, no gradients as a background, and no `:last-child`. The escape hatch is already
established in this codebase: put a **data attribute** on the element and style it in `styles.css`.

```tsx
// Component: declare what the thing is.
<Box dataSet={{ panel: true }}>
```

```css
/* styles.css: say what that means visually. */
[data-panel] { backdrop-filter: blur(16px); border-radius: 16px; /* … */ }
```

`dataSet={{ fooBar: true }}` becomes `data-foo-bar="true"`, so selectors are kebab-case. The
attributes in use are `[data-panel]`, `[data-masthead]`, `[data-row]`, `[data-cta]` and
`[data-figure]`; the fade system uses `[data-fade]` / `[data-fade-step]`.

Two rules keep this from turning into a specificity war:

- **Don't set the same property in both places.** If `styles.css` owns a panel's background, the
  component must not also pass `bg`. RN emits its own class for every style prop, and which one
  wins depends on injection order — a coin flip you don't want to debug.
- **Merge, don't replace, when an element already has a dataSet.** The fade helper returns one:
  `dataSet={{ panel: true, ...fadeIn(step) }}`.

Other seams worth knowing:

- **Breakpoints** live in `sx` as `'@base'`, `'@sm'`, `'@md'`, `'@lg'` — e.g.
  `sx={{ '@base': { flexDirection: 'column' }, '@md': { flexDirection: 'row' } }}`. There is no
  media query in a stylesheet that can reach inside a gluestack component.
- **Focus rings**: RNW strips the UA outline from inputs. `styles.css` puts a coral one back on
  `:focus-visible` with `!important` — that flag is load-bearing, not laziness.
- **Hover/press states** that only change colour are fine in `sx` (`':hover': { bg: '$hover' }`).
  Anything that moves or eases belongs in CSS, because RN has no transitions.

## House conventions

- **Small files behind a barrel.** One concern per file, folder gets an `index.ts` that re-exports
  everything in it, importers name the folder. A new component means a new file, not another
  branch in an existing one.
- **Comments explain the why.** The codebase is written this way throughout: say what forced the
  choice ("the brush face ships one weight, so a heavier request only gets synthesised"), not what
  the line does.
- **Semantics before decoration.** Credit is sky, debit is coral, everywhere — the form's
  segmented control and the table's badges say the same thing in the same colour. Colour is
  emphasis, never the only telling: the badge keeps the word in it.
- **Animation** is a stagger ladder, not scattered micro-interactions. `animation/steps.ts` names
  the running order and `fade.css` owns the milliseconds. Add a step to both, in reading order.

## Verifying — the part that isn't optional

Never hand back a UI change you have only read. Run the bundled script first, then look at it:

```bash
.claude/skills/pocketledger-ui/scripts/check.sh
```

It runs typecheck, tests, and a production build across all three workspaces. The production
build matters because the dev server tolerates things webpack's production mode won't.

Then drive the real page with the browser tools:

1. `preview_start` the dev server (`npm run dev` at the root runs API on 4400 and UI on 5273
   together; if the ports are already taken the user is running it themselves — just open
   `http://localhost:5273`).
2. `read_console_messages` — **but a fresh tab is the only trustworthy console.** A failed hot
   reload mid-edit leaves an "Element type is invalid" error in the log that survives reloads and
   is long stale. If the page renders and responds, that error is history, not news.
3. Screenshot at a desktop width **and at 375px**. Narrow is where this UI breaks: five table
   columns do not fit a phone, and an overflowing pill will silently sit on top of the next
   column rather than wrap.
4. Confirm state changes you can't see in a still — computed styles via `javascript_tool` are the
   cheapest proof:
   `getComputedStyle(el).backgroundColor` for a selected segment, `outline` for a focus ring.
   For hover, move the mouse and screenshot in the *next* call; a computed-style read taken later
   may find the pointer has already left.
5. Leave the app as you found it: reload to clear any draft you typed into the form.

**Exercising the refusal path is safe and worth doing.** A debit larger than the balance posts,
comes back `{ok: false}`, and opens the notice dialog without touching the ledger — it is the only
way to see that dialog's styling. Posting a *valid* transaction writes to the user's real ledger
file, so don't do that to test a colour.

## A worked change

Adding an accent colour to a new control, end to end:

1. `palette.ts` — add the colour (or, better, find that it's already one of the five).
2. `config.ts` — give it a role name that says what it's for, not what it looks like.
3. The component — `bg="$role"`, plus `sx` for size and spacing.
4. `styles.css` — only if it needs a transition, a shadow, a blur, or a pseudo-element; if so,
   tag the element with a data attribute and drop the equivalent style props from the component.
5. `check.sh`, then browser: desktop screenshot, 375px screenshot, console from a fresh tab,
   computed style for any state you can't photograph.

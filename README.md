# Digital Systems & Binary Numbers — Interactive Course Site

An interactive, single-page study site built from Chapter 1 of a Digital Logic
Design course (number systems, complements, signed binary, BCD/weighted codes,
ASCII, parity, Hamming code, and Gray code). Vanilla HTML/CSS/JS — no build
step, no framework, no external dependencies or CDN calls.

## 1. Project structure

```
digital-systems-course/
├── index.html                   Single HTML shell (all pages render into #page-content)
├── css/
│   └── style.css                Design system + every component + responsive rules
├── js/
│   ├── utils.js                 Pure binary/number-system math (DLUtils) — no DOM access
│   ├── data.js                  Chapter content, structured as topics → content "blocks"
│   ├── quizData.js               26 quiz questions covering every topic
│   ├── examData.js               16 real midterm exam questions (5 sittings) + full answers
│   ├── aboutData.js              About-page facts (name/department/ID/university) + socials
│   ├── progress.js               localStorage-backed topic-completion tracking (Progress)
│   ├── search.js                 Search index (topics + exam Q&A) + overlay UI (Search)
│   ├── quiz.js                   Quiz page: filter → question flow → score screen (Quiz)
│   ├── app.js                    Icons, router, shell, content-block renderer (App)
│   └── tools/
│       ├── numberConverter.js     Base converter (decimal/binary/octal/hex)
│       ├── complementTool.js      1's/2's complement + subtraction-via-complement
│       ├── signedNumberTool.js    Signed-number explorer + 2's-complement adder
│       ├── codesTool.js           BCD/Excess-3/2421/Biquinary lookup + BCD addition
│       ├── asciiTool.js           ASCII encoder/decoder with optional parity
│       ├── parityTool.js          Parity generator + bit-flip error simulator
│       ├── hammingTool.js         Hamming(7,4) encoder, error injector, corrector
│       └── grayCodeTool.js        Binary ↔ Gray code converter
└── README.md
```

Pages: Home · 11 chapter Topics · Interactive Tools hub · Practice/Quiz · **Exam Q&A**
(16 real midterm questions, accordion-style, searchable) · References · **About**
(name/department/ID/university + LinkedIn/Instagram, also linked in the header).

No other files are required. There is no `package.json` and nothing to `npm
install` — it's plain static HTML/CSS/JS.

## 2. Running it locally

Because the page loads its JS/CSS via relative `<script src>`/`<link>` tags,
opening `index.html` directly with `file://` will be blocked by the browser's
CORS rules in some browsers. Serve it over local HTTP instead — pick whichever
you have installed:

```bash
# Python 3 (usually preinstalled on macOS/Linux)
cd digital-systems-course
python3 -m http.server 8000

# Node (no install needed, npx pulls it on first run)
npx serve digital-systems-course

# VS Code
# Right-click index.html → "Open with Live Server" (Live Server extension)
```

Then open `http://localhost:8000` (or whatever port/URL your tool prints).

## 3. Deploying to GitHub Pages

1. Create a new GitHub repository and push this folder's contents to it:
   ```bash
   cd digital-systems-course
   git init
   git add .
   git commit -m "Digital Systems & Binary Numbers course site"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo>.git
   git push -u origin main
   ```
2. On GitHub: **Settings → Pages**.
3. Under **Build and deployment → Source**, choose **Deploy from a branch**.
4. Under **Branch**, choose `main` and folder `/ (root)`, then **Save**.
5. GitHub Pages will publish at `https://<your-username>.github.io/<your-repo>/`
   within a minute or two (check the "Pages" section of the repo for the exact
   URL and build status).

No further configuration is needed — there's no server-side code, no
environment variables, and the hash-based routing (`#/topic/...`) works
correctly on GitHub Pages without any special rewrite rules.

## 4. How each major feature works

**Content & rendering.** `data.js` holds the entire chapter as an array of
topics, each with an ordered list of typed "blocks" (`lead`, `heading`, `p`,
`list`, `definition`, `table`, `example`, `formula`, `note`, `keypoints`,
`mistakes`, `practice`, `tool`). `app.js` has one renderer per block type, so
adding or reordering content only ever means editing `data.js` — the page
structure, styling, and navigation regenerate automatically.

**Routing.** The URL hash (e.g. `#/topic/hamming-code/hamming-detect`) is the
single source of truth for what's on screen. `app.js` listens for
`hashchange`, parses the hash into `{ page, topicId, anchor }`, and re-renders
`#page-content` accordingly. This is what makes Home/Topics/Tools/Quiz/
References, the sidebar's active-state highlighting, and deep-linkable search
results all work with zero server support.

**Interactive tools.** Each file in `js/tools/` exposes
`Tools.<name>.mount(containerElement, mode)`. When the renderer hits a `tool`
block it inserts an empty container `<div>` and calls that tool's `mount()`
function, which owns everything inside it (its own inputs, live recompute on
`input`/`click`, and all math — via the shared, unit-tested helpers in
`utils.js`). Tools never modify data outside their own container, so multiple
tools (or two modes of the same tool, like the Signed Number Explorer and its
Adder) can coexist safely on one page.

**Search.** On startup, `search.js` walks every block of every topic once and
builds a flat in-memory index (title, breadcrumb, searchable text, and a
route/anchor to jump to). Typing in the search overlay (triggered by the
header button or the `/` key) scores index entries by term overlap and title
match, and Enter/click navigates straight to that heading, definition,
example, or tool.

**Progress tracking.** `progress.js` stores a `Set` of completed topic IDs in
`localStorage` under `dls-progress-v1`. The "Mark as complete" button on each
topic, the sidebar checkmarks, the sidebar progress bar, and the header
progress chip are all just different views of the same `Progress.isComplete()`
/ `Progress.getPercent()` calls, refreshed after every toggle.

**Quiz.** `quiz.js` is a small state machine (`intro → active → finished`)
driven entirely by `quizData.js`. The intro screen lets you filter to specific
topics; the active screen shows one question at a time with instant
right/wrong feedback and an explanation; the score screen shows a percentage
ring and a per-topic breakdown, with a one-click retake.

**Light/dark mode.** All color is expressed as CSS custom properties on `:root`
and overridden under `[data-theme="dark"]`. The toggle button just flips
`document.documentElement`'s `data-theme` attribute and remembers the choice
in `localStorage`; on first visit it defaults to the OS-level
`prefers-color-scheme`.

## 5. Content accuracy

Every definition, table, and worked example is transcribed from the uploaded
chapter. Where the source poses a two-part problem and only fully works one
part on the slide (e.g. the reverse subtraction in "Binary Complements"), the
missing part is completed using the exact same method taught in that section
— you can verify it yourself with the matching interactive tool. All binary
arithmetic in this project (complements, signed addition, BCD correction,
Hamming syndromes, Gray-code XOR chains) was cross-checked against the source
material's own worked numbers before being wired into the UI.

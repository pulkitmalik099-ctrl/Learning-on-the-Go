# Learning on the Go

A lightweight, zero-dependency flashcard hub for revising any topic — open it in any browser, online or offline.

No install, no build step, no database, no internet required. The whole thing is plain HTML, CSS, and JavaScript. Double-click the home page to study locally, or use the GitHub Pages link to study from anywhere.

**Live site:** https://pulkitmalik099-ctrl.github.io/Learning-on-the-Go/

---

## Features

- Login passphrase gate (re-prompts after 3 minutes of inactivity)
- Flip cards to reveal answers — click, tap, or `Space`
- Spaced repetition — rate each card **Again / Good / Easy** after flipping; cards are scheduled for future review
- Shuffle the deck to test out of order (`S`)
- Mark cards as Known to remove them from rotation (`K`)
- Per-deck progress bar and stats (Known · Due today · Total)
- In-deck search to filter cards by keyword
- Cross-deck search on the home page
- Dark mode toggle — persists across sessions
- Export / Import progress as JSON (sync between devices)
- Works fully offline — double-click `index.html`, no server needed
- Keyboard shortcuts: `← →` navigate · `Space` flip · `S` shuffle · `K` mark known · `1/2/3` rate

---

## File structure

```
Learning-on-the-Go/
  index.html                    ← home page — open this to start
  get-started-with-claude.html  ← Deck 1
  lets-learn-claude-code.html   ← Deck 2
  claude-cowork.html            ← Deck 3
  app.js                        ← all shared logic
  style.css                     ← all shared styling
  search-index.js               ← card data mirror for cross-deck search
  README.md
  .gitignore
```

---

## Running it

- **Local (offline):** double-click `index.html` — opens in your browser, works with no internet
- **Online:** visit https://pulkitmalik099-ctrl.github.io/Learning-on-the-Go/

**Passphrase:** `Napster you are the best` (any capitalisation)

---

## How to update card content

Card data lives directly inside each deck's `.html` file (and mirrored in `search-index.js` for the home search). To update:

1. Edit the `CARDS` array in the relevant `.html` file
2. Mirror the same change in `search-index.js`
3. Push to GitHub — the live site updates in ~1–2 minutes; users get new cards on next refresh

**Safe update rule:** always **append** new cards to the end of the array. Inserting or removing cards in the middle shifts indices and corrupts saved progress.

---

## Adding a new deck

1. Copy any existing deck `.html` and rename it, e.g. `system-design.html`
2. Set `DECK_ID` and `CARDS` at the bottom of the new file
3. Add an entry to `SEARCH_INDEX` in `search-index.js`
4. Add a topic card in `index.html`
5. Push — done

---

## Export / Import (cross-device progress sync)

- **Export:** downloads a `.json` snapshot of all your progress — which cards are Known and each card's spaced-repetition due date
- **Import:** upload a previously exported file to restore that progress on another device or browser
- Use this to move progress from laptop → phone (or vice versa)

---

## Deploying to GitHub Pages

1. Go to repo **Settings → Pages**
2. Source: **Deploy from a branch → main → / (root) → Save**
3. Wait ~2 minutes — live at `https://<username>.github.io/Learning-on-the-Go/`

---

## Card reference

### Deck 1 — Get Started with Claude
*Based on the [Claude 101 course](https://anthropic.skilljar.com/claude-101) · 25 cards*

| # | Question | Answer |
|---|----------|--------|
| 1 | What is Claude? | An AI assistant made by Anthropic, designed to be helpful, harmless, and honest. It can write, analyse, code, research, and hold extended conversations. |
| 2 | What are the three pillars of Claude's design? | Helpful, Harmless, and Honest — Claude is built to be useful to users while avoiding harm and being truthful. |
| 3 | What is a prompt? | Text you send to Claude to start or continue a conversation. A good prompt is clear, specific, and provides enough context for Claude to give a useful response. |
| 4 | How do you get better results from Claude? | Be specific about your goal, provide relevant context, specify the format you want, and iterate — ask Claude to revise or expand if the first answer isn't quite right. |
| 5 | What are the three main modes in the Claude desktop app? | Chat (conversational Q&A), Cowork (collaborative document creation), and Code (coding assistance and debugging). |
| 6 | What is Chat mode used for? | Open-ended conversation — asking questions, brainstorming, summarising content, getting explanations, or any general task. |
| 7 | What is Cowork mode in the Claude desktop app? | A collaborative workspace where you and Claude work together on documents, drafts, or structured content in real time. |
| 8 | What is Code mode in the Claude desktop app? | A specialised environment for writing, reviewing, debugging, and explaining code across many programming languages. |
| 9 | What are Projects in Claude? | A way to organise related conversations, files, and instructions in one place so Claude has consistent context across multiple sessions on the same topic. |
| 10 | What is the benefit of using Projects? | Claude remembers the context, uploaded documents, and custom instructions you set for that project — no need to re-explain your situation each session. |
| 11 | What are Artifacts in Claude? | Standalone, reusable outputs Claude creates — such as a document, code file, table, or diagram — that you can copy, download, or build on. |
| 12 | How do you create an Artifact? | Ask Claude to produce a self-contained output (e.g. "write a Python script" or "create a report"). Claude renders it in a separate panel so you can work with it independently. |
| 13 | What are Skills in Claude? | Pre-built or custom capabilities that extend what Claude can do — for example, browsing the web, running code, or following a specific workflow you've defined. |
| 14 | What does "Connecting your tools" mean in Claude? | Integrating Claude with external apps and services (calendar, email, Slack, etc.) so it can retrieve information and take actions across your workflow. |
| 15 | What is Enterprise Search in Claude? | A feature that lets Claude search across your organisation's connected data sources (documents, wikis, emails) to find relevant information and include it in answers. |
| 16 | What is Research Mode in Claude? | A deep-dive capability where Claude performs multiple searches and synthesises information from many sources to produce a thorough, cited research report. |
| 17 | When should you use Research Mode? | For complex questions that benefit from broad information gathering — competitive analysis, literature reviews, market research, or any topic where depth matters. |
| 18 | What is the context window? | The maximum amount of text (your messages + Claude's replies + any files) that Claude can process in one conversation. Information outside the window is not visible to Claude. |
| 19 | How can marketers use Claude? | To draft campaigns, write copy, analyse customer feedback, and brainstorm ideas — prompting Claude with role-specific context for tailored output. |
| 20 | How can developers use Claude? | For code generation, debugging, code review, writing tests, explaining legacy code, and getting documentation — in Code mode or via the API. |
| 21 | How can executives or managers use Claude? | To summarise reports, prepare talking points, draft emails, analyse data, and get quick briefings — saving time on high-volume reading and writing tasks. |
| 22 | What are some everyday use cases for Claude? | Writing and editing, summarising long documents, brainstorming, answering questions, drafting emails, explaining complex topics, and coding assistance. |
| 23 | What should you do when Claude's answer is not quite right? | Iterate — tell Claude what was off ("too long", "wrong tone", "focus on X instead") and it will revise. Good prompting is a conversation, not a one-shot command. |
| 24 | Does Claude require an Anthropic account to take the Claude 101 course? | No — the course on Skilljar is free to access with just an email registration, separate from an Anthropic account. |
| 25 | What can you earn at the end of the Claude 101 course? | A certificate of completion from Anthropic, demonstrating proficiency with Claude's core features and everyday use cases. |

---

### Deck 2 — Let's Learn Claude Code
*Based on the [Claude Code 101 course](https://anthropic.skilljar.com/claude-code-101) · 25 cards*

| # | Question | Answer |
|---|----------|--------|
| 1 | What is Claude Code? | An AI coding agent — not just a chat tool — that can autonomously read files, write code, run commands, and operate across your entire codebase inside your terminal or IDE. |
| 2 | How is Claude Code different from a chat-based AI tool? | A chat tool only converses. Claude Code is an agentic system: it takes actions — reading files, running tests, editing code, executing commands — in an autonomous loop until the task is done. |
| 3 | What is the agentic loop? | The core mechanism where Claude Code repeatedly reasons, calls tools (read file, run command, edit code), observes the result, and decides the next step — cycling until the goal is achieved. |
| 4 | What platforms and editors does Claude Code support? | Terminal (any shell), VS Code, JetBrains IDEs, the Claude desktop app, and a web-based interface. |
| 5 | What are the prerequisites for using Claude Code? | Basic familiarity with a code editor and the command line, plus a Claude Pro, Max, or Enterprise subscription — or an Anthropic API key. |
| 6 | What is the four-phase Claude Code workflow? | Explore → Plan → Code → Commit. First understand the codebase, then plan the approach, then implement, then commit with a clear message. |
| 7 | What happens in the Explore phase? | Claude Code reads and searches the codebase to build context — understanding file structure, existing patterns, dependencies, and relevant code before touching anything. |
| 8 | What happens in the Plan phase? | Claude Code (or you in Plan Mode) lays out the steps to complete the task — which files to change, what logic to add, and in what order — before writing any code. |
| 9 | What is Plan Mode in Claude Code? | A mode where Claude Code outlines its intended approach and waits for your approval before executing any actions, giving you a chance to redirect or refine the plan. |
| 10 | What happens in the Code phase? | Claude Code implements the plan — creating or editing files, writing code, and running commands — guided by what it learned in Explore and decided in Plan. |
| 11 | What happens in the Commit phase? | Claude Code stages changes and creates a descriptive git commit, summarising what was changed and why, completing the development loop. |
| 12 | What is "approval mode" in Claude Code? | A setting where Claude Code asks for your confirmation before executing each action (file write, command run, etc.), giving you fine-grained control over what it does. |
| 13 | What is auto-accept in Claude Code? | A mode that lets Claude Code execute actions without pausing for approval each time — useful for trusted, well-understood tasks where you want uninterrupted flow. |
| 14 | What is the CLAUDE.md file? | A markdown file in your project root that gives Claude Code persistent memory about the project — conventions, architecture, commands to run, things to avoid — loaded automatically each session. |
| 15 | Why is CLAUDE.md useful? | Without it, you must re-explain project context every session. CLAUDE.md lets Claude Code know your stack, coding standards, test commands, and any project-specific rules from the start. |
| 16 | What are Subagents in Claude Code? | Delegated agents spun up to handle a sub-task independently, so the main agent's context window stays focused and uncluttered while parallel or isolated work is done separately. |
| 17 | What are Skills in Claude Code? | Pre-built or custom slash-command capabilities that extend Claude Code's default behaviour — for example /code-review, /simplify, or a custom workflow you define. |
| 18 | What are MCP Servers in Claude Code? | Model Context Protocol servers that connect Claude Code to external tools and data sources — databases, APIs, services — so it can retrieve live information or trigger external actions. |
| 19 | What are Hooks in Claude Code? | Shell commands that run automatically at specific events (e.g. before a tool call, after a commit) to enforce formatting, block certain commands, or trigger notifications deterministically. |
| 20 | What is the /compact command? | Optimises token usage by summarising older parts of the conversation, reducing context window consumption so you can keep working on long tasks without hitting the limit. |
| 21 | What is the /clear command? | Removes sections of context from the conversation — useful for wiping irrelevant history and giving Claude Code a cleaner working state for a new sub-task. |
| 22 | What is the /context command? | Shows the current state of the context window — what Claude Code can currently "see" — so you can understand what information is in scope. |
| 23 | What are Tools & Permissions in Claude Code? | The system that controls which actions Claude Code is allowed to take — reading files, running shell commands, making network requests — configurable per project or globally. |
| 24 | How does Claude Code help with code review? | It can read a diff or branch, identify bugs, spot style issues, suggest simplifications, and even post inline comments on a GitHub PR — all from the terminal. |
| 25 | What is context window management and why does it matter in Claude Code? | Managing how much text is in the active conversation. A full context window slows performance and can cause Claude Code to lose earlier details — /compact and /clear help keep it efficient. |

---

### Deck 3 — Introduction to Claude Cowork
*Based on the [Introduction to Claude Cowork course](https://anthropic.skilljar.com/introduction-to-claude-cowork) · 25 cards*

| # | Question | Answer |
|---|----------|--------|
| 1 | What is Claude Cowork? | A mode where Claude works directly with your files, folders, and apps — reading, editing, and producing real outputs on your machine — rather than just having a conversation. |
| 2 | What is the core difference between Claude Chat and Claude Cowork? | Chat is conversational — you exchange messages. Cowork is a working session — you assign a task, Claude plans and executes it on your actual files and apps, and you steer along the way. |
| 3 | What are "real outputs" in Cowork? | Actual changes to your files, folders, and apps — edited documents, created spreadsheets, filled forms, organised folders — not just text responses you have to copy-paste yourself. |
| 4 | What happens when you assign a task in Cowork? | Claude reads the task and context, forms an execution plan, carries out the steps (reading, editing, producing outputs), and pauses for your direction when needed. |
| 5 | What does "course correction" mean in Cowork? | Steering Claude mid-task — providing feedback, clarifying intent, or redirecting steps while a multi-step job is in progress, rather than only reviewing the final output. |
| 6 | How does context influence Claude's planning in Cowork? | The more context Claude has about your goal, preferred style, and past work, the more accurately it plans the steps and produces outputs that match what you actually need. |
| 7 | What is standing context in Cowork? | Persistent instructions or project information that Claude carries into every Cowork session, so you don't have to re-explain your preferences, team conventions, or project background each time. |
| 8 | How do you establish standing context in Cowork? | Through global instructions (applied to all sessions) and Projects (applied to a specific topic or workflow), both of which Claude reads automatically when a session starts. |
| 9 | What are global instructions in Cowork? | Persistent preferences you set once that apply to every Cowork session — e.g. always use British English, never delete originals, save outputs to a specific folder. |
| 10 | What are Projects in Cowork? | Scoped workspaces with their own standing context, files, and instructions for a specific ongoing task or team — Claude uses that project's context whenever you work within it. |
| 11 | What are Skills in Cowork? | Saved, reusable task workflows you define — e.g. "format this report in our template" or "summarise meeting notes and email the team" — that Claude can execute on command. |
| 12 | What are Plugins in Cowork? | Extensions that encode team expertise and procedures into Cowork, enabling Claude to follow your organisation's specific processes automatically without being re-instructed each time. |
| 13 | How do you validate custom Skills and Plugins? | Run them on test inputs, review the outputs against your expected results, and refine the instructions until Claude consistently performs the task correctly before sharing with the team. |
| 14 | How do you share Skills or Plugins with teammates? | Export and distribute the build so team members can install the same skill or plugin, ensuring everyone benefits from the same encoded workflow without rebuilding it individually. |
| 15 | How does Cowork integrate with Chrome? | A Chrome extension lets Claude access and interact with web-based apps directly in the browser — reading page content, filling forms, navigating, and automating browser-based tasks. |
| 16 | How does Cowork integrate with Microsoft 365? | Claude can read and edit Word documents, Excel spreadsheets, Outlook emails, and other M365 files — treating them as first-class working documents rather than attachments to describe. |
| 17 | What platforms does Cowork support? | Local files and folders on your machine, Chrome browser (via extension), Microsoft 365 applications, and additional platforms through plugins. |
| 18 | What are best practices for collaborative safety in Cowork? | Review Claude's plan before it executes destructive actions, keep backups of important files, validate skills before sharing, and set clear instructions about what Claude should never do. |
| 19 | How should you manage longer-running tasks in Cowork? | Break them into phases, review outputs at each milestone, use course corrections to stay aligned, and avoid giving Claude an overly broad mandate without checkpoints. |
| 20 | What is the goal of a first Cowork task? | To build foundational confidence — pick a low-stakes, self-contained task so you can observe how Claude plans, executes, and handles your files before trusting it with critical work. |
| 21 | How do you get faster, higher-quality results in Cowork? | Invest in standing context (global instructions + projects), build reusable skills for repeated workflows, and give precise upfront context so Claude plans accurately from the start. |
| 22 | What is the typical progression for a new Cowork user? | Initial launch → first end-to-end task → learning to steer with course corrections → customising with instructions and skills → integrating plugins for team workflows → confident daily use. |
| 23 | Why is upfront context important in Cowork vs Chat? | In Chat a clarification mid-conversation is easy. In Cowork, Claude may have already edited files by the time you clarify — good upfront context prevents costly mid-task rework. |
| 24 | What kinds of files can Cowork read and edit? | Documents (Word, PDF, text), spreadsheets (Excel, CSV), emails, folders, and web content in Chrome — essentially any file type your machine can open that a plugin or integration covers. |
| 25 | What makes Cowork suitable for team use? | Shareable skills and plugins encode team expertise once and deploy it to everyone, so the whole team benefits from consistent, high-quality automated workflows without individual setup. |

# MOHA Learning · MP0233

A static learning website in Catalan for 1r de Grau Mitjà, Sistemes microinformàtics i xarxes. It includes all 34 academic sections from the supplied learning guide, 44 practice activities, fictional learning simulations, review modes and a 20-question exam.

## Local review

Open `index.html` in Edge or Chrome. For stable browser storage during development, prefer a local HTTP server:

```powershell
Set-Location 'D:\DETLENG2\moha-deteleng'
python -m http.server 8000 --bind 127.0.0.1
```

Then open `http://127.0.0.1:8000/`. Stop the server with Ctrl+C. No build step, dependencies, account, backend or API is needed for the website.

## Learning and progress

- Every lesson has a practice activity. Complete all its activities correctly before marking it complete.
- Practice provides two hints, then the answer and its explanation after a third unsuccessful attempt. You can retry immediately.
- Errors are retained until two correct answers in separate practices. A new incorrect answer resets that concept’s recovery counter.
- Progress, answers, errors, exam results and fictional calendar events are stored under `moha-learning-v1` in localStorage. Data is specific to the device, browser and origin. Progress on a file URL does not automatically transfer to localhost or the eventual public domain.
- The reset control opens a confirmation dialog and clears the learning data. No browser data outside this app’s storage key is deleted.
- A current exam stays in memory while the page is open; submitted results persist. Refreshing during an exam starts a new attempt. This is stated in the exam interface.
- Scoring: 20 questions, one point per fully correct question. Matching and ordering require the complete answer. No answers or hints appear before submission.
- The 5-minute review is an approximate short practice sequence, with no enforced timer.
- Calendar, inbox and email composer simulations are fictional. No Google integration or real messages are sent.

## Content

The supplied guide is the academic authority. Source references and internal implementation notes are excluded from student pages. Calendar permissions are labelled **Ampliació del material** as requested. Academic terminology and source-specific distinctions are retained, including the stated iCal/.ics distinction and Gmail note.

## Files

`index.html`, `CNAME`, `assets/favicon.svg`, `assets/css/styles.css`, `assets/js/content.js`, `assets/js/quizzes.js`, `assets/js/app.js`, `tests/qa.cjs`, `tests/run.cjs`, `.gitignore`, `README.md`, `CONTENT-AUDIT.md`, `COMPLETION-REPORT.md`.

The website only needs index.html, CNAME and assets. Tests and Markdown files are maintainer documentation.

## Verification

```powershell
node tests/run.cjs
```

The test runner requires Playwright and Edge. It first tries a local Playwright installation, then the bundled runtime on this computer. Set `MOHA_BROWSER_PATH` for another Chromium browser and `MOHA_QA_OUTPUT` for a different results folder. Tests use isolated browser storage; they do not change your normal browser’s progress.

## Repository and domain

The requested local folder was empty and had no `.git` directory when website work began. Git has now been initialized as requested. Local `main` tracks `origin/main` at `https://github.com/Navid-Ishaq/moha-deteleng.git`, and the existing remote history has been fetched. Website changes remain uncommitted for manual review and push. The local CNAME is `moha.deteleng.com`. DNS and GitHub Pages settings were not changed. When you choose to publish, ensure the domain configuration matches that name.

No Git commit, push, pull request, publishing or deployment was performed.

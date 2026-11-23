# MOHA Learning · Guide to adding courses (Curso 1, Curso 2, ...)

The homepage `#cursos` lists courses, with each course linking to its own list of lessons and quizzes. The existing MP0233 content and `moha-learning-v1` progress are preserved under **Curso 1**. The new GPU quiz is at `courses/curso-1/gpu-quiz.html` and is shown inside the website, with an optional full-screen link.

## Add another quiz to Curso 1

1. Put a standalone `.html` quiz in `courses/curso-1/`, for example `cpu-quiz.html`. If your quiz needs images or CSS, include them in the repository at the paths referenced by its HTML.
2. Edit `assets/js/courses.js`, inside the `items` array of `id: "1"`. Add an object:

```js
{
  id: "cpu",
  title: "CPU · El processador",
  kind: "Quiz interactiu",
  description: "Preguntes sobre la CPU",
  type: "embedded",
  file: "courses/curso-1/cpu-quiz.html"
}
```

Use unique `id` values containing letters, numbers and hyphens. Remember to put a comma between objects. No build step is required.

## Activate Curso 2

The catalog already contains `id: "2"` with an empty `items` list. Create `courses/curso-2/`, copy the new HTML quiz into that folder, and append an item to Curso 2's `items`. It appears automatically on the Cursos page.

To add Curso 3, copy a whole course object in `assets/js/courses.js`, give it the unique `id: "3"`, its name, and an `items` array.

## Publish (Windows)

1. Open `D:\DETLENG2\moha-deteleng` in File Explorer.
2. Double-click `push.cmd` or run it from PowerShell. It shows Git status and asks for confirmation before committing and pushing.
3. To test locally, double-click `index.html`, or run `python -m http.server 8000` and open `http://localhost:8000/`.

The `push.cmd` script checks that this directory has a `.git` repository. It does **not** create a new Git repository or overwrite remote history. If your local working folder was extracted from a GitHub ZIP without `.git`, see the installation steps in `PATCH-INSTALL.md`.

The GPU quiz is self-contained (embedded pictures, no network calls). Its practice and test selections remain in page memory while it is open; they are not saved to a cloud account.

**Domain check:** `CNAME` is unchanged (`moha.detleng.com`) from your uploaded repository. Other metadata references `moha.deteleng.com`. Verify which spelling is correct before enabling custom-domain GitHub Pages. This patch deliberately does not change your DNS.

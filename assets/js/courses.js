// MOHA Learning · editable course catalog.
// Add course objects and items here. Do not change the existing MP0233 lesson content.
// item.type = "native" to enter the original MP0233 site, or "embedded" to open a local HTML quiz.
window.MOHA_COURSES = [
  {
    id: "1",
    name: "Curso 1",
    subtitle: "1r curs · Sistemes microinformàtics i xarxes",
    description: "Materials, lliçons i qüestionaris del primer curs. Anirem afegint nous temes aquí.",
    items: [
      {
        id: "mp0233",
        title: "MP0233 · Aplicacions ofimàtiques",
        kind: "Curs complet",
        description: "34 lliçons, 44 activitats, repàs, anti-errors i examen de 20 preguntes.",
        type: "native",
        hash: "#inici"
      },
      {
        id: "gpu",
        title: "GPU · La targeta gràfica",
        kind: "Quiz interactiu · 78 preguntes",
        description: "Pràctica amb imatges, mode test, mapa de preguntes i tema clar/fosc. Daner i Moha.",
        type: "embedded",
        file: "courses/curso-1/gpu-quiz.html"
      }
      // Future item example:
      // ,{ id: "cpu", title: "CPU · El processador", kind: "Quiz",
      //    description: "Preguntes i pràctiques", type: "embedded", file: "courses/curso-1/cpu-quiz.html" }
    ]
  },
  {
    id: "2",
    name: "Curso 2",
    subtitle: "2n curs · Properament",
    description: "Aquest espai està preparat per a les lliçons i quizzes del segon curs.",
    items: []
  }
];

const $ = (id) => document.getElementById(id);
let correctCount = 0, answered = 0, total = 0;

$("go").addEventListener("click", async () => {
  const notes = $("notes").value.trim();
  if (notes.length < 50) {
    $("status").className = "status error";
    $("status").textContent = "Add at least a few sentences of notes first.";
    return;
  }
  $("go").disabled = true;
  $("status").className = "status";
  $("status").textContent = "Writing your quiz…";
  $("quiz").innerHTML = "";

  try {
    const res = await fetch("/api/quiz", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notes, num_questions: Number($("count").value) }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(typeof data.detail === "string" ? data.detail : "Request was rejected. Check your notes length.");
    renderQuiz(data);
    $("status").textContent = "";
  } catch (err) {
    $("status").className = "status error";
    $("status").textContent = err.message;
  } finally {
    $("go").disabled = false;
  }
});

function renderQuiz({ title, questions }) {
  correctCount = 0; answered = 0; total = questions.length;
  const quiz = $("quiz");
  quiz.innerHTML = `<h2></h2><p class="score" id="score">0 of ${total} answered</p>`;
  quiz.querySelector("h2").textContent = title;

  questions.forEach((q, i) => {
    const card = document.createElement("article");
    card.className = "sheet q";
    card.innerHTML = `<span class="q-num">${i + 1}</span><p></p><div class="choices"></div>`;
    card.querySelector("p").textContent = q.question;
    const box = card.querySelector(".choices");

    q.choices.forEach((text, ci) => {
      const btn = document.createElement("button");
      btn.className = "choice";
      btn.textContent = `${"ABCD"[ci]}. ${text}`;
      btn.addEventListener("click", () => answer(card, q, ci));
      box.appendChild(btn);
    });
    quiz.appendChild(card);
  });
}

function answer(card, q, picked) {
  const btns = card.querySelectorAll(".choice");
  btns.forEach((b, i) => {
    b.disabled = true;
    if (i === q.answer_index) b.classList.add("correct");
    else if (i === picked) b.classList.add("wrong");
  });
  if (picked === q.answer_index) correctCount++;
  answered++;
  const ex = document.createElement("p");
  ex.className = "explain";
  ex.textContent = q.explanation;
  card.appendChild(ex);
  $("score").textContent = answered === total
    ? `You got ${correctCount} of ${total} right`
    : `${answered} of ${total} answered`;
}
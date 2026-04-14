const questions = [
  {
    q: "Your team missed a deadline. What do you do?",
    options: [
      { text: "Take responsibility", type: "safe" },
      { text: "Blame others", type: "risky" },
      { text: "Stay silent", type: "neutral" }
    ]
  },
  {
    q: "You have ₹500 left for a week.",
    options: [
      { text: "Budget strictly", type: "safe" },
      { text: "Spend freely", type: "risky" },
      { text: "Borrow money", type: "neutral" }
    ]
  },
  {
    q: "You are late to a meeting.",
    options: [
      { text: "Apologize", type: "safe" },
      { text: "Make excuse", type: "risky" },
      { text: "Ignore", type: "neutral" }
    ]
  },
  {
    q: "You find a bug before deployment.",
    options: [
      { text: "Fix it", type: "safe" },
      { text: "Ignore it", type: "risky" },
      { text: "Inform team", type: "neutral" }
    ]
  },
  {
    q: "You receive unexpected money.",
    options: [
      { text: "Save it", type: "safe" },
      { text: "Spend it", type: "risky" },
      { text: "Split it", type: "neutral" }
    ]
  }
];

let current = 0;
let timer;
let timeLeft = 5;

let scores = { safe: 0, risky: 0, neutral: 0 };

/* Shuffle */
questions.sort(() => Math.random() - 0.5);

/* Sound */
function playSound() {
  new Audio("https://www.soundjay.com/buttons/sounds/button-16.mp3").play();
}

/* Load Question */
function loadQuestion() {
  const q = questions[current];

  document.getElementById("progressText").innerText =
    `Question ${current + 1} / ${questions.length}`;

  document.getElementById("question").innerText = q.q;

  const optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = "";

  q.options.forEach(opt => {
    const btn = document.createElement("button");
    btn.innerText = opt.text;

    btn.onclick = () => {
      playSound();
      selectOption(opt.type);
      disableButtons();
    };

    optionsDiv.appendChild(btn);
  });

  document.getElementById("result").innerText = "";
  document.getElementById("nextBtn").style.display = "none";

  startTimer();
}

/* Timer */
function startTimer() {
  timeLeft = 5;
  updateBar();

  timer = setInterval(() => {
    timeLeft--;
    updateBar();

    if (timeLeft === 0) {
      clearInterval(timer);
      autoSelect();
    }
  }, 1000);
}

function updateBar() {
  const percent = (timeLeft / 5) * 100;
  const bar = document.getElementById("progress");

  bar.style.width = percent + "%";

  if (percent < 40) bar.style.background = "red";
  else if (percent < 70) bar.style.background = "orange";
  else bar.style.background = "limegreen";
}

/* Select */
function selectOption(type) {
  clearInterval(timer);
  scores[type]++;

  document.getElementById("result").innerText =
    "You chose a " + type + " decision.";

  document.getElementById("nextBtn").style.display = "inline-block";
}

/* Disable */
function disableButtons() {
  document.querySelectorAll(".options button")
    .forEach(btn => btn.disabled = true);
}

/* Auto */
function autoSelect() {
  scores.risky++;

  document.getElementById("result").innerText =
    "⏱️ Time up! Risky decision selected.";

  disableButtons();
  document.getElementById("nextBtn").style.display = "inline-block";
}

/* Next */
function nextQuestion() {
  current++;

  if (current < questions.length) {
    loadQuestion();
  } else {
    showFinal();
  }
}

/* Final */
function showFinal() {
  let result = "";

  if (scores.safe > scores.risky) {
    result = "🧠 You are Smart & Careful!";
  } else if (scores.risky > scores.safe) {
    result = "You are Risk Taker!";
  } else {
    result = "⚖️ Balanced!";
  }

  document.getElementById("container").innerHTML = `
    <h2>${result}</h2>
    <p>Safe: ${scores.safe}</p>
    <p>Risky: ${scores.risky}</p>
    <p>Neutral: ${scores.neutral}</p>
    <button onclick="location.reload()">Restart</button>
  `;
}

/* Start */
loadQuestion();
const minutesElement = document.getElementById("minutes");
const secondsElement = document.getElementById("seconds");
const millisecondsElement = document.getElementById("milliseconds");

const startButton = document.getElementById("start");
const pauseButton = document.getElementById("pause");
const resetButton = document.getElementById("reset");
const lapButton = document.getElementById("lap");
const clearLapsButton = document.getElementById("clear-laps");
const lapsList = document.getElementById("laps");
const themeToggle = document.getElementById("theme-toggle");

let timerInterval;
let startTime;
let elapsedTime = 0;
let running = false;
let lapCounter = 1;
let lapTimes = [];
let lastLapTime = 0;

// Load saved theme
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark-theme");
  themeToggle.innerHTML = "☀️";
} else {
  themeToggle.innerHTML = "🌙";
}

// Toggle Theme
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-theme");
  const isDark = document.body.classList.contains("dark-theme");
  localStorage.setItem("theme", isDark ? "dark" : "light");
  themeToggle.innerHTML = isDark ? "☀️" : "🌙";
});

const formatTime = (time) => {
  const min = String(Math.floor(time / 60000)).padStart(2, "0");
  const sec = String(Math.floor((time % 60000) / 1000)).padStart(2, "0");
  const ms = String(Math.floor((time % 1000) / 10)).padStart(2, "0");
  return { min, sec, ms };
};

const updateDisplay = ({ min, sec, ms }) => {
  minutesElement.textContent = min;
  secondsElement.textContent = sec;
  millisecondsElement.textContent = ms;
};

const startTimer = () => {
  if (running) return;
  startTime = Date.now() - elapsedTime;
  timerInterval = setInterval(() => {
    elapsedTime = Date.now() - startTime;
    updateDisplay(formatTime(elapsedTime));
  }, 10);
  running = true;
};

const pauseTimer = () => {
  clearInterval(timerInterval);
  running = false;
};

const resetTimer = () => {
  pauseTimer();
  elapsedTime = 0;
  lastLapTime = 0;
  lapCounter = 1;
  lapTimes = [];
  lapsList.innerHTML = "";
  updateDisplay(formatTime(0));
};

const recordLap = () => {
  if (!running) return;
  const currentTime = elapsedTime;
  const lapTime = currentTime - lastLapTime;
  lastLapTime = currentTime;
  const formatted = formatTime(currentTime);
  const formattedLap = formatTime(lapTime);

  const li = document.createElement("li");
  li.innerHTML = `
    <span>Lap ${lapCounter}</span>
    <span>${formatted.min}:${formatted.sec}:${formatted.ms}</span>
    <span>+${formattedLap.min}:${formattedLap.sec}:${formattedLap.ms}</span>
  `;
  li.dataset.split = lapTime;
  lapsList.prepend(li);
  lapTimes.push(lapTime);
  lapCounter++;

  highlightLaps();
};

const highlightLaps = () => {
  const laps = [...lapsList.children];
  if (laps.length < 2) return;

  laps.forEach((li) => li.classList.remove("fastest", "slowest"));
  const splits = laps.map((li) => Number(li.dataset.split));
  const fastest = Math.min(...splits);
  const slowest = Math.max(...splits);

  laps.find((li) => Number(li.dataset.split) === fastest)?.classList.add("fastest");
  laps.find((li) => Number(li.dataset.split) === slowest)?.classList.add("slowest");
};

startButton.addEventListener("click", startTimer);
pauseButton.addEventListener("click", pauseTimer);
resetButton.addEventListener("click", resetTimer);
lapButton.addEventListener("click", recordLap);
clearLapsButton.addEventListener("click", () => {
  lapsList.innerHTML = "";
  lapTimes = [];
  lapCounter = 1;
  lastLapTime = 0;
});
updateDisplay(formatTime(0));

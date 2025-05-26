import {
  TARGET_SCORE,
  INIT_FLICKS,
  WINNING_SCORE,
  LOSING_SCORE,
  SCORE_GAIN,
  SCORE_LOSS,
  MAX_FLICK_VALUE,
} from './config.js';

import {
  getRandomInt,
  formatFlick,
  formatInitialFlickPool,
  formatScore,
  formatHighscore,
  formatWinnerMessage,
} from './helpers.js';

const overlayStart = document.querySelector('.overlay-start');
const overlayRules = document.querySelector('.overlay-rules');
const overlayWin = document.querySelector('.overlay-win');
const overlayLoss = document.querySelector('.overlay-loss');
const messageWin = document.querySelector('.winner-message');
const modalRules = document.querySelector('.modal-rules');
const btnOpenRules = document.querySelectorAll('.btn-rules');
const btnCloseRules = document.querySelector('.btn-close-rules');
const btnPlay = document.querySelectorAll('.btn-play');
const btnFlick = document.querySelectorAll('.btn-flick');
const slotNumberEls = document.querySelectorAll('.slot-number');
const curFlickEl = document.querySelector('.current-flick-number');
const scoreEl = document.querySelector('.score');
const flicksEl = document.querySelector('.flicks-left');
const highscoreEl = document.querySelector('.highscore');

/////////////////////////////////////////////////////////////////////
const state = {
  curNumber: 0,
  score: 0,
  highscore: 0,
  flicks: INIT_FLICKS,
};

const generateRandomNumber = function () {
  const number = getRandomInt(MAX_FLICK_VALUE);

  state.curNumber = number; // 1–5
  curFlickEl.textContent = formatFlick(number);
};

const decreaseFlicks = function () {
  state.flicks--;
  flicksEl.textContent = formatInitialFlickPool(state.flicks);
};

const updateSlotValue = function (slotNumberEl) {
  const newValue = +slotNumberEl.textContent + state.curNumber;
  slotNumberEl.textContent = newValue;
  return newValue;
};

const resetSlotValue = slotNumberEl => {
  slotNumberEl.textContent = 0;
};

const updateScore = function (scoreChange) {
  state.score += scoreChange;
  scoreEl.textContent = formatScore(state.score);
};

const updateHighscore = function () {
  highscoreEl.textContent = formatHighscore(state.highscore);
};

const resetGame = function () {
  slotNumberEls.forEach(nr => (nr.textContent = 0));

  state.score = 0;
  state.flicks = INIT_FLICKS;

  scoreEl.textContent = formatScore(state.score);
  flicksEl.textContent = formatInitialFlickPool(state.flicks);
};

// HANDLERS
const handleStartPlay = () => {
  generateRandomNumber();

  // Set initial flicks count
  flicksEl.textContent = formatInitialFlickPool(state.flicks);

  overlayWin.classList.remove('active');
  overlayLoss.classList.remove('active');
  overlayStart.classList.remove('active');

  // Fade in game
  setTimeout(() => {
    document.querySelector('main').classList.add('visible');
    document.querySelector('footer').classList.add('visible');
  }, 50);
};

const handleFlickClick = function (e) {
  const btnClicked = e.target;
  if (!btnClicked) return;

  // Get slot index from button's data attribute
  const slotIndex = btnClicked.dataset.slot;
  const slotNumberEl = document.querySelector(
    `.slot-number[data-slot="${slotIndex}"]`
  );
  if (!slotNumberEl) return;

  const updatedValue = updateSlotValue(slotNumberEl);

  if (updatedValue === TARGET_SCORE) {
    updateScore(SCORE_GAIN);
    resetSlotValue(slotNumberEl);

    if (state.score === WINNING_SCORE) {
      const flicksUsed = INIT_FLICKS - state.flicks + 1;

      messageWin.innerHTML = formatWinnerMessage(flicksUsed);
      overlayWin.classList.add('active');

      // Update highscore if needed
      if (flicksUsed < state.highscore || state.highscore === 0) {
        state.highscore = flicksUsed;
        updateHighscore();
      }

      resetGame();
      return;
    }
  } else if (updatedValue > TARGET_SCORE) {
    resetSlotValue(slotNumberEl);
    updateScore(SCORE_LOSS);

    if (state.score === LOSING_SCORE) {
      overlayLoss.classList.add('active');
      resetGame();
      return;
    }
  }

  if (state.flicks <= 0) {
    overlayLoss.classList.add('active');
    resetGame();
    return;
  }

  decreaseFlicks();
  generateRandomNumber(state, curFlickEl);
};

const handleToggleRules = () => overlayRules.classList.toggle('active');

// Event listeners
btnPlay.forEach(btn => btn.addEventListener('click', handleStartPlay));
btnFlick.forEach(btn => btn.addEventListener('click', handleFlickClick));
btnOpenRules.forEach(btn => btn.addEventListener('click', handleToggleRules));
btnCloseRules.addEventListener('click', handleToggleRules);
overlayRules.addEventListener('click', handleToggleRules);
modalRules.addEventListener('click', e => e.stopPropagation());

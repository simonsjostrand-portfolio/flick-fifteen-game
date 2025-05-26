import {
  INIT_FLICKS,
  MAX_FLICK_VALUE,
  SLOT_TARGET_VALUE,
  POINTS_TO_WIN,
  STARTING_LIFES,
  POINTS_GAIN,
  POINTS_LOSS,
} from './config.js';

import {
  getRandomInt,
  formatFlick,
  formatInitialFlickPool,
  formatPoints,
  formatHighscore,
  formatWinnerMessage,
} from './helpers.js';

const overlayStart = document.querySelector('.overlay-start');
const overlayRules = document.querySelector('.overlay-rules');
const overlayWin = document.querySelector('.overlay-win');
const overlayLoss = document.querySelector('.overlay-loss');
const messageWin = document.querySelector('.winner-message');
const btnPlay = document.querySelectorAll('.btn-play');
const btnFlick = document.querySelectorAll('.btn-flick');
const btnOpenRules = document.querySelectorAll('.btn-rules');
const btnCloseRules = document.querySelector('.btn-close-rules');
const slotNumberEls = document.querySelectorAll('.slot-number');
const curFlickEl = document.querySelector('.current-flick-number');
const pointsEl = document.querySelector('.points'); // ✅ updated selector name
const flicksEl = document.querySelector('.flicks-left');
const highscoreEl = document.querySelector('.highscore');
const lifeWrapper = document.querySelector('.life-wrapper');
const modalRules = document.querySelector('.modal-rules');

/////////////////////////////////////////////////////////////////////

const state = {
  curNumber: 0,
  points: 0,
  flicks: INIT_FLICKS,
  lifes: STARTING_LIFES,
  highscore: 0,
};

const renderHearts = () => {
  lifeWrapper.innerHTML = '';

  for (let i = 0; i < STARTING_LIFES; i++) {
    const heart = document.createElement('img');
    heart.src = 'src/img/icon-heart.svg';
    heart.classList.add('heart-icon');
    lifeWrapper.appendChild(heart);
  }
};

const generateRandomNumber = function () {
  const number = getRandomInt(MAX_FLICK_VALUE);

  state.curNumber = number;
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

const updatePoints = function (pointsChange) {
  state.points += pointsChange;
  pointsEl.textContent = formatPoints(state.points);
};

const updateHighscore = function () {
  highscoreEl.textContent = formatHighscore(state.highscore);
};

const resetGame = function () {
  slotNumberEls.forEach(nr => (nr.textContent = 0));

  state.points = 0;
  state.flicks = INIT_FLICKS;
  state.lifes = STARTING_LIFES;

  pointsEl.textContent = formatPoints(state.points);
  flicksEl.textContent = formatInitialFlickPool(state.flicks);

  renderHearts();
};

// HANDLERS
const handleStartPlay = () => {
  generateRandomNumber();

  flicksEl.textContent = formatInitialFlickPool(state.flicks);

  overlayWin.classList.remove('active');
  overlayLoss.classList.remove('active');
  overlayStart.classList.remove('active');

  setTimeout(() => {
    document.querySelector('main').classList.add('visible');
    document.querySelector('footer').classList.add('visible');
  }, 50);

  renderHearts();
  console.log(state);
};

const handleFlickClick = function (e) {
  const btnClicked = e.target;
  if (!btnClicked) return;

  const slotIndex = btnClicked.dataset.slot;
  const slotNumberEl = document.querySelector(
    `.slot-number[data-slot="${slotIndex}"]`
  );
  if (!slotNumberEl) return;

  // On successful flick
  const updatedValue = updateSlotValue(slotNumberEl);

  if (updatedValue === SLOT_TARGET_VALUE) {
    updatePoints(POINTS_GAIN);
    resetSlotValue(slotNumberEl);

    if (state.points === POINTS_TO_WIN) {
      const flicksUsed = INIT_FLICKS - state.flicks + 1;

      messageWin.innerHTML = formatWinnerMessage(flicksUsed);
      overlayWin.classList.add('active');

      if (flicksUsed < state.highscore || state.highscore === 0) {
        state.highscore = flicksUsed;
        updateHighscore();
      }

      resetGame();
      return;
    }
  }

  // On overflick (slot goes over target value)
  else if (updatedValue > SLOT_TARGET_VALUE) {
    state.lifes -= 1;

    const currentHearts = document.querySelectorAll('.heart-icon');
    if (currentHearts[state.lifes]) {
      currentHearts[state.lifes].remove();
    }

    if (state.points > 0) {
      updatePoints(POINTS_LOSS);
    }

    if (state.lifes <= 0) {
      overlayLoss.classList.add('active');
      resetGame();
      return;
    }

    resetSlotValue(slotNumberEl);
  }

  if (state.flicks <= 0) {
    overlayLoss.classList.add('active');
    resetGame();
    return;
  }

  decreaseFlicks();
  generateRandomNumber();
};

const handleToggleRules = () => overlayRules.classList.toggle('active');

// Event listeners
btnPlay.forEach(btn => btn.addEventListener('click', handleStartPlay));
btnFlick.forEach(btn => btn.addEventListener('click', handleFlickClick));
btnOpenRules.forEach(btn => btn.addEventListener('click', handleToggleRules));
btnCloseRules.addEventListener('click', handleToggleRules);
overlayRules.addEventListener('click', handleToggleRules);
modalRules.addEventListener('click', e => e.stopPropagation());

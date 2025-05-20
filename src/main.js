import {
  TARGET_SCORE,
  INIT_FLICKS,
  WINNING_SCORE,
  LOSING_SCORE,
  SCORE_GAIN,
  SCORE_LOSS,
} from './config.js';
import {
  generateRandomNumber,
  updateSlotValue,
  resetSlotScore,
  decreaseFlicks,
  resetGame,
} from './utilities.js';

const overlayStart = document.querySelector('.overlay-start');
const overlayRules = document.querySelector('.overlay-rules');
const overlayWin = document.querySelector('.overlay-win');
const overlayLoss = document.querySelector('.overlay-loss');
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

// Handler functions
const handlePlay = () => {
  overlayWin.classList.remove('active');
  overlayLoss.classList.remove('active');
  overlayStart.classList.remove('active');

  setTimeout(() => {
    document.querySelector('main').classList.add('visible');
  }, 40);
};

const handleFlickClick = function (e) {
  const btnClicked = e.target;
  if (!btnClicked) return;

  // Get clicked slot number element
  const slotWrapper = btnClicked.closest('.slot-wrapper');
  const slotNumberEl = slotWrapper.querySelector('.slot-number');

  // Update slot value with current flick
  const updatedValue = updateSlotValue(slotNumberEl, state.curNumber);

  // If slot hits target score, reset slot and update score
  if (updatedValue === TARGET_SCORE) {
    resetSlotScore(state, slotNumberEl, scoreEl, SCORE_GAIN);

    // If winning score reached, show win overlay and reset game
    if (state.score === WINNING_SCORE) {
      overlayWin.classList.add('active');
      resetGame(state, slotNumberEls, scoreEl, flicksEl);

      // Update highscore if needed
      if (state.flicks > state.highscore) {
        state.highscore = state.flicks;
        highscoreEl.textContent = `Highscore: ${state.highscore}`;
      }
    }
  }
  // If slot exceeds target score, reset slot and subtract score
  else if (updatedValue > TARGET_SCORE) {
    resetSlotScore(state, slotNumberEl, scoreEl, SCORE_LOSS);

    // If losing score reached, show loss overlay and reset game
    if (state.score === LOSING_SCORE) {
      overlayLoss.classList.add('active');
      resetGame(state, slotNumberEls, scoreEl, flicksEl);
    }
  }

  decreaseFlicks(state, flicksEl);
  generateRandomNumber(state, curFlickEl);
};

const handleToggleRules = () => overlayRules.classList.toggle('active');

// Event listeners
btnPlay.forEach(btn => btn.addEventListener('click', handlePlay));
btnFlick.forEach(btn => btn.addEventListener('click', handleFlickClick));
btnOpenRules.forEach(btn => btn.addEventListener('click', handleToggleRules));
btnCloseRules.addEventListener('click', handleToggleRules);
overlayRules.addEventListener('click', handleToggleRules);
modalRules.addEventListener('click', e => e.stopPropagation());

// Initialize game
const init = () => {
  resetGame(state, slotNumberEls, scoreEl, flicksEl);
  generateRandomNumber(state, curFlickEl);
};

init();

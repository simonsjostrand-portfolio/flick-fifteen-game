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
  updateHighscore,
  resetGame,
} from './utilities.js';

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
const flicksLeftEl = document.querySelector('.flicks-left');
const highscoreEl = document.querySelector('.highscore');

/////////////////////////////////////////////////////////////////////
const state = {
  curNumber: 0,
  score: 0,
  highscore: 0,
  flicks: INIT_FLICKS,
};

// Handlers
const handlePlay = () => {
  generateRandomNumber(state, curFlickEl);

  // Set flick count
  flicksLeftEl.textContent = `Flicks left: ${state.flicks}`;

  overlayWin.classList.remove('active');
  overlayLoss.classList.remove('active');
  overlayStart.classList.remove('active');

  // Fade in game
  setTimeout(() => {
    document.querySelector('main').classList.add('visible');
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

  // Update slot value with current flick
  const updatedValue = updateSlotValue(slotNumberEl, state.curNumber);

  // If slot hits target score, reset slot and update score
  if (updatedValue === TARGET_SCORE) {
    resetSlotScore(state, slotNumberEl, scoreEl, SCORE_GAIN);

    // If winning score reached, show win overlay and reset game
    if (state.score === WINNING_SCORE) {
      const flicksUsed = INIT_FLICKS - state.flicks + 1;

      messageWin.innerHTML = `GGs! It took you <strong>${flicksUsed}</strong> flicks to win.<br />
        Somewhere out there, your high score is bragging about you. Or is it?`;
      overlayWin.classList.add('active');

      // Update highscore if needed
      if (flicksUsed < state.highscore || state.highscore === 0) {
        state.highscore = flicksUsed;
        updateHighscore(state, highscoreEl);
      }

      resetGame(state, slotNumberEls, scoreEl, flicksLeftEl);
      return;
    }
  }
  // If slot exceeds target score, reset slot and subtract score
  else if (updatedValue > TARGET_SCORE) {
    resetSlotScore(state, slotNumberEl, scoreEl, SCORE_LOSS);

    // If losing score reached, show loss overlay and reset game
    if (state.score === LOSING_SCORE) {
      overlayLoss.classList.add('active');
      resetGame(state, slotNumberEls, scoreEl, flicksLeftEl);
      return;
    }
  }

  slotNumberEl.classList.add('slot-flash');

  setTimeout(() => {
    slotNumberEl.classList.remove('slot-flash');
  }, 80);

  decreaseFlicks(state, flicksLeftEl);

  if (state.flicks <= 0) {
    overlayLoss.classList.add('active');
    resetGame(state, slotNumberEls, scoreEl, flicksLeftEl);
    return;
  }

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

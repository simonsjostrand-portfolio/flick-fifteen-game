import { INIT_FLICKS, MAX_FLICK_VALUE } from './config.js';

// Set a random number (1–5) as current flick and update UI
export const generateRandomNumber = function (state, curNumberEl) {
  const number = Math.trunc(Math.random() * MAX_FLICK_VALUE + 1);

  state.curNumber = number;
  curNumberEl.textContent = `Flick: ${number}`;
};

// Add current flick number to slot and return new value
export const updateSlotValue = function (slotNr, curNr) {
  const newValue = +slotNr.textContent + curNr;
  slotNr.textContent = newValue;
  return newValue;
};

//  Reset slot to 0 and update score
export const resetSlotScore = (state, slotNumberEl, scoreEl, scoreChange) => {
  slotNumberEl.textContent = 0;
  state.score += scoreChange;
  scoreEl.textContent = `Score: ${state.score}`;
};

// Subtract one flick and update UI
export const decreaseFlicks = function (state, flicksEl) {
  state.flicks--;
  flicksEl.textContent = `Flicks left: ${state.flicks}`;
};

export const updateHighscore = function (state, highscoreEl) {
  highscoreEl.textContent = `Highscore: ${state.highscore}`;
};

// Reset all slots, score, and flicks
export const resetGame = function (state, slotEls, scoreEl, flicksEl) {
  slotEls.forEach(nr => (nr.textContent = 0));

  state.score = 0;
  state.flicks = INIT_FLICKS;

  scoreEl.textContent = `Score: ${state.score}`;
  flicksEl.textContent = `Flicks left: ${state.flicks}`;
};

export const getRandomInt = max => Math.trunc(Math.random() * max + 1);
export const formatFlick = number => `Flick: ${number}`;
export const formatInitialFlickPool = count => `Flicks left: ${count}`;
export const formatPoints = points => `Points: ${points}`;
export const formatHighscore = points => `Highscore: ${points}`;
export const formatWinnerMessage =
  flicks => `GGs! It took you <strong>${flicks}</strong> flicks to win.<br />
        Somewhere out there, your high score is bragging about you. Or is it?`;

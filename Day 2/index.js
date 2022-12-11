const fs = require('node:fs');
const path = require('node:path');

const input = fs
  .readFileSync(path.join(__dirname, 'input.txt'), 'utf-8')
  .toString();

/**
 *  A for Rock, B for Paper, and C for Scissors
 * X for Rock, Y for Paper, and Z for Scissors
 * 1 for Rock, 2 for Paper, and 3 for Scissors
 * Your total score is the sum of your scores for each round. The score for a single round is
 * the score for the shape you selected (1 for Rock, 2 for Paper, and 3 for Scissors)
 *  plus the score for the outcome of the round (0 if you lost, 3 if the round was a draw, and 6 if you won).
 */

const scores = {
  // Rock
  A: 1,
  X: 1,
  // Paper
  B: 2,
  Y: 2,
  // Scissors
  C: 3,
  Z: 3,
};

function normalize(input) {
  return input.split('\n');
}

function solveOne(strategy) {
  const powers = {
    X: 'C',
    Y: 'A',
    Z: 'B',
  };
  return normalize(strategy).reduce((acc, curr) => {
    const [a, b] = curr.split(' ');
    let mod = 0;

    if (scores[a] === scores[b]) {
      mod = 3;
    } else if (powers[b] === a) {
      mod = 6;
    }

    return mod + scores[b] + acc;
  }, 0);
}

/**
 * "Anyway, the second column says how the round needs to end: X means you need to lose,
 * Y means you need to end the round in a draw, and Z means you need to win. Good luck!"
 * A Y
 * B X
 * C Z
 */
function solveTwo(strategy) {
  return normalize(strategy).reduce((acc, curr) => {
    const [a, b] = curr.split(' ');
    let mod = 0;

    if (b === 'Y') {
      mod = 3 + scores[a];
    } else if (b === 'X') {
      // A < B < C < A
      const losingScore = scores[a] - 1;
      mod = losingScore >= 1 ? losingScore : 3;
    } else {
      const winningScore = scores[a] + 1;
      mod = (winningScore > 3 ? 1 : winningScore) + 6;
    }

    return mod + acc;
  }, 0);
}

const p1 = solveOne(input);
const p2 = solveTwo(input);

fs.writeFileSync(
  path.join(__dirname, 'output.txt'),
  `-----PART ONE-----

${p1}

----PART TWO------

${p2}
`,
  'utf-8'
);

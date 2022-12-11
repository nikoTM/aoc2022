const fs = require('node:fs');
const path = require('node:path');

const input = fs
  .readFileSync(path.join(__dirname, 'input.txt'), 'utf-8')
  .toString();

function normalize(input) {
  return input.split('\n').reduce(
    (acc, curr) => {
      if (curr) {
        acc[acc.length - 1] += Number(curr);
      } else {
        acc.push(0);
      }
      return acc;
    },
    [0]
  );
}

function solveOne(foodIntake) {
  return normalize(foodIntake).reduce((a, b) => (a > b ? a : b), 0);
}

function solveTwo(foodIntake) {
  return normalize(foodIntake)
    .sort((a, b) => (a > b ? -1 : 1))
    .slice(0, 3)
    .reduce((a, b) => a + b, 0);
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

const fs = require('node:fs');
const path = require('node:path');

const input = fs
  .readFileSync(path.join(__dirname, 'input.txt'), 'utf-8')
  .toString();

function normalize(input) {
  return input.split('\n');
}

const charToPrio = (char) => {
  const charCode = char.charCodeAt();

  if (charCode <= 90) {
    // CharCode of A is 65, projecting that onto 27-52
    return charCode - 38;
  } else {
    // CharCode of a is 97, projecting that onto 1-27
    return charCode - 96;
  }
};

function solveOne(strategy) {
  const cpt = normalize(strategy);

  const findMatches = (a, b) => {
    const matches = b.filter((c) => a.indexOf(c) !== -1);
    return matches && matches.length ? matches[0] : null;
  };

  return cpt.reduce((sum, curr) => {
    const [a, b] = curr.split('').reduce(
      (split, inner, i, array) => {
        if (i > (array.length - 1) / 2) {
          split[1].push(inner);
        } else {
          split[0].push(inner);
        }
        return split;
      },
      [[], []]
    );

    return sum + charToPrio(findMatches(a, b));
  }, 0);
}

function solveTwo(strategy) {
  const findMatches = (a, b, c) => {
    const matches = c.filter(
      (char) => a.indexOf(char) !== -1 && b.indexOf(char) !== -1
    );
    return matches && matches.length ? matches[0] : null;
  };

  return normalize(strategy)
    .reduce(
      (acc, curr) => {
        if (acc[acc.length - 1].length === 3) {
          acc.push([curr]);
        } else {
          acc[acc.length - 1].push(curr);
        }

        return acc;
      },
      [[]]
    )
    .reduce((sum, group) => {
      const cpts = group.map((cpt) => cpt.split(''));

      return sum + charToPrio(findMatches(...cpts));
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

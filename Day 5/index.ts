const input = await Deno.readTextFile('./input.txt');
// const input = await Deno.readTextFile('./sample.txt');

function normalize(input: string): {
  crates: Array<string[]>;
  moves: Array<number[]>;
} {
  const parsedInput = input.split('\n');
  const separatorIndex = parsedInput.findIndex((f) => !f);

  const crates = parsedInput
    .slice(0, separatorIndex - 1)
    .reduce((c: Array<string[]>, current) => {
      const matches = current.match(/(\[\D\])|\s{4}/gi);

      matches?.forEach((match, i) => {
        if (match.trim()) {
          if (c[i]) {
            c[i].push(match);
          } else {
            c[i] = [match];
          }
        }
      });
      return c;
    }, []);

  const moves = parsedInput.slice(separatorIndex + 1).map((move) => {
    return (move.match(/(\d+)/g) as string[]).map((i) => Number(i));
  });

  return { crates, moves };
}

function printCrates(crates: Array<string[]>) {
  const l = crates.reduce((h, c) => (c.length > h ? c.length : h), 0);

  const lines = Array(l)
    .fill(null)
    .map((_) => '');

  for (let i = 0; i < crates.length; i++) {
    for (let j = 0; j < l; j++) {
      lines[j] += crates[i][j] ? ` ${crates[i][j]} ` : '     ';
    }
  }
  console.log('-'.repeat(lines[0].length));
  console.log(lines.join('\n'));
  console.log('-'.repeat(lines[0].length));
}

function solveOne(instructions: string): string {
  const { crates, moves } = normalize(instructions);
  for (let i = 0; i < moves.length; i++) {
    let [amount, from, to] = moves[i];

    while (amount) {
      const crate = crates[from - 1].shift();
      if (crate) {
        crates[to - 1].unshift(crate);
      }
      amount--;
    }
  }

  return crates.reduce((tops, curr) => {
    tops += curr[0]?.replace('[', '').replace(']', '') || '!!';

    return tops;
  }, '');
}

function solveTwo(instructions: string) {
  const { crates, moves } = normalize(instructions);
  for (let i = 0; i < moves.length; i++) {
    let [amount, from, to] = moves[i];
    const m = [] as string[];
    while (amount) {
      m.push(crates[from - 1].shift() || '');
      amount--;
    }

    crates[to - 1] = [...m, ...crates[to - 1]];
  }

  printCrates(crates);
  return crates.reduce((tops, curr) => {
    tops += curr[0]?.replace('[', '').replace(']', '');

    return tops;
  }, '');
}

const p1 = solveOne(input);
const p2 = solveTwo(input);
const output = `-----PART ONE-----

${p1}

----PART TWO------

${p2}
`;

console.log(output);
const encoder = new TextEncoder();
const text = encoder.encode(output);
Deno.writeFileSync('./output.txt', text);

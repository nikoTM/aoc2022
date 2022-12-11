const input = await Deno.readTextFile('./input.txt');

function normalize(input: string) {
  return input.split('\n').map((item) => {
    return item.split(',').reduce((r, c) => {
      const [s, e] = c.split('-');
      r.push(Number(s), Number(e));
      return r;
    }, [] as number[]);
  });
}

function solveOne(assignments: string): number {
  return normalize(assignments).reduce((matches, current) => {
    const [s1, e1, s2, e2] = current;
    //....s1......e1....
    // ......s2e2.......
    const mod = Number((s1 <= s2 && e2 <= e1) || (s2 <= s1 && e1 <= e2));

    return matches + mod;
  }, 0);
}

function solveTwo(assignments: string) {
  return normalize(assignments).reduce((matches, current) => {
    const [s1, e1, s2, e2] = current;

    // .......s1 e1....
    // .s2 e2........
    // .............s2 e2....
    const mod = Number(!(e2 < s1 || e1 < s2));

    return matches + mod;
  }, 0);
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

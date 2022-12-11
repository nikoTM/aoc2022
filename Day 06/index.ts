const input = await Deno.readTextFile('./input.txt');
// const input = await Deno.readTextFile('./sample.txt');

function normalize(input: string) {
  return input.split('\n');
}

function secondSolution(comms: string, length: number) {
  const seq = normalize(comms);

  return seq.map((seqItem) => {
    for (let i = 0; i < seqItem.length; i++) {
      const j = i + length;
      const substring = seqItem.slice(i, j).split('');
      if (Array.from(new Set(substring)).length === length) {
        return j;
      }
    }

    return 0;
  });
}

function _initialSolution(comms: string, length: number) {
  const seq = normalize(comms);
  const regex = new RegExp('(?=(?:[a-z]){' + length + '})(?!.*([a-z]).*\\1)');

  return seq.map((seqItem) => {
    for (let i = 0; i < seqItem.length; i++) {
      const j = i + length;
      const substring = seqItem.slice(i, j);
      if (substring.match(regex)) {
        return j;
      }
    }

    return 0;
  });
}

function solveOne(comms: string) {
  return secondSolution(comms, 4);
}

function solveTwo(comms: string) {
  return secondSolution(comms, 14);
}

function solve() {
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
}

solve();

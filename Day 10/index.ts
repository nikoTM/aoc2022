const input = await Deno.readTextFile('./input.txt');
// const input = await Deno.readTextFile('./sample.txt');

function normalize(input: string) {
  return input.split('\n');
}

function solveOne(instructions: string) {
  const assembly = normalize(instructions).reduce((acc, current) => {
    const [command] = current.split(' ');
    if (command === 'addx') {
      acc.push('addx 0');
    }
    acc.push(current);

    return acc;
  }, [] as string[]);

  let x = 1;
  let str = 0;
  let f = 19;

  for (let i = 0; i < assembly.length; i++) {
    if (i === f) {
      str += x * (i + 1);
      f += 40;
    }
    const [command, v] = assembly[i].split(' ');
    if (command === 'noop') {
      continue;
    } else {
      x += parseInt(v);
    }
  }

  return str;
}

function renderCRT(crt: string[][]) {
  return crt.reduce((s, current) => {
    return s + current.join('') + '\n';
  }, '');
}

function solveTwo(instructions: string) {
  const vga = normalize(instructions).reduce((acc, current) => {
    const [command] = current.split(' ');
    if (command === 'addx') {
      acc.push('addx 0');
    }
    acc.push(current);

    return acc;
  }, [] as string[]);
  const CRT = Array(6)
    .fill(null)
    .map((_) => {
      return Array(40)
        .fill(null)
        .map((_) => '.');
    });

  let x = 1;
  let row = 1;
  let r = 40;

  const indexToScale = (index: number, row: number) => {
    if (index + 1 <= 40) {
      return index;
    } else {
      return index - (row - 1) * 40;
    }
  };

  let pixels: number[] = [0, 1, 2];

  for (let i = 0; i < vga.length; i++) {
    if (i === r) {
      row++;
      r += 40;
    }
    const [command, v] = vga[i].split(' ');

    const pos = indexToScale(i, row);
    CRT[row - 1][pos] = pixels.indexOf(pos) !== -1 ? '#' : '.';

    if (command === 'addx') {
      x += parseInt(v);
      if (parseInt(v)) {
        const f = indexToScale(x, row);
        pixels = [f - 1, f, f + 1];
      }
    }
  }

  return renderCRT(CRT);
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

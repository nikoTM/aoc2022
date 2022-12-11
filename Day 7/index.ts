const input = await Deno.readTextFile('./input.txt');
// const input = await Deno.readTextFile('./sample.txt');

function normalize(input: string) {
  return input.split('\n');
}

function solveOne(commands: string) {
  const MAX_SIZE = 100000;
  const p = normalize(commands);
  const sizes: Record<string, number> = {};
  let currentDir = '';

  for (let i = 0; i < p.length; i++) {
    const line = p[i];
    if (line.startsWith('$')) {
      const [command, ...params] = line.slice(2).split(' ');
      if (command === 'cd') {
        if (params[0] === '/') {
          currentDir = '/';
        } else if (params[0] === '..') {
          currentDir = currentDir.slice(0, currentDir.lastIndexOf('/'));
        } else {
          currentDir =
            currentDir + (currentDir.endsWith('/') ? '' : '/') + params[0];
        }
      }
    } else {
      const size = parseInt(line.slice(0).split(' ')[0]);
      if (!Number.isNaN(size)) {
        for (let i = 0; i < currentDir.length; i++) {
          if (currentDir[i] === '/') {
            const chunk = currentDir.slice(0, i) || '/';
            sizes[chunk] = (sizes[chunk] || 0) + size;
          }
        }
        sizes[currentDir] = (sizes[currentDir] || 0) + size;
      }
    }
  }

  return Object.values(sizes).reduce((s, c) => (c <= MAX_SIZE ? s + c : s), 0);
}

function solveTwo(commands: string) {
  const TOTAL_FS_SIZE = 70000000;
  const REQUIRED_FREE_SIZE = 30000000;
  const p = normalize(commands);
  const sizes: Record<string, number> = {};
  let currentDir = '';
  let free = TOTAL_FS_SIZE;

  for (let i = 0; i < p.length; i++) {
    const line = p[i];
    if (line.startsWith('$')) {
      const [command, ...params] = line.slice(2).split(' ');
      if (command === 'cd') {
        if (params[0] === '/') {
          currentDir = '/';
        } else if (params[0] === '..') {
          currentDir = currentDir.slice(0, currentDir.lastIndexOf('/'));
        } else {
          currentDir =
            currentDir + (currentDir.endsWith('/') ? '' : '/') + params[0];
        }
      }
    } else {
      const size = parseInt(line.slice(0).split(' ')[0]);
      if (!Number.isNaN(size)) {
        for (let i = 0; i < currentDir.length; i++) {
          if (currentDir[i] === '/') {
            const chunk = currentDir.slice(0, i) || '/';
            sizes[chunk] = (sizes[chunk] || 0) + size;
          }
        }
        sizes[currentDir] = (sizes[currentDir] || 0) + size;
        free -= size;
      }
    }
  }

  const sizeValues = Object.values(sizes);

  return sizeValues
    .filter((c) => free + c >= REQUIRED_FREE_SIZE)
    .sort((a, b) => a - b)[0];
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

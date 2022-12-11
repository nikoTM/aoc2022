const input = await Deno.readTextFile('./input.txt');
// const input = await Deno.readTextFile('./sample.txt');

function normalize(input: string) {
  const transpose = <T>(arr: T[][]): T[][] => {
    const rows = arr.length;
    const cols = arr[0].length;

    const transposed = new Array(cols);
    for (let i = 0; i < cols; i++) {
      transposed[i] = new Array(rows);
    }

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        transposed[j][i] = arr[i][j];
      }
    }

    return transposed;
  };
  const treeMap = input
    .split('\n')
    .map((f) => f.split('').map((v) => parseInt(v)));

  return {
    treeMap,
    treeMapTransposed: transpose(treeMap),
  };
}

function solveOne(trees: string) {
  const { treeMap, treeMapTransposed } = normalize(trees);

  let c = 0;
  for (let i = 0; i < treeMap.length; i++) {
    for (let j = 0; j < treeMap[i].length; j++) {
      if (
        i === 0 ||
        i === treeMap.length - 1 ||
        j === 0 ||
        j === treeMap.length - 1
      ) {
        c++;
        continue;
      }

      const compareCurrentTree = (v: number) => v < treeMap[i][j];
      const left = treeMap[i].slice(0, j).every(compareCurrentTree);
      const right = treeMap[i].slice(j + 1).every(compareCurrentTree);
      const up = treeMapTransposed[j].slice(0, i).every(compareCurrentTree);
      const down = treeMapTransposed[j].slice(i + 1).every(compareCurrentTree);
      c += Number(left || right || up || down);
    }
  }
  return c;
}

function solveTwo(trees: string) {
  const { treeMap, treeMapTransposed } = normalize(trees);
  const countVisibleTrees = (array: number[], value: number) => {
    let c = 0;

    for (let i = 0; i < array.length; i++) {
      c++;
      if (array[i] >= value) {
        break;
      }
    }

    return c;
  };

  let c = 0;
  for (let i = 0; i < treeMap.length; i++) {
    for (let j = 0; j < treeMap[i].length; j++) {
      if (
        i === 0 ||
        i === treeMap.length - 1 ||
        j === 0 ||
        j === treeMap.length - 1
      ) {
        continue;
      }

      if (treeMap[i][j] !== treeMapTransposed[j][i]) {
        console.log(treeMap[i][j], treeMapTransposed[j][i]);
      }

      const el = treeMap[i][j];
      const left = treeMap[i].slice(0, j).reverse();
      const right = treeMap[i].slice(j + 1);
      const up = treeMapTransposed[j].slice(0, i).reverse();
      const down = treeMapTransposed[j].slice(i + 1);
      const score =
        countVisibleTrees(left, el) *
        countVisibleTrees(right, el) *
        countVisibleTrees(up, el) *
        countVisibleTrees(down, el);

      if (score > c) {
        c = score;
      }
    }
  }
  return c;
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

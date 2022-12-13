const input = await Deno.readTextFile('./input.txt');
// const input = await Deno.readTextFile('./sample.txt');

type Graph = Record<string, string[]>;

type CompareFn = (codeOne: number, codeTwo: number) => boolean;

function normalize(input: string) {
  return input.split('\n').map((row) => row.split(''));
}

function arrayToGraph(grid: string[][], compareFn: CompareFn) {
  const graph: Graph = {};
  let start = '0,0';
  let end = '0,0';
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      const coord = i + ',' + j;
      if (grid[i][j] === 'S') {
        start = coord;
      } else if (grid[i][j] === 'E') {
        end = coord;
      }
      graph[coord] = getNeighbors(grid, i, j, compareFn).map(([x, y]) => {
        return x + ',' + y;
      });
    }
  }

  return { graph, start, end };
}

function getElevation(s: string) {
  if (s === 'S') {
    return 'a'.charCodeAt(0);
  } else if (s === 'E') {
    return 'z'.charCodeAt(0);
  }

  return s.charCodeAt(0);
}

function getNeighbors(
  grid: string[][],
  x: number,
  y: number,
  compareFn: CompareFn
): number[][] {
  const neighbors = [
    [x - 1, y],
    [x, y - 1],
    [x + 1, y],
    [x, y + 1],
  ];
  return neighbors.filter(([nX, nY]) => {
    return (
      nX >= 0 &&
      nY >= 0 &&
      nX < grid.length &&
      nY < grid[0].length &&
      compareFn(getElevation(grid[x][y]), getElevation(grid[nX][nY]))
    );
  });
}

function graphBfs(
  graph: Graph,
  start: string,
  shouldEndAt: (current: string) => boolean
) {
  const queue = [
    {
      coord: start,
      dist: 0,
    },
  ];
  const visited = new Set<string>();
  visited.add(start);

  while (queue.length) {
    const current = queue.shift()!;

    if (shouldEndAt(current.coord)) {
      return current.dist;
    }

    for (const adjecent of graph[current.coord]) {
      if (visited.has(adjecent)) {
        continue;
      }
      visited.add(adjecent);
      queue.push({
        coord: adjecent,
        dist: current.dist + 1,
      });
    }
  }

  return -1;
}

function solveOne(instructions: string) {
  const { graph, start, end } = arrayToGraph(
    normalize(instructions),
    (a, b) => a + 1 >= b
  );

  return graphBfs(graph, start, (current) => current === end);
}

function solveTwo(instructions: string) {
  const grid = normalize(instructions);
  const { graph, end } = arrayToGraph(grid, (a, b) => a - 1 <= b);

  return graphBfs(graph, end, (current) => {
    const [i, j] = current.split(',').map((v) => parseInt(v));
    return grid[i][j] === 'a';
  });
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

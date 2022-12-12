const input = await Deno.readTextFile('./input.txt');
// const input = await Deno.readTextFile('./sample.txt');

type Monkey = {
  startingItems: number[];
  operation: (v: number) => number;
  test: (v: number) => number;
  testValue: number;
  i: number;
};

function normalize(input: string) {
  return input.split('\n\n').map((r) => monkifiy(r));
}

function monkifiy(input: string): Monkey {
  const startingItemsRegex = /Starting items: (\d+(, \d+)*)/;
  const operationRegex = /Operation\: new = (old|\d+) ([*\/+-]) (old|\d+)/;
  const testRegex = /Test: divisible by (\d+)/;
  const trueRegex = /If true: throw to monkey (\d+)/;
  const falseRegex = /If false: throw to monkey (\d+)/;

  const startingItemsMatch = startingItemsRegex.exec(input)!;
  const operationMatch = operationRegex.exec(input)!;
  const testMatch = testRegex.exec(input)!;
  const trueMatch = trueRegex.exec(input)!;
  const falseMatch = falseRegex.exec(input)!;

  const startingItems = startingItemsMatch[1].split(', ').map((v) => Number(v));
  const operation = (old: number) => {
    const add = (a: number, b: number) => a + b;
    const mult = (a: number, b: number) => a * b;

    const [a, op, b] = operationMatch.slice(1).map((op) => {
      switch (op) {
        case 'old':
          return old;
        case '+':
          return add;
        case '*':
          return mult;
        default:
          return op;
      }
    }) as [string | number, typeof add, string | number];

    return op(Number(a), Number(b));
  };
  const test = (value: number) => {
    if (value % Number(testMatch[1]) === 0) {
      return Number(trueMatch[1]);
    } else {
      return Number(falseMatch[1]);
    }
  };

  return {
    startingItems,
    operation,
    test,
    testValue: Number(testMatch[1]),
    i: 0,
  };
}

function solveOne(instructions: string) {
  const parsedMonkeys = normalize(instructions);

  for (let i = 0; i < 20; i++) {
    for (let j = 0; j < parsedMonkeys.length; j++) {
      let item = parsedMonkeys[j].startingItems.shift();

      while (item) {
        parsedMonkeys[j].i++;
        const newV = Math.floor(parsedMonkeys[j].operation(item) / 3);
        const newI = parsedMonkeys[j].test(newV);
        parsedMonkeys[newI].startingItems.push(newV);
        item = parsedMonkeys[j].startingItems.shift();
      }
    }
  }

  return Object.values(parsedMonkeys)
    .map((m) => m.i)
    .sort((a, b) => b - a)
    .slice(0, 2)
    .reduce((a, b) => a * b, 1);
}

function solveTwo(instructions: string) {
  const parsedMonkeys = normalize(instructions);

  // Had to lookup the solution for this
  // https://www.reddit.com/r/adventofcode/comments/zih7gf/2022_day_11_part_2_what_does_it_mean_find_another/izr79go/
  const supermodulo = parsedMonkeys
    .map((m) => m.testValue)
    .reduce((a, b) => a * b, 1);

  for (let i = 0; i < 10000; i++) {
    for (let j = 0; j < parsedMonkeys.length; j++) {
      let item = parsedMonkeys[j].startingItems.shift();

      while (item) {
        parsedMonkeys[j].i++;
        const newV = parsedMonkeys[j].operation(item) % supermodulo;
        const newI = parsedMonkeys[j].test(newV);
        parsedMonkeys[newI].startingItems.push(newV);
        item = parsedMonkeys[j].startingItems.shift();
      }
    }
  }
  return Object.values(parsedMonkeys)
    .map((m) => m.i)
    .sort((a, b) => b - a)
    .slice(0, 2)
    .reduce((a, b) => a * b, 1);
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

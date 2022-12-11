const input = await Deno.readTextFile('./input.txt');
// const input = await Deno.readTextFile('./sample2.txt');

function normalize(input: string) {
  return input.split('\n');
}

function solveOne(instructions: string) {
  const coords: Record<string, number> = {};
  const moves = normalize(instructions);

  const headPos = { x: 0, y: 0 };
  const tailPos = { x: 0, y: 0 };
  const setTailPos = (x: number, y: number) => {
    tailPos.x = x;
    tailPos.y = y;
    const key = x + ',' + y;
    if (coords[key]) {
      coords[key]++;
    } else {
      coords[key] = 1;
    }
  };

  const updateTailPos = () => {
    if (tailPos.x !== headPos.x && tailPos.y !== headPos.y) {
      if (Math.abs(tailPos.x - headPos.x) === 2) {
        setTailPos(
          headPos.x > tailPos.x ? headPos.x - 1 : headPos.x + 1,
          headPos.y
        );
      } else if (Math.abs(tailPos.y - headPos.y) === 2) {
        setTailPos(
          headPos.x,
          headPos.y > tailPos.y ? headPos.y - 1 : headPos.y + 1
        );
      }
    } else if (tailPos.x < headPos.x && tailPos.x !== headPos.x - 1) {
      setTailPos(tailPos.x + 1, tailPos.y);
    } else if (tailPos.x > headPos.x && tailPos.x !== headPos.x + 1) {
      setTailPos(tailPos.x - 1, tailPos.y);
    } else if (tailPos.y < headPos.y && tailPos.y !== headPos.y - 1) {
      setTailPos(tailPos.x, tailPos.y + 1);
    } else if (tailPos.y > headPos.y && tailPos.y !== headPos.y + 1) {
      setTailPos(tailPos.x, tailPos.y - 1);
    }
  };

  for (let i = 0; i < moves.length; i++) {
    const [dir, count] = moves[i].split(' ');
    let j = parseInt(count);

    while (j) {
      switch (dir) {
        case 'L':
          headPos.x--;
          break;
        case 'R':
          headPos.x++;
          break;
        case 'U':
          headPos.y++;
          break;
        case 'D':
          headPos.y--;
          break;
      }

      updateTailPos();
      j--;
    }
  }

  return Object.values(coords).length + 1;
}

type Point = { x: number; y: number };
type Rope = Point[];

function solveTwo(movesX: string) {
  const moves = normalize(movesX).reduce((acc, move) => {
    const [dir, count] = move.split(' ');
    let i = 0;
    while (i < parseInt(count)) {
      acc.push(dir);
      i++;
    }
    return acc;
  }, [] as string[]);

  const tailMoves: Record<string, number> = {};
  function changeRope(move: string, rope: Rope) {
    const moveHead = (move: string, head: Point) => {
      switch (move) {
        case 'L':
          head.x--;
          break;
        case 'R':
          head.x++;
          break;
        case 'U':
          head.y++;
          break;
        case 'D':
          head.y--;
          break;
      }

      return head;
    };

    const moveTail = (head: Point, tail: Point) => {
      let { x, y } = tail;

      if (head.x !== x && head.y !== y) {
        if (head.x - x > 1) {
          y = Math.abs(head.y - y) === 2 ? Math.ceil((head.y + y) / 2) : head.y;
          x = head.x - 1;
        } else if (x - head.x > 1) {
          y = Math.abs(head.y - y) === 2 ? Math.ceil((head.y + y) / 2) : head.y;
          x = head.x + 1;
        } else if (head.y - y > 1) {
          x = Math.abs(head.x - x) === 2 ? Math.ceil((head.x + x) / 2) : head.x;
          y = head.y - 1;
        } else if (y - head.y > 1) {
          x = Math.abs(head.x - x) === 2 ? Math.ceil((head.x + x) / 2) : head.x;
          y = head.y + 1;
        }
      } else if (head.x > x) {
        x = head.x - 1;
      } else if (head.y > y) {
        y = head.y - 1;
      } else if (y > head.y) {
        y = head.y + 1;
      } else if (x > head.x) {
        x = head.x + 1;
      }

      tail.x = x;
      tail.y = y;

      return tail;
    };

    for (let i = 0; i < rope.length; i++) {
      if (i === 0) {
        moveHead(move, rope[0]);
      } else if (rope[i - 1].x === rope[i].x && rope[i - 1].y === rope[i].y) {
        return rope;
      } else {
        let tail = { x: rope[i].x, y: rope[i].y };
        rope[i] = moveTail(rope[i - 1], rope[i]);

        if (
          i === rope.length - 1 &&
          (tail.x !== rope[i].x || tail.y !== rope[i].y)
        ) {
          const key = tail.x + ',' + tail.y;
          if (tailMoves[key]) {
            tailMoves[key]++;
          } else {
            tailMoves[key] = 1;
          }
        }
      }
    }

    return rope;
  }

  let rope = Array(10)
    .fill(null)
    .map((_) => ({ x: 0, y: 0 }));

  for (let i = 0; i < moves.length; i++) {
    rope = changeRope(moves[i], rope);
  }

  return Object.values(tailMoves).length + 1;
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

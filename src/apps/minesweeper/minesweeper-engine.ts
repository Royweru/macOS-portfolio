export const MINESWEEPER_WIDTH = 9;
export const MINESWEEPER_MINE_COUNT = 10;
export const MINESWEEPER_CELLS = Array.from({ length: MINESWEEPER_WIDTH * MINESWEEPER_WIDTH }, (_, index) => index);

export const countAdjacentMines97 = (index: number, board: Set<number>) => {
  const row = Math.floor(index / MINESWEEPER_WIDTH);
  const col = index % MINESWEEPER_WIDTH;
  let count = 0;
  for (let y = row - 1; y <= row + 1; y += 1) {
    for (let x = col - 1; x <= col + 1; x += 1) {
      if (x >= 0 && x < MINESWEEPER_WIDTH && y >= 0 && y < MINESWEEPER_WIDTH && board.has(y * MINESWEEPER_WIDTH + x)) count += 1;
    }
  }
  return count;
};

export const generateMines97 = (safeIndex: number) => {
  const safe = new Set<number>([safeIndex]);
  const row = Math.floor(safeIndex / MINESWEEPER_WIDTH);
  const col = safeIndex % MINESWEEPER_WIDTH;
  for (let y = row - 1; y <= row + 1; y += 1) {
    for (let x = col - 1; x <= col + 1; x += 1) {
      if (x >= 0 && x < MINESWEEPER_WIDTH && y >= 0 && y < MINESWEEPER_WIDTH) safe.add(y * MINESWEEPER_WIDTH + x);
    }
  }
  const available = MINESWEEPER_CELLS.filter(index => !safe.has(index));
  const mines = new Set<number>();
  while (mines.size < MINESWEEPER_MINE_COUNT && available.length) mines.add(available.splice(Math.floor(Math.random() * available.length), 1)[0]);
  return mines;
};

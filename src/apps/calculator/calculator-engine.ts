export const calculate97 = (left: number, operator: string, right: number) => operator === '+'
  ? left + right
  : operator === '-'
    ? left - right
    : operator === '×'
      ? left * right
      : operator === '÷'
        ? (right === 0 ? Number.NaN : left / right)
        : right;

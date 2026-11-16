export function evaluateSequenceOrder(
  selectedOrder: string[],
  expectedOrder: string[],
): boolean {
  if (selectedOrder.length !== expectedOrder.length) return false;
  return selectedOrder.every((id, index) => id === expectedOrder[index]);
}

export function arraysEqual(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  return a.every((item, idx) => item === b[idx]);
}

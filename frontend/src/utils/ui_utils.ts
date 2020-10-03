export function isBefore(e: any): boolean {
  const boundingRect = e.target.getBoundingClientRect();
  const height = boundingRect.bottom - boundingRect.top;
  const isBefore = e.clientY - boundingRect.top < 0.5 * height;
  return isBefore;
}

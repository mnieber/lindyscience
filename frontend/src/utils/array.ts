export const maybeArrayToArray = (x: any): Array<any> => {
  return Array.isArray(x) ? x : [x];
};

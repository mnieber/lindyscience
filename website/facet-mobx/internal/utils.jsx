export function lookUp(keys: Array<any>, obj: any): Array<any> {
  return keys.map(x => obj[x]);
}

export function range(start: number, stop: number) {
  var ans = [];
  for (let i = start; i < stop; i++) {
    ans.push(i);
  }
  return ans;
}

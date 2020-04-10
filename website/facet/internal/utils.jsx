// @flow

export function getOrCreate(obj: any, key: string | Symbol, fn: Function) {
  if (!obj[key]) {
    obj[key] = fn();
  }
  return obj[key];
}

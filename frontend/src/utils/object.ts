export const clearObject = (obj: any) => {
  for (const prop of Object.getOwnPropertyNames(obj)) {
    delete obj[prop];
  }
};

export type GenericObjectT = { [name: string]: any };

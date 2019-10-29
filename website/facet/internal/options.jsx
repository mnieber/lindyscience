// @flow

export const options = {
  logging: false,
  formatObject: (x: any) => x,
};

type ContextT = {
  name?: string,
  ctr?: any,
};

// TODO: use getContext and setContext
const ContextStore = { context: {} };

export const getContext = (): ContextT => ContextStore.context;
export const setContext = (context: any) => (ContextStore.context = context);
export const clearContext = () => (ContextStore.context = {});

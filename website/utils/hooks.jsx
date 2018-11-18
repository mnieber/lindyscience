// @flow

import { useState } from 'react';

// Hooks

export type FlagT = {
  flag: boolean,
  setTrue: (() => any),
  setFalse: (() => any),
};

export function useFlag(initialState: boolean, decorator:any=undefined): FlagT {
  const [flag, setFlag] = useState(initialState);

  const decoratedSetFlag = decorator !== undefined
    ? decorator(setFlag)
    : setFlag;

  function setTrue() {
    decoratedSetFlag(true);
  }

  function setFalse() {
    decoratedSetFlag(false);
  }

  return {flag, setTrue, setFalse};
}

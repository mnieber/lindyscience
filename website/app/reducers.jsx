// @flow

///////////////////////////////////////////////////////////////////////
// Status
///////////////////////////////////////////////////////////////////////

type StatusStateT = {};

export type ReducerStateT = StatusStateT;

const statusReducer = function(
  state: StatusStateT = {},
  action: any
): StatusStateT {
  switch (action.type) {
    default:
      return state;
  }
};

export const reducer = statusReducer;

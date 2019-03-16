// @flow

import { combineReducers } from "redux";
import { reducer as movesReducer } from "moves/reducers";
import { reducer as appReducer } from "app/reducers";
import { reducer as toastrReducer } from "react-redux-toastr";

import type { ReducerStateT as MovesReducerStateT } from "moves/reducers";
import type { ReducerStateT as AppReducerStateT } from "app/reducers";

type ReducerStateT = {
  toastr: any,
  moves: MovesReducerStateT,
  app: AppReducerStateT,
};

// $FlowFixMe
export const reducer: ReducerStateT = combineReducers({
  toastr: toastrReducer,
  moves: movesReducer,
  app: appReducer,
});

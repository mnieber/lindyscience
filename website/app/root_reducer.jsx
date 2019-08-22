// @flow

import { combineReducers } from "redux";
import { reducer as movesReducer } from "moves/reducers";
import { reducer as votesReducer } from "votes/reducers";
import { reducer as appReducer } from "app/reducers";
import { reducer as toastrReducer } from "react-redux-toastr";

import type { ReducerStateT as MovesReducerStateT } from "moves/reducers";
import type { ReducerStateT as AppReducerStateT } from "app/reducers";
import type { ReducerStateT as VotesReducerStateT } from "votes/reducers";
import type { InputSelector } from "reselect";

export type RootReducerStateT = {
  toastr: any,
  moves: MovesReducerStateT,
  app: AppReducerStateT,
  votes: VotesReducerStateT,
};

export type Selector<TResult> = InputSelector<RootReducerStateT, void, TResult>;

// $FlowFixMe
export const reducer: RootReducerStateT = combineReducers({
  toastr: toastrReducer,
  moves: movesReducer,
  votes: votesReducer,
  app: appReducer,
});

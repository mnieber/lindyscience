// @flow

import { combineReducers } from "redux";
import { reducer as screensReducer } from "screens/reducers";
import { reducer as movesReducer } from "moves/reducers";
import { reducer as votesReducer } from "votes/reducers";
import { reducer as tipsReducer } from "tips/reducers";
import { reducer as profileReducer } from "profiles/reducers";
import { reducer as appReducer } from "app/reducers";
import { reducer as moveListsReducer } from "move_lists/reducers";
import { reducer as toastrReducer } from "react-redux-toastr";
import { reducer as videoReducer } from "video/reducers";

import type { ReducerStateT as ScreensReducerStateT } from "screens/reducers";
import type { ReducerStateT as MovesReducerStateT } from "moves/reducers";
import type { ReducerStateT as TipsReducerStateT } from "tips/reducers";
import type { ReducerStateT as VotesReducerStateT } from "votes/reducers";
import type { ReducerStateT as AppReducerStateT } from "app/reducers";
import type { ReducerStateT as MoveListsReducerStateT } from "move_lists/reducers";
import type { ReducerStateT as ProfilesReducerStateT } from "profiles/reducers";
import type { ReducerStateT as VideoReducerStateT } from "video/reducers";
import type { InputSelector } from "reselect";

export type RootReducerStateT = {
  toastr: any,
  screens: ScreensReducerStateT,
  moves: MovesReducerStateT,
  votes: VotesReducerStateT,
  profile: ProfilesReducerStateT,
  app: AppReducerStateT,
  tips: TipsReducerStateT,
  moveLists: MoveListsReducerStateT,
  video: VideoReducerStateT,
};

export type Selector<TResult> = InputSelector<RootReducerStateT, void, TResult>;

// $FlowFixMe
export const reducer: RootReducerStateT = combineReducers({
  toastr: toastrReducer,
  screens: screensReducer,
  moves: movesReducer,
  votes: votesReducer,
  profile: profileReducer,
  app: appReducer,
  tips: tipsReducer,
  moveLists: moveListsReducer,
  video: videoReducer,
});

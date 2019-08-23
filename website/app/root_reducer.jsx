// @flow

import { combineReducers } from "redux";
import { reducer as screensReducer } from "screens/reducers";
import { reducer as votesReducer } from "votes/reducers";
import { reducer as tipsReducer } from "tips/reducers";
import { reducer as videoLinksReducer } from "videolinks/reducers";
import { reducer as profileReducer } from "profiles/reducers";
import { reducer as appReducer } from "app/reducers";
import { reducer as toastrReducer } from "react-redux-toastr";

import type { ReducerStateT as ScreensReducerStateT } from "screens/reducers";
import type { ReducerStateT as VideoLinksReducerStateT } from "videolinks/reducers";
import type { ReducerStateT as TipsReducerStateT } from "tips/reducers";
import type { ReducerStateT as VotesReducerStateT } from "votes/reducers";
import type { ReducerStateT as AppReducerStateT } from "app/reducers";
import type { ReducerStateT as ProfilesReducerStateT } from "profiles/reducers";
import type { InputSelector } from "reselect";

export type RootReducerStateT = {
  toastr: any,
  screens: ScreensReducerStateT,
  votes: VotesReducerStateT,
  profile: ProfilesReducerStateT,
  app: AppReducerStateT,
  videoLinks: VideoLinksReducerStateT,
  tips: TipsReducerStateT,
};

export type Selector<TResult> = InputSelector<RootReducerStateT, void, TResult>;

// $FlowFixMe
export const reducer: RootReducerStateT = combineReducers({
  toastr: toastrReducer,
  screens: screensReducer,
  votes: votesReducer,
  profile: profileReducer,
  app: appReducer,
  videoLinks: videoLinksReducer,
  tips: tipsReducer,
});

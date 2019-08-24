// @flow

import { combineReducers } from "redux";
import { reducer as screensReducer } from "screens/reducers";
import { reducer as movesReducer } from "moves/reducers";
import { reducer as tagsReducer } from "tags/reducers";
import { reducer as votesReducer } from "votes/reducers";
import { reducer as tipsReducer } from "tips/reducers";
import { reducer as videoLinksReducer } from "videolinks/reducers";
import { reducer as profileReducer } from "profiles/reducers";
import { reducer as appReducer } from "app/reducers";
import { reducer as moveListsReducer } from "move_lists/reducers";
import { reducer as toastrReducer } from "react-redux-toastr";

import type { ReducerStateT as ScreensReducerStateT } from "screens/reducers";
import type { ReducerStateT as MovesReducerStateT } from "moves/reducers";
import type { ReducerStateT as TagsReducerStateT } from "tags/reducers";
import type { ReducerStateT as VideoLinksReducerStateT } from "videolinks/reducers";
import type { ReducerStateT as TipsReducerStateT } from "tips/reducers";
import type { ReducerStateT as VotesReducerStateT } from "votes/reducers";
import type { ReducerStateT as AppReducerStateT } from "app/reducers";
import type { ReducerStateT as MoveListsReducerStateT } from "move_lists/reducers";
import type { ReducerStateT as ProfilesReducerStateT } from "profiles/reducers";
import type { InputSelector } from "reselect";

export type RootReducerStateT = {
  toastr: any,
  screens: ScreensReducerStateT,
  moves: MovesReducerStateT,
  votes: VotesReducerStateT,
  profile: ProfilesReducerStateT,
  app: AppReducerStateT,
  videoLinks: VideoLinksReducerStateT,
  tips: TipsReducerStateT,
  tags: TagsReducerStateT,
  moveLists: MoveListsReducerStateT,
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
  videoLinks: videoLinksReducer,
  tips: tipsReducer,
  tags: tagsReducer,
  moveLists: moveListsReducer,
});

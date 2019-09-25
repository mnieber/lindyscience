// @flow

import { createSelector } from "reselect";
import { isNone, reduceMapToMap } from "utils/utils";

import type { UUID } from "kernel/types";
import type { RootReducerStateT, Selector } from "app/root_reducer";

const _stateCutVideo = (state: RootReducerStateT): CutVideoStateT =>
  state.video;

///////////////////////////////////////////////////////////////////////
// Tips
///////////////////////////////////////////////////////////////////////

type CutVideoStateT = {
  link: string,
};

export type ReducerStateT = CutVideoStateT;

export function cutVideoReducer(
  state: CutVideoStateT = { link: "" },
  action: any
): CutVideoStateT {
  switch (action.type) {
    case "SET_CUT_VIDEO_LINK":
      return {
        ...state,
        link: action.link,
      };
    default:
      return state;
  }
}

export const reducer = cutVideoReducer;

export function getCutVideoLink(state: RootReducerStateT) {
  return state.video.link;
}

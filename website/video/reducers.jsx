// @flow

import { combineReducers } from "redux";
import { createSelector } from "reselect";
import { isNone, reduceMapToMap } from "utils/utils";
import { getInsertionIndex } from "utils/get_insertion_index";

import type { UUID } from "kernel/types";
import type { CutPointT } from "video/types";
import type { RootReducerStateT, Selector } from "app/root_reducer";

const _stateCutVideo = (state: RootReducerStateT): CutVideoStateT =>
  state.video.cutVideo;
const _stateCutPointContainer = (
  state: RootReducerStateT
): DataContainerState => state.video.cutPointContainer;

type DataContainerState = {
  targetItemId: ?UUID,
  payload: Array<any>,
  isEditing: boolean,
};

export function cutPointContainerReducer(
  state: DataContainerState = {
    targetItemId: null,
    payload: [],
    isEditing: false,
  },
  action: any
): DataContainerState {
  switch (action.type) {
    case "SET_CUTPOINT_CONTAINER_PAYLOAD":
      return {
        ...state,
        targetItemId: action.targetItemId,
        payload: action.payload,
      };
    case "SET_IS_EDITING_CUTPOINT":
      return {
        ...state,
        isEditing: action.isEditing,
      };
    default:
      return state;
  }
}

type CutVideoStateT = {
  link: string,
};

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

type CutPointsStateT = Array<CutPointT>;

export function cutPointsReducer(
  state: CutPointsStateT = [],
  action: any
): CutPointsStateT {
  switch (action.type) {
    case "CLEAR_CUT_POINTS":
      return [];
    case "INSERT_CUT_POINTS":
      const cmp = (lhs, rhs) => rhs.t - lhs.t;
      return action.cutPoints.reduce((acc, cutPoint) => {
        const idx = getInsertionIndex(acc, action.cutPoint, cmp);
        return [...acc.slice(0, idx), action.cutPoint, ...acc.slice(idx)];
      }, state);
    default:
      return state;
  }
}

export type ReducerStateT = {
  cutVideo: CutVideoStateT,
  cutPoints: CutPointsStateT,
  cutPointContainer: DataContainerState,
};

export const reducer = combineReducers({
  cutVideo: cutVideoReducer,
  cutPoints: cutPointsReducer,
  cutPointContainer: cutPointContainerReducer,
});

export function getCutVideoLink(state: RootReducerStateT) {
  return state.video.cutVideo.link;
}

export function getCutVideoCutPoints(state: RootReducerStateT) {
  return state.video.cutPoints;
}

export const getCutPointContainerPayload: Selector<DataContainerState> = createSelector(
  [_stateCutPointContainer],
  (stateCutPointContainer): DataContainerState => {
    return stateCutPointContainer;
  }
);

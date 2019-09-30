// @flow

import { combineReducers } from "redux";
import { createSelector } from "reselect";

import type { PayloadT } from "screens/containers/data_container";
import { isNone, reduceMapToMap } from "utils/utils";
import { getInsertionIndex } from "utils/get_insertion_index";
import type { UUID } from "kernel/types";
import type { CutPointT } from "video/types";
import type { RootReducerStateT, Selector } from "app/root_reducer";

const _stateCutVideo = (state: RootReducerStateT): CutVideoStateT =>
  state.video.cutVideo;

type DataContainerState = {
  payload: PayloadT<CutPointT>,
  isEditing: boolean,
};

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
    case "ADD_CUT_POINTS":
      const cmp = (lhs, rhs) => lhs.t - rhs.t;
      return action.cutPoints.reduce((acc, cutPoint) => {
        const existingCutPoint = acc.find(
          x => x.type == cutPoint.type && x.t == cutPoint.t
        );

        if (existingCutPoint && existingCutPoint.id != cutPoint.id) {
          return acc;
        } else if (existingCutPoint) {
          const idx = acc.indexOf(existingCutPoint);
          return [
            ...acc.slice(0, idx),
            { ...existingCutPoint, ...cutPoint },
            ...acc.slice(idx + 1),
          ];
        } else {
          const idx = getInsertionIndex(acc, cutPoint, cmp);
          return [...acc.slice(0, idx), cutPoint, ...acc.slice(idx)];
        }
      }, state);
    case "REMOVE_CUT_POINT":
      return state.filter(x => x.id != action.cutPointId);
    default:
      return state;
  }
}

export type ReducerStateT = {
  cutVideo: CutVideoStateT,
  cutPoints: CutPointsStateT,
};

export const reducer = combineReducers({
  cutVideo: cutVideoReducer,
  cutPoints: cutPointsReducer,
});

export function getCutVideoLink(state: RootReducerStateT) {
  return state.video.cutVideo.link;
}

export function getCutPoints(state: RootReducerStateT) {
  return state.video.cutPoints;
}

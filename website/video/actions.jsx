// @flow

import * as fromStore from "video/reducers";

import type { CutPointT } from "video/types";

export function actSetCutVideoLink(link: string) {
  const createAction = () => ({
    type: "SET_CUT_VIDEO_LINK",
    link,
  });

  return (dispatch: Function, getState: Function) => {
    const mustClear = fromStore.getCutVideoLink(getState()) != link;
    if (mustClear) {
      dispatch(actClearCutPoints());
    }
    dispatch(createAction());
  };
}

export function actClearCutPoints() {
  return {
    type: "CLEAR_CUT_POINTS",
  };
}

export function actAddCutPoints(cutPoints: Array<CutPointT>) {
  return {
    type: "ADD_CUT_POINTS",
    cutPoints,
  };
}

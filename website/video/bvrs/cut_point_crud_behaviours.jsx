// @flow

import * as React from "react";

import { createUUID } from "utils/utils2";

import type { CutPointT, VideoBvrT } from "video/types";
import type { UUID } from "kernel/types";

export type EditCutPointBvrT = {
  add: Function,
  save: Function,
};

export function useEditCutPoint(
  cutPoints: Array<CutPointT>,
  videoBvr: VideoBvrT,
  addCutPoint: CutPointT => void
): EditCutPointBvrT {
  function _createNewCutPoint(cutPointType: "start" | "end"): CutPointT {
    return {
      id: createUUID(),
      t: videoBvr.player ? videoBvr.player.getCurrentTime() : 0,
      type: cutPointType,
      name: cutPointType == "start" ? "New move" : "",
      description: "",
      tags: [],
    };
  }

  function add(cutPointType: "start" | "end") {
    const newCutPoint = _createNewCutPoint(cutPointType);
    addCutPoint(newCutPoint);
  }

  function save(id: UUID, values: any) {
    const cutPoint: CutPointT = {
      ...cutPoints.find(x => x.id == id),
      ...values,
    };

    addCutPoint(cutPoint);
  }

  return { add, save };
}

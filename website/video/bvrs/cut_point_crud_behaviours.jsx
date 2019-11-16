// @flow

import type { CutPointT } from "video/types";
import { createUUID } from "utils/utils";
import { VideoController } from "screens/move_container/facets/video_controller";
import type { UUID } from "kernel/types";

export type EditCutPointBvrT = {
  add: Function,
  save: Function,
};

export function useEditCutPoint(
  cutPoints: Array<CutPointT>,
  videoCtr: VideoController,
  addCutPoint: CutPointT => void
): EditCutPointBvrT {
  function _createNewCutPoint(cutPointType: "start" | "end"): CutPointT {
    return {
      id: createUUID(),
      t: videoCtr.getPlayer() ? videoCtr.getPlayer().getCurrentTime() : 0,
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

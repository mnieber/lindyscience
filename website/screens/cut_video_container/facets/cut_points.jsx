// @flow

import type { MoveListT } from "move_lists/types";
import type { UserProfileT } from "profiles/types";
import type { MoveT } from "moves/types";
import {
  type GetFacet,
  data,
  facetClass,
  input,
  handle,
  operation,
} from "facet";
import { getInsertionIndex } from "utils/get_insertion_index";
import { createUUID, isNone } from "utils/utils";
import { action, observable } from "utils/mobx_wrapper";
import { VideoController } from "screens/move_container/facets/video_controller";
import type { CutPointT } from "video/types";
import type { UUID } from "kernel/types";

// $FlowFixMe
@facetClass
export class CutPoints {
  @input createMove: (cutPoint: CutPointT, videoLink: string) => MoveT;
  @input saveMoves: (moves: Array<MoveT>) => any;
  @observable @input videoCtr: VideoController;
  @observable @data cutPoints: Array<CutPointT>;
  // $FlowFixMe
  @operation add(cutPointType: "start" | "end") {}
  // $FlowFixMe
  @operation remove(cutPointIds: Array<UUID>) {}
  // $FlowFixMe
  @operation save(values: any) {}
  // $FlowFixMe
  @operation setVideoLink(videoLink: string) {}

  get videoLink() {
    return this.videoCtr && this.videoCtr.video ? this.videoCtr.video.link : "";
  }

  createMoves() {
    return _createMovesFromCutPoints(this);
  }

  static get: GetFacet<CutPoints>;
}

function _createNewCutPoint(
  cutPointType: "start" | "end",
  time: number
): CutPointT {
  return {
    id: createUUID(),
    t: time,
    type: cutPointType,
    name: cutPointType == "start" ? "New move" : "",
    description: "",
    tags: [],
  };
}

function _addCutPoints(self: CutPoints, cutPoints: Array<CutPointT>) {
  const cmp = (lhs, rhs) => lhs.t - rhs.t;
  self.cutPoints = cutPoints.reduce((acc, cutPoint) => {
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
  }, self.cutPoints);
}

function handleAdd(self: CutPoints) {
  handle(
    self,
    "add",
    action((cutPointType: "start" | "end") => {
      const newCutPoint = _createNewCutPoint(
        cutPointType,
        self.videoCtr.getPlayer().getCurrentTime()
      );
      _addCutPoints(self, [newCutPoint]);
    })
  );
}

function handleSetVideoLink(self: CutPoints) {
  handle(
    self,
    "setVideoLink",
    action((videoLink: string) => {
      if (self.videoLink != videoLink) {
        self.cutPoints = [];
        self.videoCtr = new VideoController();
        self.videoCtr.video = {
          link: videoLink,
          startTimeMs: undefined,
          endTimeMs: undefined,
        };
      }
    })
  );
}

function handleSave(self: CutPoints) {
  handle(
    self,
    "save",
    action((values: any) => {
      const existingCutPoint = self.cutPoints.find(x => x.id == values.id);
      const cutPoint: CutPointT = {
        ...existingCutPoint,
        ...values,
      };

      _addCutPoints(self, [cutPoint]);
    })
  );
}

function handleRemove(self: CutPoints) {
  handle(
    self,
    "remove",
    action((cutPointIds: Array<UUID>) => {
      self.cutPoints = self.cutPoints.filter(x => !cutPointIds.includes(x.id));
    })
  );
}

function _createMovesFromCutPoints(self: CutPoints) {
  const newMoves = self.cutPoints.reduce((acc, cutPoint) => {
    if (cutPoint.type == "end") {
      const lastMoveIdx = acc.length - 1;
      const lastMove = acc.length ? acc[lastMoveIdx] : undefined;
      return lastMove && isNone(lastMove.endTimeMs)
        ? [
            ...acc.slice(0, lastMoveIdx),
            { ...lastMove, endTimeMs: cutPoint.t * 1000 },
          ]
        : acc;
    } else {
      const newMove = self.createMove(cutPoint, self.videoLink);
      return [...acc, newMove];
    }
  }, []);
  return self.saveMoves(newMoves);
}

export function initCutPoints(
  self: CutPoints,
  createMove: (cutPoint: CutPointT, videoLink: string) => MoveT,
  saveMoves: (moves: Array<MoveT>) => any
) {
  self.createMove = createMove;
  self.saveMoves = saveMoves;
  self.videoCtr = new VideoController();
  self.cutPoints = [];
  handleSetVideoLink(self);
  handleAdd(self);
  handleRemove(self);
  handleSave(self);
  return self;
}

import { observable } from 'src/utils/mobx_wrapper';
import { data, input, operation } from 'facet';
import { installHandlers } from 'facet-mobx';
import { CutPointT } from 'src/video/types';
import { MoveT } from 'src/moves/types';
import { VideoController } from 'src/moves/MoveCtr/facets/VideoController';
import { UUID } from 'src/kernel/types';
import { createUUID, isNone } from 'src/utils/utils';
import { getInsertionIndex } from 'src/utils/get_insertion_index';

export class CutPoints {
  @input createMove: (cutPoint: CutPointT, videoLink: string) => MoveT;
  @input saveMoves: (moves: Array<MoveT>) => any;
  @observable @input videoController: VideoController;
  @observable @data cutPoints: Array<CutPointT>;

  @operation add(cutPointType: 'start' | 'end') {}
  @operation remove(cutPointIds: Array<UUID>) {}
  @operation save(values: any) {}
  @operation setVideoLink(videoLink: string) {}

  get videoLink() {
    return this.videoController?.video?.link || '';
  }

  createMoves() {
    return _createMovesFromCutPoints(this);
  }

  constructor(
    createMove: (cutPoint: CutPointT, videoLink: string) => MoveT,
    saveMoves: (moves: Array<MoveT>) => any
  ) {
    this.createMove = createMove;
    this.saveMoves = saveMoves;
    this.videoController = new VideoController();
    this.cutPoints = [];
  }

  static get = (ctr: any): CutPoints => ctr.cutpoints;
}

function _createNewCutPoint(
  cutPointType: 'start' | 'end',
  time: number
): CutPointT {
  return {
    id: createUUID(),
    t: time,
    type: cutPointType,
    name: cutPointType === 'start' ? 'New move' : '',
    description: '',
    tags: [],
  };
}

function _addCutPoints(self: CutPoints, cutPoints: Array<CutPointT>) {
  const cmp = (lhs: CutPointT, rhs: CutPointT) => lhs.t - rhs.t;
  self.cutPoints = cutPoints.reduce((acc: any, cutPoint: CutPointT) => {
    const existingCutPoint = acc.find(
      (x: CutPointT) => x.type === cutPoint.type && x.t === cutPoint.t
    );

    if (existingCutPoint && existingCutPoint.id !== cutPoint.id) {
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

function handleAdd(this: CutPoints, cutPointType: 'start' | 'end') {
  const newCutPoint = _createNewCutPoint(
    cutPointType,
    this.videoController.getPlayer().getCurrentTime()
  );
  _addCutPoints(this, [newCutPoint]);
}

function handleSetVideoLink(this: CutPoints, videoLink: string) {
  if (this.videoLink !== videoLink) {
    this.cutPoints = [];
    this.videoController = new VideoController();
    this.videoController.video = {
      link: videoLink,
      startTimeMs: undefined,
      endTimeMs: undefined,
    };
  }
}

function handleSave(this: CutPoints, values: any) {
  const existingCutPoint = this.cutPoints.find(
    (x: CutPointT) => x.id === values.id
  );
  const cutPoint: CutPointT = {
    ...existingCutPoint,
    ...values,
  };

  _addCutPoints(this, [cutPoint]);
}

function handleRemove(this: CutPoints, cutPointIds: Array<UUID>) {
  this.cutPoints = this.cutPoints.filter(
    (x: CutPointT) => !cutPointIds.includes(x.id)
  );
}

function _createMovesFromCutPoints(self: CutPoints) {
  const newMoves: Array<MoveT> = self.cutPoints.reduce(
    (acc: any, cutPoint: CutPointT) => {
      if (cutPoint.type === 'end') {
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
    },
    []
  );
  return self.saveMoves(newMoves);
}

export function initCutPoints(self: CutPoints) {
  installHandlers(
    {
      remove: handleRemove,
      save: handleSave,
      add: handleAdd,
      setVideoLink: handleSetVideoLink,
    },
    self
  );
  return self;
}

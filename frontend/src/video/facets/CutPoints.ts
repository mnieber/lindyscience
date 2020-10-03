import { CutPointT } from 'src/video/types';
import { MoveT } from 'src/moves/types';
import { action, observable } from 'src/utils/mobx_wrapper';
import { VideoController } from 'src/moves/MoveCtr/facets/VideoController';
import { UUID } from 'src/kernel/types';
import { createUUID, isNone } from 'src/utils/utils';
import { getInsertionIndex } from 'src/utils/get_insertion_index';
import { data, handle, input, operation } from 'src/npm/facet';

export class CutPoints {
  @input createMove?: (cutPoint: CutPointT, videoLink: string) => MoveT;
  @input saveMoves?: (moves: Array<MoveT>) => any;
  @observable @input videoController?: VideoController;
  @observable @data cutPoints?: Array<CutPointT>;

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
    name: cutPointType == 'start' ? 'New move' : '',
    description: '',
    tags: [],
  };
}

function _addCutPoints(self: CutPoints, cutPoints: Array<CutPointT>) {
  const cmp = (lhs: CutPointT, rhs: CutPointT) => lhs.t - rhs.t;
  self.cutPoints = cutPoints.reduce((acc: any, cutPoint: CutPointT) => {
    const existingCutPoint = acc.find(
      (x: CutPointT) => x.type == cutPoint.type && x.t == cutPoint.t
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
    'add',
    action((cutPointType: 'start' | 'end') => {
      const newCutPoint = _createNewCutPoint(
        cutPointType,
        (self.videoController as any).getPlayer().getCurrentTime()
      );
      _addCutPoints(self, [newCutPoint]);
    })
  );
}

function handleSetVideoLink(self: CutPoints) {
  handle(
    self,
    'setVideoLink',
    action((videoLink: string) => {
      if (self.videoLink != videoLink) {
        self.cutPoints = [];
        self.videoController = new VideoController();
        self.videoController.video = {
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
    'save',
    action((values: any) => {
      const existingCutPoint = (self.cutPoints as any).find(
        (x: CutPointT) => x.id == values.id
      );
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
    'remove',
    action((cutPointIds: Array<UUID>) => {
      self.cutPoints = (self.cutPoints as any).filter(
        (x: CutPointT) => !cutPointIds.includes(x.id)
      );
    })
  );
}

function _createMovesFromCutPoints(self: CutPoints) {
  const newMoves: Array<MoveT> = (self.cutPoints as any).reduce(
    (acc: any, cutPoint: CutPointT) => {
      if (cutPoint.type == 'end') {
        const lastMoveIdx = acc.length - 1;
        const lastMove = acc.length ? acc[lastMoveIdx] : undefined;
        return lastMove && isNone(lastMove.endTimeMs)
          ? [
              ...acc.slice(0, lastMoveIdx),
              { ...lastMove, endTimeMs: cutPoint.t * 1000 },
            ]
          : acc;
      } else {
        const newMove = (self.createMove as any)(cutPoint, self.videoLink);
        return [...acc, newMove];
      }
    },
    []
  );
  return (self.saveMoves as any)(newMoves);
}

export function initCutPoints(
  self: CutPoints,
  createMove: (cutPoint: CutPointT, videoLink: string) => MoveT,
  saveMoves: (moves: Array<MoveT>) => any
) {
  self.createMove = createMove;
  self.saveMoves = saveMoves;
  self.videoController = new VideoController();
  self.cutPoints = [];
  handleSetVideoLink(self);
  handleAdd(self);
  handleRemove(self);
  handleSave(self);
  return self;
}

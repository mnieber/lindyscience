import * as _ from 'lodash/fp';
import { makeObservable, action, computed, observable } from 'mobx';
import { host, stub } from 'aspiration';
import { CutPointByIdT, CutPointT } from 'src/video/types';
import { MoveListT } from 'src/move_lists/types';
import { UserProfileT } from 'src/profiles/types';
import { listToItemById } from 'src/utils/utils';
import { VideoController } from 'src/moves/MoveCtr/facets/VideoController';

export class CutPointsStore_createMoves {
  createMoves() {}
  moveList: MoveListT = stub();
  userProfile: UserProfileT = stub();
}

export class CutPointsStore {
  @observable cutPointById: CutPointByIdT = {};
  @observable videoController: VideoController = new VideoController(true);

  constructor() {
    makeObservable(this);
  }

  @action setVideoLink(videoLink: string) {
    if (this.videoLink !== videoLink) {
      this.cutPointById = {};

      this.videoController = new VideoController(true);

      this.videoController.video = {
        link: videoLink,
        startTimeMs: undefined,
        endTimeMs: undefined,
      };
    }
  }

  @host createMoves(moveList: MoveListT, userProfile: UserProfileT) {
    return action((cbs: CutPointsStore_createMoves) => {
      cbs.createMoves();
    });
  }

  get videoLink() {
    return this.videoController?.video?.link || '';
  }

  @computed get cutPoints() {
    return _.flow(
      _.always(this.cutPointById),
      _.values,
      _.sortBy(_.property('t'))
    )();
  }

  @action addCutPoints(cutPoints: CutPointT[]) {
    this.cutPointById = {
      ...this.cutPointById,
      ...listToItemById(cutPoints),
    };
  }

  @action deleteCutPointsById(cutPointIds: string[]) {
    this.cutPointById = _.omit(cutPointIds)(this.cutPointById) as CutPointByIdT;
  }

  static get = (ctr: any): CutPointsStore => ctr.cutPointsStore;
}

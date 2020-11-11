import * as _ from 'lodash/fp';
import { action, computed, observable } from 'src/utils/mobx_wrapper';
import { operation, exec } from 'facet';
import { CutPointByIdT, CutPointT } from 'src/video/types';
import { listToItemById } from 'src/utils/utils';
import { VideoController } from 'src/moves/MoveCtr/facets/VideoController';

export class CutPointsStore {
  @observable cutPointById: CutPointByIdT = {};
  @observable videoController: VideoController = new VideoController();

  @action setVideoLink(videoLink: string) {
    if (this.videoLink !== videoLink) {
      this.cutPointById = {};
      this.videoController = new VideoController();
      this.videoController.video = {
        link: videoLink,
        startTimeMs: undefined,
        endTimeMs: undefined,
      };
    }
  }

  @operation createMoves() {
    exec('createMoves');
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

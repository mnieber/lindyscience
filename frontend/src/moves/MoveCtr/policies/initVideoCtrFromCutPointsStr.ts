import { reaction } from 'mobx';
import { onMakeCtrObservable } from 'skandha-mobx';
import { CutPointsStore } from 'src/video/facets/CutPointsStore';

export const initVideoCtrFromCutPointsStr = (
  cutPointsStore: CutPointsStore
) => (ctr) => {
  onMakeCtrObservable(ctr, () => {
    const cleanUpFunction = reaction(
      () => cutPointsStore.videoLink,
      (videoLink) => {
        ctr.videoController.video = {
          link: videoLink,
          startTimeMs: undefined,
          endTimeMs: undefined,
        };
      }
    );
    ctr.addCleanUpFunction(cleanUpFunction);
  });
};

import { CutPointsStore } from 'src/video/facets/CutPointsStore';
import { createUUID } from 'src/utils/utils';
import { CutPointT } from 'src/video/types';

type PropsT = {
  cutPointType: 'start' | 'end';
};

export function handleCreateCutPoint(
  cutPointsStore: CutPointsStore,
  { cutPointType }: PropsT
): CutPointT {
  const t = cutPointsStore.videoController.getPlayer().getCurrentTime();

  return {
    id: createUUID(),
    t,
    type: cutPointType,
    name: cutPointType === 'start' ? 'New move' : '',
    description: '',
    tags: [],
  };
}

import { CutPointsStore } from 'src/video/facets/CutPointsStore';
import { createUUID } from 'src/utils/utils';
import { CutPointT } from 'src/video/types';
import { getCtr } from 'facet';
import { Addition } from 'facet-mobx/facets/Addition';

type PropsT = {
  cutPointType: 'start' | 'end';
};

export function handleCreateCutPoint(
  this: Addition,
  { cutPointType }: PropsT
): CutPointT {
  const ctr = getCtr(this);
  const t = CutPointsStore.get(ctr)
    .videoController.getPlayer()
    .getCurrentTime();

  return {
    id: createUUID(),
    t,
    type: cutPointType,
    name: cutPointType === 'start' ? 'New move' : '',
    description: '',
    tags: [],
  };
}

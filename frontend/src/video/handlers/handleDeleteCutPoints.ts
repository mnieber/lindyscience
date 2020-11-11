import { CutPointsStore } from 'src/video/facets/CutPointsStore';
import { getCtr } from 'facet';
import { Deletion } from 'facet-mobx/facets/Deletion';

export function handleDeleteCutPoints(this: Deletion, ids: string[]) {
  const ctr = getCtr(this);
  const cutPointsStore = CutPointsStore.get(ctr);
  cutPointsStore.deleteCutPointsById(ids);
}

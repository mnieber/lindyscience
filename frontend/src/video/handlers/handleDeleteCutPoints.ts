import { CutPointsStore } from 'src/video/facets/CutPointsStore';
import { getCtr } from 'facility';
import { Deletion } from 'facility-mobx/facets/Deletion';

export function handleDeleteCutPoints(facet: Deletion, ids: string[]) {
  const ctr = getCtr(facet);
  const cutPointsStore = CutPointsStore.get(ctr);
  cutPointsStore.deleteCutPointsById(ids);
}

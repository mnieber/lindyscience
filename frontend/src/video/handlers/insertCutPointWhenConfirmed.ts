import { CutPointsStore } from 'src/video/facets/CutPointsStore';
import { Addition } from 'facility-mobx/facets/Addition';

export function insertCutPointWhenConfirmed(
  facet: Addition,
  cutPointsStore: CutPointsStore
) {
  cutPointsStore.addCutPoints([facet.item]);
}

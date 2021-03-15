import { CutPointsStore } from 'src/video/facets/CutPointsStore';
import { Addition } from 'skandha-facets/Addition';

export function insertCutPointWhenConfirmed(
  facet: Addition,
  cutPointsStore: CutPointsStore
) {
  cutPointsStore.addCutPoints([facet.item]);
}

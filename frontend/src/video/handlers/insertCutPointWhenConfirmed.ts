import { getCtr } from 'facility';
import { CutPointsStore } from 'src/video/facets/CutPointsStore';
import { Addition } from 'facility-mobx/facets/Addition';

export function insertCutPointWhenConfirmed(facet: Addition) {
  const ctr = getCtr(facet);
  CutPointsStore.get(ctr).addCutPoints([facet.item]);
}

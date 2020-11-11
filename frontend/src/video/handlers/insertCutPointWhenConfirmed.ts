import { getCtr } from 'facet';
import { CutPointsStore } from 'src/video/facets/CutPointsStore';
import { Addition } from 'facet-mobx/facets/Addition';

export function insertCutPointWhenConfirmed(this: Addition) {
  const ctr = getCtr(this);
  CutPointsStore.get(ctr).addCutPoints([this.item]);
}

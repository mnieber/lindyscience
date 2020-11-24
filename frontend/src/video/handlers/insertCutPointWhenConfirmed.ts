import { getCtr } from 'facility';
import { CutPointsStore } from 'src/video/facets/CutPointsStore';
import { Addition } from 'facility-mobx/facets/Addition';

export function insertCutPointWhenConfirmed(this: Addition) {
  const ctr = getCtr(this);
  CutPointsStore.get(ctr).addCutPoints([this.item]);
}

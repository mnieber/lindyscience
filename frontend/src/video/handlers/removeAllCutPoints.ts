import * as _ from 'lodash/fp';
import { CutPointsStore } from 'src/video/facets/CutPointsStore';

export function removeAllCutPoints(this: CutPointsStore) {
  this.deleteCutPointsById(_.keys(this.cutPointById));
}

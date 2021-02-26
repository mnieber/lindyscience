import * as _ from 'lodash/fp';
import { CutPointsStore } from 'src/video/facets/CutPointsStore';

export function removeAllCutPoints(facet: CutPointsStore) {
  facet.deleteCutPointsById(_.keys(facet.cutPointById));
}

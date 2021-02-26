import { CutPointsStore } from 'src/video/facets/CutPointsStore';
import { CutPointT } from 'src/video/types';
import { getCtr } from 'facility';
import { Editing } from 'facility-mobx/facets/Editing';

export function handleSaveCutPoint(facet: Editing, values: any) {
  const ctr = getCtr(facet);
  const cutPointsStore = CutPointsStore.get(ctr);

  const existingCutPoint = cutPointsStore.cutPoints.find(
    (x: CutPointT) => x.id === values.id
  );
  const cutPoint: CutPointT = {
    ...existingCutPoint,
    ...values,
  };

  cutPointsStore.addCutPoints([cutPoint]);
}

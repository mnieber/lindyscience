import { CutPointsStore } from 'src/video/facets/CutPointsStore';
import { CutPointT } from 'src/video/types';

export function handleSaveCutPoint(
  cutPointsStore: CutPointsStore,
  values: any
) {
  const existingCutPoint = cutPointsStore.cutPoints.find(
    (x: CutPointT) => x.id === values.id
  );
  const cutPoint: CutPointT = {
    ...existingCutPoint,
    ...values,
  };

  cutPointsStore.addCutPoints([cutPoint]);
}

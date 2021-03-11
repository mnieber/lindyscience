import { CutPointsStore } from 'src/video/facets/CutPointsStore';

export function handleDeleteCutPoints(
  cutPointsStore: CutPointsStore,
  ids: string[]
) {
  cutPointsStore.deleteCutPointsById(ids);
}

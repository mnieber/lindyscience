import { createUUID } from 'src/utils/utils';
import { CutPointT } from 'src/video/types';
import { VideoController } from 'src/moves/MoveCtr/facets/VideoController';

type PropsT = {
  cutPointType: 'start' | 'end';
};

export function handleCreateCutPoint(
  videoController: VideoController,
  { cutPointType }: PropsT
): CutPointT {
  const t = videoController.getPlayer().getCurrentTime();

  return {
    id: createUUID(),
    t,
    type: cutPointType,
    name: cutPointType === 'start' ? 'New move' : '',
    description: '',
    tags: [],
  };
}

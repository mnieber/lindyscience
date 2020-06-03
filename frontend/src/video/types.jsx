// @flow

import type { TagT } from 'src/tags/types';
import type { UUID } from 'src/kernel/types';

export type VideoT = {
  link: string,
  startTimeMs: ?number,
  endTimeMs: ?number,
};

export type VideoUrlPropsT = {
  id: string,
  provider: string,
  params: any,
};

export type CutPointT = {
  id: UUID,
  t: number,
  type: 'start' | 'end',
  name: string,
  description: string,
  tags: Array<TagT>,
};

export type CutPointBvrsT = {
  removeCutPoints: (Array<UUID>) => void,
  saveCutPoint: (any) => void,
  createMovesFromCutPoints: () => void,
};

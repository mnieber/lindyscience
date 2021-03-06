import { UUID } from 'src/kernel/types';
import { TagT } from 'src/tags/types';

export type VideoT = {
  link: string;
  startTimeMs?: number;
  endTimeMs?: number;
};

export type VideoUrlPropsT = {
  id: string;
  provider: string;
  params: any;
};

export type CutPointT = {
  id: UUID;
  t: number;
  type: 'start' | 'end';
  name: string;
  description: string;
  tags: Array<TagT>;
};

export type CutPointByIdT = { [id: string]: CutPointT };

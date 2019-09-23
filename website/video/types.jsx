// @flow

import * as React from "react";
import type { UUID } from "kernel/types";

export type VideoT = {
  link: string,
  startTimeMs: ?number,
  endTimeMs: ?number,
  id: UUID,
};

export type VideoUrlPropsT = {
  id: string,
  provider: string,
  params: any,
};

export type VideoBvrT = {
  video: ?VideoT,
  player: any,
  setPlayer: any => void,
  isPlaying: boolean,
  setIsPlaying: boolean => void,
  togglePlay: () => void,
};

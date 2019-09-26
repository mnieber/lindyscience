// @flow

import * as React from "react";
import type { UUID } from "kernel/types";

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

export type VideoBvrT = {
  video: ?VideoT,
  player: any,
  setPlayer: any => void,
  isPlaying: boolean,
  setIsPlaying: boolean => void,
  togglePlay: () => void,
  parentDivId: string,
};

// When this id changes, the video must be reset to the start time
export type RestartIdT = string;

// @flow

import * as React from "react";

export type VideoT = {
  link: string,
  startTime: ?number,
  endTime: ?number,
};

export type VideoUrlPropsT = {
  id: string,
  provider: string,
  params: any,
};

export type VideoBvrT = {
  player: any,
  setPlayer: any => void,
  isPlaying: boolean,
  setIsPlaying: boolean => void,
  togglePlay: () => void,
};

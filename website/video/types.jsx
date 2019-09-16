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
  isPlaying: boolean,
  togglePlay: () => void,
  setIsPlaying: boolean => void,
};

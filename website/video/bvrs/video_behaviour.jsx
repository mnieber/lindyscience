// @flow

import * as React from "react";

import type { VideoBvrT } from "video/types";

export function useVideo(): VideoBvrT {
  const [isPlaying, setIsPlaying] = React.useState(false);

  function togglePlay() {
    setIsPlaying(!isPlaying);
  }

  return {
    isPlaying,
    setIsPlaying,
    togglePlay,
  };
}

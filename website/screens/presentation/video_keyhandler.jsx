// @flow

import type { VideoBvrT } from "video/types";

export const handleVideoKey = (key: string, e: any, videoBvr: VideoBvrT) => {
  if (key == "ctrl+space") {
    videoBvr.togglePlay();
    e.preventDefault();
    e.stopPropagation();
  }
  if (key == "ctrl+shift+1") {
    videoBvr.player.setPlaybackRate(0.25);
    e.preventDefault();
    e.stopPropagation();
  }
  if (key == "ctrl+shift+2") {
    videoBvr.player.setPlaybackRate(0.5);
    e.preventDefault();
    e.stopPropagation();
  }
  if (key == "ctrl+shift+3") {
    videoBvr.player.setPlaybackRate(0.75);
    e.preventDefault();
    e.stopPropagation();
  }
  if (key == "ctrl+shift+4") {
    videoBvr.player.setPlaybackRate(1);
    e.preventDefault();
    e.stopPropagation();
  }
  if (key == "ctrl+shift+5") {
    videoBvr.player.setPlaybackRate(1.25);
    e.preventDefault();
    e.stopPropagation();
  }
  if (key == "ctrl+shift+6") {
    videoBvr.player.setPlaybackRate(1.5);
    e.preventDefault();
    e.stopPropagation();
  }
  if (key == "ctrl+shift+7") {
    videoBvr.player.setPlaybackRate(1.75);
    e.preventDefault();
    e.stopPropagation();
  }
  if (key == "ctrl+shift+8") {
    videoBvr.player.setPlaybackRate(2);
    e.preventDefault();
    e.stopPropagation();
  }
  if (key == "ctrl+shift+down") {
    const t = videoBvr.player.getCurrentTime();
    videoBvr.player.seekTo(t - 0.1);
    e.preventDefault();
    e.stopPropagation();
  }
  if (key == "ctrl+shift+up") {
    const t = videoBvr.player.getCurrentTime();
    videoBvr.player.seekTo(t + 0.1);
    e.preventDefault();
    e.stopPropagation();
  }
};

export const videoKeys = [
  "ctrl+space",
  "ctrl+shift+1",
  "ctrl+shift+2",
  "ctrl+shift+3",
  "ctrl+shift+4",
  "ctrl+shift+5",
  "ctrl+shift+6",
  "ctrl+shift+7",
  "ctrl+shift+8",
  "ctrl+shift+up",
  "ctrl+shift+down",
];

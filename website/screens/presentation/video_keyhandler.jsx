// @flow

import type { VideoBvrT } from "video/types";
import { isNone } from "utils/utils";

export const createVideoKeyHandlers = (videoBvr: VideoBvrT) => {
  return {
    "ctrl+space": () => videoBvr.togglePlay(),
    "ctrl+shift+1": () => videoBvr.player.setPlaybackRate(0.25),
    "ctrl+shift+2": () => videoBvr.player.setPlaybackRate(0.5),
    "ctrl+shift+3": () => videoBvr.player.setPlaybackRate(0.75),
    "ctrl+shift+4": () => videoBvr.player.setPlaybackRate(1),
    "ctrl+shift+5": () => videoBvr.player.setPlaybackRate(1.25),
    "ctrl+shift+6": () => videoBvr.player.setPlaybackRate(1.5),
    "ctrl+shift+7": () => videoBvr.player.setPlaybackRate(1.75),
    "ctrl+shift+8": () => videoBvr.player.setPlaybackRate(2),
    "ctrl+shift+down": () =>
      videoBvr.player.seekTo(videoBvr.player.getCurrentTime() - 0.1),
    "ctrl+shift+up": () =>
      videoBvr.player.seekTo(videoBvr.player.getCurrentTime() + 0.1),
  };
};

export const createVideoTimePointKeyHandlers = (
  videoBvr: VideoBvrT,
  timePoints: Array<number>
) => {
  return {
    "ctrl+shift+pageUp": () => {
      const t = videoBvr.player.getCurrentTime();
      const tp = Math.min.apply(Math, timePoints.filter(tp => tp > t));
      if (!isNone(tp) && isFinite(tp)) {
        videoBvr.player.seekTo(tp);
      }
    },
    "ctrl+shift+pageDown": () => {
      const t = videoBvr.player.getCurrentTime();
      const tp = Math.max.apply(Math, timePoints.filter(tp => tp < t));
      if (!isNone(tp) && isFinite(tp)) {
        videoBvr.player.seekTo(tp);
      }
    },
  };
};

export const createVideoStartEndKeyHandlers = (
  videoBvr: VideoBvrT,
  startTime: ?number,
  endTime: ?number
) => {
  return {
    "ctrl+shift+home": () => videoBvr.player.seekTo(startTime),
    "ctrl+shift+end": () => videoBvr.player.seekTo(endTime),
  };
};

export function createKeyDownHandler(keyHandlers: { [string]: Function }) {
  return (key: string, e: any) => {
    const handler = keyHandlers[key];
    if (handler) {
      handler();
      e.preventDefault();
      e.stopPropagation();
    }
  };
}

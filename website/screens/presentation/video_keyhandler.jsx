// @flow

import { Video } from "video/bvrs/use_video";
import { runInAction } from "utils/mobx_wrapper";
import { splitKeyhandlerKeys } from "video/utils";
import { isNone } from "utils/utils";

export const createVideoKeyHandlers = (videoBvr: Video) => {
  return splitKeyhandlerKeys({
    "ctrl+space": () =>
      runInAction(() => {
        videoBvr.isPlaying = !videoBvr.isPlaying;
      }),
    "ctrl+shift+1": () => videoBvr.player.setPlaybackRate(0.25),
    "ctrl+shift+2": () => videoBvr.player.setPlaybackRate(0.5),
    "ctrl+shift+3": () => videoBvr.player.setPlaybackRate(0.75),
    "ctrl+shift+4": () => videoBvr.player.setPlaybackRate(1),
    "ctrl+shift+5": () => videoBvr.player.setPlaybackRate(1.25),
    "ctrl+shift+6": () => videoBvr.player.setPlaybackRate(1.5),
    "ctrl+shift+7": () => videoBvr.player.setPlaybackRate(1.75),
    "ctrl+shift+8": () => videoBvr.player.setPlaybackRate(2),
    "ctrl+down": () =>
      videoBvr.player.seekTo(videoBvr.player.getCurrentTime() - 0.6),
    "ctrl+shift+down": () =>
      videoBvr.player.seekTo(videoBvr.player.getCurrentTime() - 0.15),
    "ctrl+up": () =>
      videoBvr.player.seekTo(videoBvr.player.getCurrentTime() + 0.5),
    "ctrl+shift+up": () =>
      videoBvr.player.seekTo(videoBvr.player.getCurrentTime() + 0.1),
  });
};

export const createVideoTimePointKeyHandlers = (
  videoBvr: Video,
  timePoints: Array<number>
) => {
  return splitKeyhandlerKeys({
    "ctrl+shift+pageUp;ctrl+t": () => {
      const t = videoBvr.player.getCurrentTime();
      const tp = Math.min.apply(Math, timePoints.filter(tp => tp > t));
      if (!isNone(tp) && isFinite(tp)) {
        videoBvr.player.seekTo(tp);
      }
    },
    "ctrl+shift+pageDown;ctrl+shift+t": () => {
      const t = videoBvr.player.getCurrentTime();
      const tp = Math.max.apply(Math, timePoints.filter(tp => tp < t));
      if (!isNone(tp) && isFinite(tp)) {
        videoBvr.player.seekTo(tp);
      }
    },
  });
};

export const createVideoStartEndKeyHandlers = (
  videoBvr: Video,
  startTime: ?number,
  endTime: ?number
) => {
  return splitKeyhandlerKeys({
    "ctrl+shift+home;ctrl+h": () => videoBvr.player.seekTo(startTime),
    "ctrl+shift+end;ctrl+shift+h": () => videoBvr.player.seekTo(endTime),
  });
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

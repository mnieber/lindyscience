// @flow

import { Display } from "screens/session_container/facets/display";
import { VideoController } from "screens/move_container/facets/video_controller";
import { runInAction } from "utils/mobx_wrapper";
import { splitKeyhandlerKeys } from "video/utils";
import { isNone } from "utils/utils";

export const createVideoKeyHandlers = (videoCtr: VideoController) => {
  const player = videoCtr.player;
  if (!player) {
    return {};
  }

  return splitKeyhandlerKeys({
    "ctrl+space": () =>
      runInAction(() => {
        videoCtr.isPlaying = !videoCtr.isPlaying;
      }),
    "ctrl+shift+1": () => player.setPlaybackRate(0.25),
    "ctrl+shift+2": () => player.setPlaybackRate(0.5),
    "ctrl+shift+3": () => player.setPlaybackRate(0.75),
    "ctrl+shift+4": () => player.setPlaybackRate(1),
    "ctrl+shift+5": () => player.setPlaybackRate(1.25),
    "ctrl+shift+6": () => player.setPlaybackRate(1.5),
    "ctrl+shift+7": () => player.setPlaybackRate(1.75),
    "ctrl+shift+8": () => player.setPlaybackRate(2),
    "ctrl+down": () => player.seekTo(player.getCurrentTime() - 0.6),
    "ctrl+shift+down": () => player.seekTo(player.getCurrentTime() - 0.15),
    "ctrl+up": () => player.seekTo(player.getCurrentTime() + 0.5),
    "ctrl+shift+up": () => player.seekTo(player.getCurrentTime() + 0.1),
  });
};

export const createVideoTimePointKeyHandlers = (
  videoCtr: VideoController,
  timePoints: Array<number>
) => {
  const player = videoCtr.player;
  if (!player) {
    return {};
  }

  return splitKeyhandlerKeys({
    "ctrl+shift+pageUp;ctrl+t": () => {
      const t = player.getCurrentTime();
      const tp = Math.min.apply(Math, timePoints.filter(tp => tp > t));
      if (!isNone(tp) && isFinite(tp)) {
        player.seekTo(tp);
      }
    },
    "ctrl+shift+pageDown;ctrl+shift+t": () => {
      const t = player.getCurrentTime();
      const tp = Math.max.apply(Math, timePoints.filter(tp => tp < t));
      if (!isNone(tp) && isFinite(tp)) {
        player.seekTo(tp);
      }
    },
  });
};

export const createVideoStartEndKeyHandlers = (
  videoCtr: VideoController,
  startTime: ?number,
  endTime: ?number
) => {
  const player = videoCtr.player;
  if (!player) {
    return {};
  }

  return splitKeyhandlerKeys({
    "ctrl+shift+home;ctrl+h": () => player.seekTo(startTime),
    "ctrl+shift+end;ctrl+shift+h": () => player.seekTo(endTime),
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

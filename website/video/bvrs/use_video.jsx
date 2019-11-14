// @flow

import * as React from "react";

import { autorun, observable } from "utils/mobx_wrapper";
import { isYoutubePlaying } from "video/utils";
import type { VideoT, VideoBvrT } from "video/types";

export class Video {
  @observable video: ?VideoT;
  @observable parentDivId: any;
  @observable player: any;
  @observable isPlaying: boolean = false;
  pauseTimeout: number = 500;

  constructor(parentDivId: any) {
    this.parentDivId = parentDivId;
    autorun(() => this._updatePlayer());
  }

  _updatePlayer() {
    if (this.player && this.isPlaying != isYoutubePlaying(this.player)) {
      if (this.isPlaying) {
        this.player.playVideo();
      } else {
        // We are currently playing the video and we want to pause.
        // However, we should wait a short while before pausing, becaise
        // the player may be loading footage, and we want to pause it
        // when it's actually showing an image.
        const t = this.player.getCurrentTime();
        setTimeout(() => {
          try {
            this.player.seekTo(t);
          } catch {}
          try {
            this.player.pauseVideo();
          } catch {}
        }, this.pauseTimeout);
      }
    }
  }
}

export function useVideo(parentDivId: any): Video {
  const [video, setVideo] = React.useState(() => new Video(parentDivId));
  return video;
}

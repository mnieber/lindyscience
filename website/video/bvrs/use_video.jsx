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
        setTimeout(() => {
          this.player.pauseVideo();
          this.pauseTimeout = 100;
        }, this.pauseTimeout);
      }
    }
  }
}

export function useVideo(parentDivId: any): Video {
  const [video, setVideo] = React.useState(() => new Video(parentDivId));
  return video;
}

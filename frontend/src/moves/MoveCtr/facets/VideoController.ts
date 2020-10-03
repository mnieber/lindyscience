// @flow

import { input } from 'src/npm/facet';
import { autorun, observable, runInAction } from 'src/utils/mobx_wrapper';
import { VideoT } from 'src/video/types';
import { isYoutubePlaying } from 'src/video/utils';

export class VideoController {
  @input @observable video?: VideoT;
  @observable isPlaying: boolean = false;
  @observable player: any;
  // We use _player to allow non-observer access to the player via getPlayer
  _player: any;
  _pauseAt: number = -1;

  constructor() {
    autorun(() => this._updatePlayer());
    autorun(() => (this._player = this.player));
  }

  setPlayer(x: any) {
    runInAction(() => {
      this.player = x;
    });
  }

  getPlayer() {
    return this._player;
  }

  pauseAt(t: number) {
    const paused = 2;
    if (this.player) {
      this._pauseAt = t;
      this.player.seekTo(t);
    }
  }

  setPlayerState(x: number) {
    const notPlaying = -1;
    if (
      this.player &&
      this.player.getPlayerState() == notPlaying &&
      this._pauseAt >= 0
    ) {
      setTimeout(() => this.player.pauseVideo(), 500);
    }
  }

  _updatePlayer() {
    if (this.player && this.isPlaying != isYoutubePlaying(this.player)) {
      if (this.isPlaying) {
        this.player.playVideo();
      } else {
        this.player.pauseVideo();
      }
    }
  }

  static get = (ctr: any): VideoController => ctr.videoController;
}

export function initVideoController(self: VideoController): VideoController {
  self.video = undefined;
  return self;
}

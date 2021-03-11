import { input } from 'facility';
import { action, autorun, observable, makeObservable } from 'mobx';
import { VideoT } from 'src/video/types';
import { isYoutubePlaying } from 'src/video/utils';

export class VideoController {
  @input @observable video?: VideoT;
  @observable isPlaying: boolean = false;
  @observable player: any;
  // We use _player to allow non-observer access to the player via getPlayer
  _player: any;
  _pauseAt: number = -1;
  _disposeAutoRun: Function = () => {};

  constructor(isMakeObservable: boolean) {
    if (isMakeObservable) {
      makeObservable(this);
    }
  }

  @action setPlayer(x: any) {
    this.player = this._player = x;
    this._disposeAutoRun();
    this._disposeAutoRun = autorun(() => this._updatePlayer());
  }

  getPlayer() {
    return this._player;
  }

  pauseAt(t: number) {
    if (this.player) {
      try {
        this._pauseAt = t;
        this.player.seekTo(t);
      } catch {}
    }
  }

  setPlayerState(x: number) {
    const notPlaying = -1;
    if (
      this.player &&
      this.player.getPlayerState() === notPlaying &&
      this._pauseAt >= 0
    ) {
      try {
        setTimeout(() => this.player.pauseVideo(), 500);
      } catch {}
    }
  }

  _updatePlayer() {
    if (this.player && this.isPlaying !== isYoutubePlaying(this.player)) {
      try {
        if (this.isPlaying) {
          this.player.playVideo();
        } else {
          this.player.pauseVideo();
        }
      } catch {}
    }
  }

  static get = (ctr: any): VideoController => ctr.videoController;
}

export function initVideoController(self: VideoController): VideoController {
  self.video = undefined;
  return self;
}

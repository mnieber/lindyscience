// @flow

import * as React from "react";
import { isYoutubePlaying } from "video/utils/utils";

import type { VideoT, VideoBvrT } from "video/types";

function _updatePlayer(player, isPlaying, pauseTimeout, setPauseTimeout) {
  if (player && isPlaying != isYoutubePlaying(player)) {
    if (isPlaying) {
      player.playVideo();
    } else {
      setTimeout(() => {
        player.pauseVideo();
        setPauseTimeout(100);
      }, pauseTimeout);
    }
  }
}

// $FlowFixMe
export const VideoBvrContext = React.createContext({});

export const withVideoBvrContext = (WrappedComponent: any) => (props: any) => {
  return (
    <VideoBvrContext.Consumer>
      {videoBvr => <WrappedComponent {...props} videoBvr={videoBvr} />}
    </VideoBvrContext.Consumer>
  );
};

export function useVideo(parentDivId: string, video: ?VideoT): VideoBvrT {
  const [_isPlaying, _setIsPlaying] = React.useState(false);
  const [_player, _setPlayer] = React.useState(null);
  const [pauseTimeout, setPauseTimeout] = React.useState(500);

  function setPlayer(player) {
    if (player != _player) {
      _setPlayer(player);
      _updatePlayer(player, _isPlaying, 500, setPauseTimeout);
    }
  }

  function setIsPlaying(isPlaying) {
    if (isPlaying != _isPlaying) {
      _setIsPlaying(isPlaying);
      _updatePlayer(_player, isPlaying, pauseTimeout, setPauseTimeout);
    }
  }

  function togglePlay() {
    setIsPlaying(!_isPlaying);
  }

  return {
    player: _player,
    setPlayer,
    isPlaying: _isPlaying,
    setIsPlaying,
    togglePlay,
    video,
    parentDivId,
  };
}

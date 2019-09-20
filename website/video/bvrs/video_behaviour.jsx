// @flow

import * as React from "react";

import type { VideoBvrT } from "video/types";

function _updatePlayer(player, isPlaying, pauseTimeout, setPauseTimeout) {
  if (player) {
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

export function useVideo(): VideoBvrT {
  const [_isPlaying, _setIsPlaying] = React.useState(false);
  const [_player, _setPlayer] = React.useState(null);
  const [pauseTimeout, setPauseTimeout] = React.useState(500);
  const [_proposedStartTime, _setProposedStartTime] = React.useState(null);

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

  function setProposedStartTime(t) {
    _setProposedStartTime(t);
  }

  return {
    player: _player,
    setPlayer,
    isPlaying: _isPlaying,
    setIsPlaying,
    togglePlay,
    proposedStartTime: _proposedStartTime,
    setProposedStartTime,
  };
}

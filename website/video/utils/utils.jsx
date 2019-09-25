// @flow

import * as React from "react";

export function isYoutubePlaying(player: any) {
  return [1, 3].includes(player.getPlayerState());
}

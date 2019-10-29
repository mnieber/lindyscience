// @flow

import * as React from "react";
import jQuery from "jquery";

import { scrollIntoView } from "app/utils";

export function timePointRegex() {
  return /\<([\d\.\:]+)\>/g;
}

export function parseVideoTimePoint(x: string) {
  const parts = x.split(":");
  const n = parts.length;
  const secs = parts.pop() || "0";
  const mins = parts.pop() || "0";
  const hours = parts.pop() || "0";

  try {
    return parseFloat(secs) + 60 * parseFloat(mins) + 3600 * parseFloat(hours);
  } catch {}
  return null;
}

export function styleTimePoints(videoPlayer: any, timePoints: Array<number>) {
  const currentTime = videoPlayer ? videoPlayer.getCurrentTime() : -1;

  timePoints.forEach(tp => {
    const className = ".tp-" + (tp + "").replace(".", "-");
    const elms = jQuery(className);
    elms.removeClass("bg-yellow");
    if (currentTime - 1 < tp && tp < currentTime + 1) {
      elms.addClass("bg-yellow");
      if (elms.length) {
        scrollIntoView(elms[0], document.getElementById("move__description"));
      }
    }
  });
}

export function extractTimePoints(text: string): Array<number> {
  const result = [];
  const r = timePointRegex();
  let matchArr;
  while ((matchArr = r.exec(text)) !== null) {
    const tpString = (matchArr: any)[1];
    const tp = parseVideoTimePoint(tpString);
    if (tp !== null) {
      result.push(tp);
    }
  }
  return result;
}

export function isYoutubePlaying(player: any) {
  return [1, 3].includes(player.getPlayerState());
}

export function splitKeyhandlerKeys(keyHandlers: { [string]: Function }) {
  return Object.entries(keyHandlers).reduce((acc, [keys, f]) => {
    keys.split(";").forEach(key => (acc[key] = f));
    return acc;
  }, {});
}

export function timePointToClassName(tp: ?number) {
  return "tp-" + ((tp || "") + "").replace(".", "-");
}

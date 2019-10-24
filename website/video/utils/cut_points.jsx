// @flow

import * as React from "react";
import jQuery from "jquery";

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
    const className = ".tp-" + tp;
    jQuery(className).removeClass("bg-yellow");
    if (currentTime - 1 < tp && tp < currentTime + 1) {
      jQuery(className).addClass("bg-yellow");
    }
  });
}

export function extractTimePoints(text: string): Array<number> {
  const result = [];
  const r = timePointRegex();
  let matchArr;
  while ((matchArr = r.exec(text)) !== null) {
    // $FlowFixMe
    const tpString = matchArr[1];
    const tp = parseVideoTimePoint(tpString);
    if (tp !== null) {
      result.push(tp);
    }
  }
  return result;
}

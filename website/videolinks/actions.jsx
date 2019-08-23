// @flow

import React from "react";

import type { UUID } from "kernel/types";
import type { VideoLinkByIdT } from "videolinks/types";

export function actAddVideoLinks(videoLinks: VideoLinkByIdT) {
  return {
    type: "ADD_VIDEO_LINKS",
    videoLinks,
  };
}

export function actRemoveVideoLinks(videoLinks: Array<UUID>) {
  return {
    type: "REMOVE_VIDEO_LINKS",
    videoLinks,
  };
}

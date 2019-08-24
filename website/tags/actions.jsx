// @flow

import React from "react";

import type { TagT } from "tags/types";

export function actSetMoveTags(tags: Array<TagT>) {
  return {
    type: "SET_MOVE_TAGS",
    tags,
  };
}

export function actSetMoveListTags(tags: Array<TagT>) {
  return {
    type: "SET_MOVE_LIST_TAGS",
    tags,
  };
}

// @flow

import React from "react";

import type { MoveT, MovePrivateDataByIdT } from "moves/types";
import type { TagT } from "tags/types";

export function actAddMovePrivateDatas(movePrivateDatas: MovePrivateDataByIdT) {
  return {
    type: "ADD_MOVE_PRIVATE_DATAS",
    movePrivateDatas: movePrivateDatas,
  };
}

export function actSetMovePrivateDatas(movePrivateDatas: MovePrivateDataByIdT) {
  return {
    type: "SET_MOVE_PRIVATE_DATAS",
    movePrivateDatas: movePrivateDatas,
  };
}

export function actAddMoves(moves: Array<MoveT>) {
  return {
    type: "ADD_MOVES",
    moves,
  };
}

export function actSetMoveTags(tags: Array<TagT>) {
  return {
    type: "SET_MOVE_TAGS",
    tags,
  };
}

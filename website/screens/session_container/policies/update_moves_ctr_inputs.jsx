// @flow

import { SessionContainer } from "screens/session_container/session_container";
import { reaction } from "utils/mobx_wrapper";
import type { MoveT } from "moves/types";
import { Highlight } from "facets/generic/highlight";

export const updateMovesCtrInputs = (ctr: SessionContainer) => {
  reaction(
    () => ctr.data.inputMoves,
    (inputMoves: Array<MoveT>) => {
      const moveListsCtr = ctr.data.moveListsCtr;
      const moveList = Highlight.get(moveListsCtr).item;

      ctr.data.movesCtr.setInputs(
        inputMoves,
        moveList,
        ctr.data.moveListsCtr.data.preview,
        ctr.profiling.userProfile
      );
    }
  );
};

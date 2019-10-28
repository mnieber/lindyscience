// @flow

import { MoveListsContainer } from "screens/movelists_container/movelists_container";
import { MovesContainer } from "screens/moves_container/moves_container";
import { Inputs } from "screens/session_container/facets/inputs";
import { lookUp } from "utils/utils";
import { SessionContainer } from "screens/session_container/session_container";
import { reaction } from "utils/mobx_wrapper";
import type { MoveT } from "moves/types";
import { Highlight } from "facets/generic/highlight";

export const updateMovesCtrInputs = (ctr: SessionContainer) => {
  const moveListsCtr = MoveListsContainer.get(ctr);
  const movesCtr = MovesContainer.get(ctr);
  const inputs = Inputs.get(ctr);

  reaction(
    () => {
      const moveList = moveListsCtr.highlight.item;
      const inputMoves = moveList
        ? lookUp(moveList ? moveList.moves : [], inputs.moveById).filter(
            x => !!x
          )
        : [];
      const moves = moveListsCtr.outputs.preview;
      return { inputMoves, moveList, moves };
    },
    ({ inputMoves, moveList, moves }) => {
      movesCtr.setInputs(inputMoves, moveList, moves, inputs.userProfile);
    }
  );
};

// @flow

import { MovesContainer } from "screens/moves_container/moves_container";
import { MoveListsContainer } from "screens/movelists_container/movelists_container";

export function sessionContainerProps(
  dispatch: Function,
  history: any,
  movesCtr: MovesContainer,
  moveListsCtr: MoveListsContainer
) {
  return { dispatch, history, movesCtr, moveListsCtr };
}

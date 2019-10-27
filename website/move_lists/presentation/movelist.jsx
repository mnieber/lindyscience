// @flow

import { MenuProvider } from "react-contexify";
import { observer } from "mobx-react";
import * as React from "react";
import classnames from "classnames";
import KeyboardEventHandler from "react-keyboard-event-handler";

import { Selection } from "facets/generic/selection";
import {
  getOwnerId,
  handleSelectionKeys2,
  isOwner,
  scrollIntoView,
} from "app/utils";
import { MovesContainer } from "screens/moves_container/moves_container";
import { MoveListsContainer } from "screens/movelists_container/movelists_container";
import type { MoveT } from "moves/types";
import type { UUID } from "kernel/types";
import type { UserProfileT } from "profiles/types";

// MoveList

type KeyHandlersT = {|
  handleKeyDown: Function,
|};

function createKeyHandlers(
  moves: Array<MoveT>,
  highlightedMoveId: UUID,
  selectMoveById: (UUID, boolean, boolean) => void,
  props: MoveListPropsT
): KeyHandlersT {
  function handleKeyDown(key, e) {
    if (highlightedMoveId) {
      e.target.id == "moveList" &&
        handleSelectionKeys2(
          key,
          e,
          moves.map(x => x.id),
          highlightedMoveId,
          // TODO support shift selection with keyboard (e.shiftKey)
          // Note: in that case, anchor != highlight
          x => selectMoveById(x, false, false)
        );
    }
  }

  return {
    handleKeyDown,
  };
}

type MoveListPropsT = {|
  userProfile: ?UserProfileT,
  createHostedPanels: MoveT => any,
  moveContextMenu: any,
  movesCtr: MovesContainer,
  moveListsCtr: MoveListsContainer,
  className?: string,
|};

export const MoveList = observer((props: MoveListPropsT) => {
  const selectMoveById = (moveId: UUID, isShift: boolean, isCtrl: boolean) => {
    scrollIntoView(document.getElementById(moveId));
    Selection.get(props.movesCtr).selectItem({
      itemId: moveId,
      isShift,
      isCtrl,
    });
    navigateTo(itemId);
  };

  const dragPosition = props.movesCtr.dragging.position;
  const selectionIds = props.movesCtr.selection.ids;
  const highlightId = props.movesCtr.highlight.id;
  const moves = props.movesCtr.data.display;
  const moveList = props.moveListsCtr.highlight.item;
  const userProfile = props.userProfile;

  const isMoveListOwner =
    userProfile && isOwner(userProfile, getOwnerId(moveList));
  const keyHandlers = createKeyHandlers(
    moves,
    highlightId,
    selectMoveById,
    props
  );

  const moveNodes = moves.map((move, idx) => {
    const hostedPanels = props.createHostedPanels(move);

    return (
      <div
        className={classnames({
          moveList__item: true,
          "moveList__item--selected":
            move && (selectionIds || []).includes(move.id),
          "moveList__item--highlighted": move && move.id == highlightId,
          "moveList__item--drag_before":
            dragPosition &&
            dragPosition.isBefore &&
            dragPosition.targetItemId == move.id,
          "moveList__item--drag_after":
            dragPosition &&
            !dragPosition.isBefore &&
            dragPosition.targetItemId == move.id,
        })}
        id={move.id}
        key={idx}
        {...props.movesCtr.handlerClick.handle(move.id)}
        {...(isMoveListOwner ? props.movesCtr.handlerDrag.handle(move.id) : {})}
      >
        {move.name}
        {hostedPanels}
      </div>
    );
  });

  return (
    <KeyboardEventHandler
      handleKeys={["up", "down"]}
      onKeyEvent={keyHandlers.handleKeyDown}
    >
      <div
        className={classnames(props.className, "moveList")}
        tabIndex={123}
        id="moveList"
      >
        <MenuProvider id="moveContextMenu">{moveNodes}</MenuProvider>
        {props.moveContextMenu}
      </div>
    </KeyboardEventHandler>
  );
});

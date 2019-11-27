// @flow

import { MenuProvider } from "react-contexify";
import { observer } from "mobx-react";
import { compose } from "redux";
import * as React from "react";
import classnames from "classnames";
import KeyboardEventHandler from "react-keyboard-event-handler";

import { Dragging } from "facet-mobx/facets/dragging";
import type { MoveListT } from "move_lists/types";
import { mergeDefaultProps } from "facet/default_props";
import { Highlight } from "facet-mobx/facets/highlight";
import { Selection } from "facet-mobx/facets/selection";
import { MovesContainer } from "screens/moves_container/moves_container";
import type { MoveT } from "moves/types";

// MoveList

type PropsT = {
  createHostedPanels: MoveT => any,
  moveContextMenu: any,
  navigateTo: MoveT => any,
  className?: string,
  defaultProps: any,
};

type DefaultPropsT = {
  isOwner: any => boolean,
  moveList: MoveListT,
  moves: Array<MoveT>,
  movesCtr: MovesContainer,
  movesDragging: Dragging,
  movesHighlight: Highlight,
  movesSelection: Selection,
};

// $FlowFixMe
export const MoveList = compose(observer)((p: PropsT) => {
  const props = mergeDefaultProps<PropsT & DefaultPropsT>(p);

  const dragPosition = props.movesDragging.position;
  const selectionIds = props.movesSelection.ids || [];
  const highlightId = props.movesHighlight.id;

  const moveNodes = props.moves.map((move, idx) => {
    const hostedPanels = props.createHostedPanels(move);

    return (
      <div
        className={classnames({
          moveList__item: true,
          "moveList__item--selected": move && selectionIds.includes(move.id),
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
        {...props.movesCtr.handlerClick.handle(move.id, move, props.navigateTo)}
        {...(props.isOwner(props.moveList)
          ? props.movesCtr.handlerDrag.handle(move.id)
          : {})}
      >
        {move.name}
        {hostedPanels}
      </div>
    );
  });

  return (
    <KeyboardEventHandler
      handleKeys={["up", "down"]}
      onKeyEvent={
        props.movesCtr.handlerSelectWithKeys.handle(
          "up",
          "down",
          props.navigateTo
        ).onKeyDown
      }
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

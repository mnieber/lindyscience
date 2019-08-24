// @flow

import * as React from "react";
import { compose } from "redux";

import Ctr from "screens/containers/index";

import { getId } from "app/utils";
import { getStore } from "app/store";

import Widgets from "screens/presentation/index";
import { MoveListTitle } from "move_lists/presentation/move_list_details";
import { withHostedStaticMovePanels } from "screens/hocs/with_hosted_static_move_panels";

import type { MoveT } from "moves/types";
import type { MoveListT } from "move_lists/types";
import type { TagT } from "tags/types";

type PropsT = {
  move: MoveT,
  moveList: MoveListT,
  moveTags: Array<TagT>,
  hostedStaticMovePanels: any,
  // receive any actions as well
};

function getMoveId() {
  const state = getStore().getState();
  return getId(Ctr.fromStore.getHighlightedMove(state));
}

// $FlowFixMe
export const withStaticMove = compose(
  withHostedStaticMovePanels(getMoveId),
  Ctr.connect(
    state => ({
      move: Ctr.fromStore.getHighlightedMove(state),
      moveList: Ctr.fromStore.getSelectedMoveList(state),
      moveTags: Ctr.fromStore.getMoveTags(state),
    }),
    Ctr.actions
  ),
  (WrappedComponent: any) => (props: any) => {
    const {
      move,
      moveList,
      moveTags,
      hostedStaticMovePanels,
      ...passThroughProps
    }: PropsT = props;

    const actions: any = props;

    const moveListTitle = <MoveListTitle moveList={moveList} />;

    const staticMove = (
      <Widgets.Move
        move={move}
        moveListTitle={moveListTitle}
        key={getId(move)}
        moveTags={moveTags}
        hostedPanels={hostedStaticMovePanels}
      />
    );

    return <WrappedComponent staticMove={staticMove} {...passThroughProps} />;
  }
);

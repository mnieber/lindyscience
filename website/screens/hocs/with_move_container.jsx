// @flow

import * as React from "react";

import { compose } from "redux";

import Ctr from "screens/containers/index";
import { getPreview } from "screens/utils";
import { createErrorHandler, getId } from "app/utils";

import type { DataContainerT } from "screens/containers/data_container";
import type { UUID } from "kernel/types";
import type { MoveT } from "moves/types";

// $FlowFixMe
export const withMoveContainer = compose(
  Ctr.connect(
    state => ({
      moveList: Ctr.fromStore.getSelectedMoveList(state),
      filteredMoves: Ctr.fromStore.getFilteredMovesInList(state),
      moveContainerPayload: Ctr.fromStore.getMoveContainerPayload(state),
    }),
    Ctr.actions
  ),
  (WrappedComponent: any) => (props: any) => {
    const {
      moveList,
      filteredMoves,
      moveContainerPayload,
      ...passThroughProps
    } = props;

    const actions: any = props;
    const moveListId = getId(moveList);

    function _insertPayload() {
      const allMoveIds = actions.actInsertMoveIds(
        moveContainerPayload.payload.map(x => x.id),
        moveListId,
        moveContainerPayload.targetItemId,
        moveContainerPayload.isBefore
      );
      Ctr.api
        .saveMoveOrdering(moveListId, allMoveIds)
        .catch(createErrorHandler("We could not update the move list"));
    }

    const moveContainer: DataContainerT<MoveT> = {
      insertPayload: _insertPayload,
      preview: getPreview<MoveT>(
        filteredMoves,
        moveContainerPayload.payload,
        moveContainerPayload.targetItemId,
        moveContainerPayload.isBefore
      ),
      payload: moveContainerPayload.payload,
      targetItemId: moveContainerPayload.targetItemId,
      setPayload: actions.actSetMoveContainerPayload,
    };

    return (
      <WrappedComponent moveContainer={moveContainer} {...passThroughProps} />
    );
  }
);

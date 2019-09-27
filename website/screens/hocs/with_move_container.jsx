// @flow

import * as React from "react";

import { compose } from "redux";

import Ctr from "screens/containers/index";
import { findTargetId, getPreview } from "screens/utils";
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

    function _insert(
      payload: Array<MoveT>,
      targetMoveId: UUID,
      isBefore: boolean
    ) {
      const predecessorId = findTargetId(
        filteredMoves.map(x => x.id),
        targetMoveId,
        isBefore
      );
      const allMoveIds = actions.actInsertMoveIds(
        payload.map(x => x.id),
        moveListId,
        predecessorId
      );
      Ctr.api
        .saveMoveOrdering(moveListId, allMoveIds)
        .catch(createErrorHandler("We could not update the move list"));
    }

    const _setPayload = (payload: Array<MoveT>, targetItemId: UUID) => {
      function _filter(moves: Array<MoveT>) {
        return getPreview<MoveT>(moves, payload, targetItemId);
      }
      actions.actSetMoveFilter("insertMovePreview", _filter);
      actions.actSetMoveContainerPayload(payload, targetItemId);
    };

    const moveContainer: DataContainerT<MoveT> = {
      insert: _insert,
      preview: getPreview<MoveT>(
        filteredMoves,
        moveContainerPayload.payload,
        moveContainerPayload.targetItemId
      ),
      payload: moveContainerPayload.payload,
      targetItemId: moveContainerPayload.targetItemId,
      setPayload: _setPayload,
    };

    return (
      <WrappedComponent moveContainer={moveContainer} {...passThroughProps} />
    );
  }
);

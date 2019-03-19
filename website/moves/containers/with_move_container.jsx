// @flow

import * as React from "react";

import { compose } from "redux";

import MovesCtr from "moves/containers/index";
import { findTargetId, getPreview } from "moves/utils";
import { createErrorHandler, getId } from "app/utils";

import type { DataContainerT } from "moves/containers/data_container";
import type { UUID } from "app/types";
import type { MoveT, MoveListT } from "moves/types";

// $FlowFixMe
export const withMoveContainer = compose(
  MovesCtr.connect(
    state => ({
      moveList: MovesCtr.fromStore.getSelectedMoveList(state),
      filteredMoves: MovesCtr.fromStore.getFilteredMovesInList(state),
      movePayload: MovesCtr.fromStore.getMovePayload(state),
    }),
    {
      actInsertMoves: MovesCtr.actions.actInsertMoves,
      actSetMovePayload: MovesCtr.actions.actSetMovePayload,
    }
  ),
  (WrappedComponent: any) => (props: any) => {
    const {
      moveList,
      filteredMoves,
      movePayload,
      actInsertMoves,
      actSetMovePayload,
      ...passThroughProps
    } = props;

    const actions: any = props;

    const [targetItemId: UUID, setTargetItemId: Function] = React.useState("");
    const moveListId = getId(moveList);

    function _insert(
      payloadIds: Array<UUID>,
      targetMoveId: UUID,
      isBefore: boolean
    ) {
      const predecessorId = findTargetId(payloadIds, targetMoveId, isBefore);
      const allMoveIds = actInsertMoves(payloadIds, moveListId, predecessorId);
      MovesCtr.api
        .saveMoveOrdering(moveListId, allMoveIds)
        .catch(createErrorHandler("We could not update the move list"));
    }

    const _setPayload = (payload: Array<MoveT>, targetItemId: UUID) => {
      actSetMovePayload(payload);
      setTargetItemId(targetItemId);
    };

    const moveContainer: DataContainerT<MoveT> = {
      insert: _insert,
      preview: getPreview<MoveT>(filteredMoves, movePayload, targetItemId),
      payloadIds: movePayload.map(x => x.id),
      targetItemId,
      setPayload: _setPayload,
    };

    return (
      <WrappedComponent moveContainer={moveContainer} {...passThroughProps} />
    );
  }
);

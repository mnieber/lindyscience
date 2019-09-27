// @flow

import * as React from "react";
import { compose } from "redux";

import Ctr from "screens/containers/index";
import { actSetMoveContainerPayload } from "screens/actions";
import { actInsertMoveIds } from "move_lists/actions";
import { getPreview } from "screens/utils";
import { createErrorHandler, getId } from "app/utils";

import type { DataContainerT } from "screens/containers/data_container";
import type { UUID } from "kernel/types";
import type { MoveT } from "moves/types";

// $FlowFixMe
export const withMoveContainer = compose(
  Ctr.connect(state => ({
    moveList: Ctr.fromStore.getSelectedMoveList(state),
    filteredMoves: Ctr.fromStore.getFilteredMovesInList(state),
    moveContainerPayload: Ctr.fromStore.getMoveContainerPayload(state),
  })),
  (WrappedComponent: any) => (props: any) => {
    const {
      moveList,
      filteredMoves,
      moveContainerPayload,
      ...passThroughProps
    } = props;

    const moveListId = getId(moveList);

    function _setPayload(payload, targetItemId, isBefore) {
      props.dispatch(
        actSetMoveContainerPayload(payload, targetItemId, isBefore)
      );
    }

    function _insertPayload(cancel: boolean) {
      if (!cancel) {
        const allMoveIds = props.dispatch(
          actInsertMoveIds(
            moveContainerPayload.payload.map(x => x.id),
            moveListId,
            moveContainerPayload.targetItemId,
            moveContainerPayload.isBefore
          )
        );
        Ctr.api
          .saveMoveOrdering(moveListId, allMoveIds)
          .catch(createErrorHandler("We could not update the move list"));
      }
      _setPayload([], "", false);
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
      setPayload: _setPayload,
    };

    return (
      <WrappedComponent moveContainer={moveContainer} {...passThroughProps} />
    );
  }
);

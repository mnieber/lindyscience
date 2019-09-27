// @flow

import * as React from "react";
import { compose } from "redux";

import type {
  DataContainerT,
  PayloadT,
} from "screens/containers/data_container";
import Ctr from "screens/containers/index";
import { actSetMoveContainerPayload } from "screens/actions";
import { actInsertMoveIds } from "move_lists/actions";
import { getPreview } from "screens/utils";
import { createErrorHandler, getId } from "app/utils";
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

    function _setPayload(payload) {
      props.dispatch(actSetMoveContainerPayload(payload));
    }

    function _insertPayload(
      cancel: boolean,
      overridePayload: ?PayloadT<MoveT>
    ) {
      const pl = overridePayload || moveContainerPayload;
      if (!cancel && pl != null) {
        const allMoveIds = props.dispatch(
          actInsertMoveIds(
            pl.payload.map(x => x.id),
            moveListId,
            pl.targetItemId,
            pl.isBefore
          )
        );
        Ctr.api
          .saveMoveOrdering(moveListId, allMoveIds)
          .catch(createErrorHandler("We could not update the move list"));
      }
      _setPayload(null);
    }

    const moveContainer: DataContainerT<MoveT> = {
      insertPayload: _insertPayload,
      preview: getPreview<MoveT>(filteredMoves, moveContainerPayload),
      payload: moveContainerPayload,
      setPayload: _setPayload,
    };

    return (
      <WrappedComponent moveContainer={moveContainer} {...passThroughProps} />
    );
  }
);

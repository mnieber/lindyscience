// @flow

import * as React from "react";

import { compose } from "redux";

import Ctr from "screens/containers/index";
import { findTargetId, getPreview } from "screens/utils";
import { createErrorHandler, getId } from "app/utils";

import type { DataContainerT } from "screens/containers/data_container";
import type { UUID } from "kernel/types";
import type { MoveListT } from "move_lists/types";

// $FlowFixMe
export const withMoveListContainer = compose(
  Ctr.connect(
    state => ({
      moveLists: Ctr.fromStore.getMoveLists(state),
      moveListContainerPayload: Ctr.fromStore.getMoveListContainerPayload(
        state
      ),
    }),
    {
      actInsertMoveListIds: Ctr.actions.actInsertMoveListIds,
      actSetMoveListFilter: Ctr.actions.actSetMoveListFilter,
      actSetMoveListContainerPayload:
        Ctr.actions.actSetMoveListContainerPayload,
    }
  ),
  (WrappedComponent: any) => (props: any) => {
    const {
      moveLists,
      moveListContainerPayload,
      actInsertMoveListIds,
      actSetMoveListFilter,
      actSetMoveListContainerPayload,
      ...passThroughProps
    } = props;

    function _insert(
      payloadIds: Array<UUID>,
      targetMoveListId: UUID,
      isBefore: boolean
    ) {
      const predecessorId = findTargetId(
        payloadIds,
        targetMoveListId,
        isBefore
      );
      const allMoveListIds = actInsertMoveListIds(payloadIds, predecessorId);
      Ctr.api
        .saveMoveListOrdering(allMoveListIds)
        .catch(createErrorHandler("We could not update the move list"));
    }

    const _setPayload = (payload: Array<MoveListT>, targetItemId: UUID) => {
      function _filter(moveLists: Array<MoveListT>) {
        return getPreview<MoveListT>(moveLists, payload, targetItemId);
      }
      actSetMoveListFilter("insertMoveListPreview", _filter);
      actSetMoveListContainerPayload(payload, targetItemId);
    };

    const moveListContainer: DataContainerT<MoveListT> = {
      insert: _insert,
      preview: getPreview<MoveListT>(
        moveLists,
        moveListContainerPayload.payload,
        moveListContainerPayload.targetItemId
      ),
      payloadIds: moveListContainerPayload.payload.map(x => x.id),
      targetItemId: moveListContainerPayload.targetItemId,
      setPayload: _setPayload,
    };

    return (
      <WrappedComponent
        moveListContainer={moveListContainer}
        {...passThroughProps}
      />
    );
  }
);

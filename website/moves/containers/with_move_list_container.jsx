// @flow

import * as React from "react";

import { compose } from "redux";

import MovesCtr from "moves/containers/index";
import { findTargetId, getPreview } from "moves/utils";
import { createErrorHandler, getId } from "app/utils";

import type { DataContainerT } from "moves/containers/data_container";
import type { UUID } from "app/types";
import type { MoveT, MoveListT, MoveByIdT } from "moves/types";

// $FlowFixMe
export const withMoveListContainer = compose(
  MovesCtr.connect(
    state => ({
      moveListById: MovesCtr.fromStore.getMoveListById(state),
      moveLists: MovesCtr.fromStore.getMoveLists(state),
    }),
    {
      actInsertMoveLists: MovesCtr.actions.actInsertMoveLists,
    }
  ),
  (WrappedComponent: any) => (props: any) => {
    const {
      moveListById,
      moveLists,
      actInsertMoveLists,
      ...passThroughProps
    } = props;

    const [payloadIds: Array<UUID>, setPayloadIds: Function] = React.useState(
      []
    );
    const [targetItemId: UUID, setTargetItemId: Function] = React.useState("");

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
      const allMoveListIds = actInsertMoveLists(payloadIds, predecessorId);
      MovesCtr.api
        .saveMoveListOrdering(allMoveListIds)
        .catch(createErrorHandler("We could not update the move list"));
    }

    const _setPayload = (payload: Array<MoveListT>, targetItemId: UUID) => {
      setTargetItemId(targetItemId);
      setPayloadIds(payload.map(x => x.id));
    };

    const moveListContainer: DataContainerT<MoveListT> = {
      insert: _insert,
      preview: getPreview<MoveListT>(
        moveLists,
        payloadIds.map(x => moveListById[x]),
        targetItemId
      ),
      payloadIds,
      targetItemId,
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

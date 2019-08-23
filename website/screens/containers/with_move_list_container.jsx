// @flow

import * as React from "react";

import { compose } from "redux";

import Ctr from "screens/containers/index";
import { findTargetId, getPreview } from "screens/utils";
import { createErrorHandler, getId } from "app/utils";

import type { DataContainerT } from "screens/containers/data_container";
import type { UUID } from "app/types";
import type { MoveListT } from "screens/types";

// $FlowFixMe
export const withMoveListContainer = compose(
  Ctr.connect(
    state => ({
      moveLists: Ctr.fromStore.getMoveLists(state),
    }),
    {
      actInsertMoveListIds: Ctr.actions.actInsertMoveListIds,
      actSetMoveListFilter: Ctr.actions.actSetMoveListFilter,
    }
  ),
  (WrappedComponent: any) => (props: any) => {
    const {
      moveLists,
      actInsertMoveListIds,
      actSetMoveListFilter,
      ...passThroughProps
    } = props;

    const [targetItemId: UUID, setTargetItemId: Function] = React.useState("");
    const [payload: Array<MoveListT>, setPayload: Function] = React.useState(
      []
    );

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
      setPayload(payload);
      setTargetItemId(targetItemId);
    };

    const moveListContainer: DataContainerT<MoveListT> = {
      insert: _insert,
      preview: getPreview<MoveListT>(moveLists, payload, targetItemId),
      payloadIds: payload.map(x => x.id),
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

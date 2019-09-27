// @flow

import * as React from "react";

import { compose } from "redux";

import Ctr from "screens/containers/index";
import { getPreview } from "screens/utils";
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
    Ctr.actions
  ),
  (WrappedComponent: any) => (props: any) => {
    const { moveLists, moveListContainerPayload, ...passThroughProps } = props;

    const actions: any = props;

    function _insertPayload() {
      const payLoadIds = moveListContainerPayload.payload.map(x => x.id);
      const allMoveListIds = actions.actInsertMoveListIds(
        payLoadIds,
        moveListContainerPayload.targetItemId,
        moveListContainerPayload.isBefore
      );
      Ctr.api
        .saveMoveListOrdering(allMoveListIds)
        .catch(createErrorHandler("We could not update the move list"));
    }

    const moveListContainer: DataContainerT<MoveListT> = {
      insertPayload: _insertPayload,
      preview: getPreview<MoveListT>(
        moveLists,
        moveListContainerPayload.payload,
        moveListContainerPayload.targetItemId,
        moveListContainerPayload.isBefore
      ),
      payload: moveListContainerPayload.payload,
      targetItemId: moveListContainerPayload.targetItemId,
      setPayload: actions.actSetMoveListContainerPayload,
    };

    return (
      <WrappedComponent
        moveListContainer={moveListContainer}
        {...passThroughProps}
      />
    );
  }
);

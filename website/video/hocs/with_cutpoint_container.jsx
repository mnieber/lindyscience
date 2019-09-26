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
export const withCutPointsContainer = compose(
  Ctr.connect(
    state => ({
      cutPoints: Ctr.fromStore.getCutPoints(state),
      cutPointContainerPayload: Ctr.fromStore.getCutPointContainerPayload(
        state
      ),
    }),
    Ctr.actions
  ),
  (WrappedComponent: any) => (props: any) => {
    const { cutPoints, cutPointContainerPayload, ...passThroughProps } = props;

    const actions: any = props;

    function _insert(
      payloadIds: Array<UUID>,
      targetId: UUID,
      isBefore: boolean
    ) {
      const predecessorId = findTargetId(
        cutPoints.map(x => x.id),
        targetId,
        isBefore
      );
      actions.actInsertCutPoints(payloadIds, moveListId, predecessorId);
    }

    const _setPayload = (payload: Array<MoveT>, targetItemId: UUID) => {
      actions.actSetMoveContainerPayload(payload, targetItemId);
    };

    const moveContainer: DataContainerT<MoveT> = {
      insert: _insert,
      preview: getPreview<MoveT>(
        cutPoints,
        moveContainerPayload.payload,
        moveContainerPayload.targetItemId
      ),
      payloadIds: moveContainerPayload.payload.map(x => x.id),
      targetItemId: moveContainerPayload.targetItemId,
      setPayload: _setPayload,
    };

    return (
      <WrappedComponent moveContainer={moveContainer} {...passThroughProps} />
    );
  }
);

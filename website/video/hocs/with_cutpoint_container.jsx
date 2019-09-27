// @flow

import * as React from "react";

import { compose } from "redux";

import Ctr from "screens/containers/index";
import { findTargetId, getPreview } from "screens/utils";
import { createErrorHandler, getId } from "app/utils";

import type { DataContainerT } from "screens/containers/data_container";
import type { UUID } from "kernel/types";
import type { CutPointT } from "video/types";

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
      payload: Array<CutPointT>,
      targetId: UUID,
      isBefore: boolean
    ) {
      const predecessorId = findTargetId(
        cutPoints.map(x => x.id),
        targetId,
        isBefore
      );
      actions.actInsertCutPoints(payload, predecessorId);
    }

    const _setPayload = (payload: Array<CutPointT>, targetItemId: UUID) => {
      actions.actSetcutPointContainerPayload(payload, targetItemId);
    };

    const cutPointContainer: DataContainerT<CutPointT> = {
      insert: _insert,
      preview: getPreview<CutPointT>(
        cutPoints,
        cutPointContainerPayload.payload,
        cutPointContainerPayload.targetItemId
      ),
      payload: cutPointContainerPayload.payload,
      targetItemId: cutPointContainerPayload.targetItemId,
      setPayload: _setPayload,
    };

    return (
      <WrappedComponent
        cutPointContainer={cutPointContainer}
        {...passThroughProps}
      />
    );
  }
);

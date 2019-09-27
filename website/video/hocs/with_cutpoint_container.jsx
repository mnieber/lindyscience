// @flow

import * as React from "react";

import { compose } from "redux";

import Ctr from "screens/containers/index";
import { getPreview } from "screens/utils";
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

    const cutPointContainer: DataContainerT<CutPointT> = {
      insertPayload: actions.actInsertCutPoints,
      preview: getPreview<CutPointT>(
        cutPoints,
        cutPointContainerPayload.payload,
        cutPointContainerPayload.targetItemId
      ),
      payload: cutPointContainerPayload.payload,
      targetItemId: cutPointContainerPayload.targetItemId,
      setPayload: actions.actSetcutPointContainerPayload,
    };

    return (
      <WrappedComponent
        cutPointContainer={cutPointContainer}
        {...passThroughProps}
      />
    );
  }
);

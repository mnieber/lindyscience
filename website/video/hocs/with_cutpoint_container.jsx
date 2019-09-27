// @flow

import * as React from "react";
import { compose } from "redux";

import Ctr from "screens/containers/index";
import { getPreview } from "screens/utils";
import { createErrorHandler, getId } from "app/utils";
import { actInsertCutPoints } from "video/actions";

import type { SimpleDataContainerT } from "screens/containers/data_container";
import type { UUID } from "kernel/types";
import type { CutPointT } from "video/types";

// $FlowFixMe
export const withCutPointsContainer = compose(
  Ctr.connect(state => ({
    cutPoints: Ctr.fromStore.getCutPoints(state),
    cutPointContainerPayload: Ctr.fromStore.getCutPointContainerPayload(state),
  })),
  (WrappedComponent: any) => (props: any) => {
    const { cutPoints, cutPointContainerPayload, ...passThroughProps } = props;

    const cutPointContainer: SimpleDataContainerT<CutPointT> = {
      insert: (cutPoints, targetItemId, isBefore) =>
        props.dispatch(actInsertCutPoints(cutPoints)),
    };

    return (
      <WrappedComponent
        cutPointContainer={cutPointContainer}
        {...passThroughProps}
      />
    );
  }
);

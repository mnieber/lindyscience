import * as React from "react";
import { compose } from "redux";

import type { PayloadT } from "screens/containers/data_container";
import Ctr from "screens/containers/index";
import { createErrorHandler, getId } from "app/utils";
import { actInsertCutPoints } from "video/actions";
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

    return (
      <WrappedComponent
        cutPointContainer={cutPointContainer}
        {...passThroughProps}
      />
    );
  }
);

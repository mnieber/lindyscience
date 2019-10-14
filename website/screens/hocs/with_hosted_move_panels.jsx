// @flow

import * as React from "react";
import { compose } from "redux";

import Ctr from "screens/containers/index";

import { withMovePrivateDataPanel } from "screens/hocs/with_move_private_data_panel";
import { withTipsPanel } from "screens/hocs/with_tips_panel";

type PropsT = {
  movePrivateDataPanel: any,
  tipsPanel: any,
};

// $FlowFixMe
export const withHostedMovePanels = compose(
  withMovePrivateDataPanel,
  withTipsPanel,
  Ctr.connect(state => ({})),
  (WrappedComponent: any) => (props: any) => {
    const {
      tipsPanel,
      movePrivateDataPanel,
      ...passThroughProps
    }: PropsT = props;

    const hostedMovePanels = (
      <React.Fragment>
        {movePrivateDataPanel}
        {tipsPanel}
      </React.Fragment>
    );

    return (
      <WrappedComponent
        hostedMovePanels={hostedMovePanels}
        {...passThroughProps}
      />
    );
  }
);

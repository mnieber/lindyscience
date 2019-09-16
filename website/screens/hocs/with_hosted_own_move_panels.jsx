// @flow

import * as React from "react";
import { compose } from "redux";

import Ctr from "screens/containers/index";

import { withMovePrivateDataPanel } from "screens/hocs/with_move_private_data_panel";
import { withTipsPanel } from "screens/hocs/with_tips_panel";

type PropsT = {
  movePrivateDataPanel: any,
  tipsPanel: any,
  // receive any actions as well
};

// $FlowFixMe
export const withHostedOwnMovePanels = getMove =>
  compose(
    withMovePrivateDataPanel(getMove),
    withTipsPanel(getMove),
    Ctr.connect(state => ({}), Ctr.actions),
    (WrappedComponent: any) => (props: any) => {
      const {
        tipsPanel,
        movePrivateDataPanel,
        ...passThroughProps
      }: PropsT = props;

      const hostedOwnMovePanels = (
        <React.Fragment>
          {movePrivateDataPanel}
          {tipsPanel}
        </React.Fragment>
      );

      return (
        <WrappedComponent
          hostedOwnMovePanels={hostedOwnMovePanels}
          {...passThroughProps}
        />
      );
    }
  );

// @flow

import * as React from "react";
import { compose } from "redux";

import Ctr from "screens/containers/index";

import { withMovePrivateDataPanel } from "screens/hocs/with_move_private_data_panel";
import { withVideoLinksPanel } from "screens/hocs/with_videolinks_panel";
import { withTipsPanel } from "screens/hocs/with_tips_panel";

type PropsT = {
  movePrivateDataPanel: any,
  tipsPanel: any,
  videoLinksPanel: any,
  // receive any actions as well
};

// $FlowFixMe
export const withHostedOwnMovePanels = getMove =>
  compose(
    withMovePrivateDataPanel(getMove),
    withTipsPanel(getMove),
    withVideoLinksPanel(getMove),
    Ctr.connect(state => ({}), Ctr.actions),
    (WrappedComponent: any) => (props: any) => {
      const {
        videoLinksPanel,
        tipsPanel,
        movePrivateDataPanel,
        ...passThroughProps
      }: PropsT = props;

      const hostedOwnMovePanels = (
        <React.Fragment>
          {movePrivateDataPanel}
          {tipsPanel}
          {videoLinksPanel}
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

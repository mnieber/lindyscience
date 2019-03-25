// @flow

import * as React from "react";
import { compose } from "redux";

import MovesCtr from "moves/containers/index";
import AppCtr from "app/containers/index";

import Widgets from "moves/presentation/index";

// $FlowFixMe
import uuidv4 from "uuid/v4";
import { getId, createErrorHandler } from "app/utils";

import type { MoveT } from "moves/types";

type PropsT = {
  move: MoveT,
  // receive any actions as well
};

// $FlowFixMe
export const withMovePrivateDataPanel = compose(
  MovesCtr.connect(
    state => ({
      move: MovesCtr.fromStore.getHighlightedMove(state),
      userProfile: AppCtr.fromStore.getUserProfile(state),
    }),
    {
      ...AppCtr.actions,
      ...MovesCtr.actions,
    }
  ),
  (WrappedComponent: any) => (props: any) => {
    const { move, ...passThroughProps }: PropsT = props;

    const actions: any = props;

    const _onSave = values => {
      const movePrivateData = {
        id: uuidv4(),
        moveId: getId(move),
        ...move.privateData,
        ...values,
      };

      actions.actAddMovePrivateDatas([movePrivateData]);
      MovesCtr.api
        .saveMovePrivateData(movePrivateData)
        .catch(
          createErrorHandler(
            "We could not update your private data for this move"
          )
        );
    };

    const movePrivateDataPanel = (
      <Widgets.MovePrivateDataPanel
        userProfile={props.userProfile}
        movePrivateData={move ? move.privateData : undefined}
        onSave={_onSave}
      />
    );

    return (
      <WrappedComponent
        movePrivateDataPanel={movePrivateDataPanel}
        {...passThroughProps}
      />
    );
  }
);

// @flow

import * as React from "react";
import { compose } from "redux";

import MovesCtr from "moves/containers/index";
import AppCtr from "app/containers/index";
import ProfilesCtr from "profiles/containers/index";

import Widgets from "moves/presentation/index";

// $FlowFixMe
import uuidv4 from "uuid/v4";
import { getId, createErrorHandler } from "app/utils";

import type { MoveT } from "moves/types";
import type { TagT } from "profiles/types";

type PropsT = {
  move: MoveT,
  moveTags: Array<TagT>,
  // receive any actions as well
};

// $FlowFixMe
export const withMovePrivateDataPanel = compose(
  MovesCtr.connect(
    state => ({
      move: MovesCtr.fromStore.getHighlightedMove(state),
      userProfile: ProfilesCtr.fromStore.getUserProfile(state),
      moveTags: MovesCtr.fromStore.getMoveTags(state),
    }),
    {
      ...AppCtr.actions,
      ...MovesCtr.actions,
      ...ProfilesCtr.actions,
    }
  ),
  (WrappedComponent: any) => (props: any) => {
    const { move, moveTags, ...passThroughProps }: PropsT = props;

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
        moveTags={moveTags}
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

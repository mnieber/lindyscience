// @flow

import * as React from "react";
import { compose } from "redux";

import Ctr from "moves/containers/index";
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
  Ctr.connect(
    state => ({
      move: Ctr.fromStore.getHighlightedMove(state),
      userProfile: Ctr.fromStore.getUserProfile(state),
      moveTags: Ctr.fromStore.getMoveTags(state),
    }),
    Ctr.actions
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
      Ctr.api
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

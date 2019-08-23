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
import type { UserProfileT } from "profiles/types";

type PropsT = {
  userProfile: UserProfileT,
  moveTags: Array<TagT>,
  // receive any actions as well
};

// $FlowFixMe
export const withMovePrivateDataPanel = getMove =>
  compose(
    Ctr.connect(
      state => ({
        userProfile: Ctr.fromStore.getUserProfile(state),
        moveTags: Ctr.fromStore.getMoveTags(state),
      }),
      Ctr.actions
    ),
    (WrappedComponent: any) => (props: any) => {
      const { userProfile, moveTags, ...passThroughProps }: PropsT = props;
      const move: MoveT = getMove();

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
          userProfile={userProfile}
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

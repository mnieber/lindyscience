// @flow

import * as React from "react";
import { compose } from "redux";

import { create_uuid } from "utils/utils";
import Ctr from "screens/containers/index";
import { actAddMovePrivateDatas } from "moves/actions";
import Widgets from "screens/presentation/index";
import { getId, createErrorHandler } from "app/utils";
import type { MoveT } from "moves/types";
import type { TagT } from "tags/types";
import type { UserProfileT } from "profiles/types";

type PropsT = {
  userProfile: UserProfileT,
  moveTags: Array<TagT>,
  // receive any actions as well
};

// $FlowFixMe
export const withMovePrivateDataPanel = getMove =>
  compose(
    Ctr.connect(state => ({
      userProfile: Ctr.fromStore.getUserProfile(state),
      moveTags: Ctr.fromStore.getMoveTags(state),
    })),
    (WrappedComponent: any) => (props: any) => {
      const { userProfile, moveTags, ...passThroughProps }: PropsT = props;
      const move: MoveT = getMove();

      const _onSave = values => {
        const movePrivateData = {
          id: create_uuid(),
          moveId: getId(move),
          ...move.privateData,
          ...values,
        };

        props.dispatch(
          actAddMovePrivateDatas({ [movePrivateData.id]: movePrivateData })
        );
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

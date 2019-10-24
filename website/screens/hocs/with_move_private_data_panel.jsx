// @flow

import * as React from "react";
import { compose } from "redux";
import { observer } from "mobx-react";

import { MovesContainer } from "screens/moves_container/moves_container";
import { createUUID } from "utils/utils";
import Ctr from "screens/containers/index";
import { actAddMovePrivateDatas } from "moves/actions";
import Widgets from "screens/presentation/index";
import { getId, createErrorHandler } from "app/utils";
import { apiSaveMovePrivateData } from "moves/api";
import type { TagT } from "tags/types";
import type { UserProfileT } from "profiles/types";

type PropsT = {
  userProfile: UserProfileT,
  moveTags: Array<TagT>,
  videoBvr?: any,
  movesCtr: MovesContainer,
};

// $FlowFixMe
export const withMovePrivateDataPanel = compose(
  Ctr.connect(state => ({
    userProfile: Ctr.fromStore.getUserProfile(state),
    moveTags: Ctr.fromStore.getMoveTags(state),
  })),
  observer,
  (WrappedComponent: any) => (props: any) => {
    const { userProfile, moveTags, ...passThroughProps }: PropsT = props;
    const videoPlayer = props.videoBvr ? props.videoBvr.player : undefined;

    const move = props.movesCtr.highlight.item;

    const _onSave = values => {
      const movePrivateData = {
        id: createUUID(),
        moveId: getId(move),
        ...move.privateData,
        ...values,
      };

      props.dispatch(
        actAddMovePrivateDatas({ [movePrivateData.id]: movePrivateData })
      );
      apiSaveMovePrivateData(movePrivateData).catch(
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
        moveId={getId(move)}
        videoPlayer={videoPlayer}
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

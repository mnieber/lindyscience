// @flow

import * as React from "react";
import { compose } from "redux";

import MovesCtr from "moves/containers/index";
import AppCtr from "app/containers/index";

import Widgets from "moves/presentation/index";

// $FlowFixMe
import uuidv4 from "uuid/v4";
import { getId, createErrorHandler } from "app/utils";
import { querySetListToDict } from "utils/utils";

import type { MoveT, VideoLinkT, VideoLinksByIdT } from "moves/types";
import type { UUID, VoteT, UserProfileT, VoteByIdT } from "app/types";

type PropsT = {
  move: MoveT,
  voteByObjectId: VoteByIdT,
  videoLinksByMoveId: VideoLinksByIdT,
  userProfile: UserProfileT,

  // receive any actions as well
};

// $FlowFixMe
export const withVideoLinksPanel = compose(
  MovesCtr.connect(
    state => ({
      move: MovesCtr.fromStore.getHighlightedMove(state),
      userProfile: AppCtr.fromStore.getUserProfile(state),
      videoLinksByMoveId: MovesCtr.fromStore.getVideoLinksByMoveId(state),
      voteByObjectId: AppCtr.fromStore.getVoteByObjectId(state),
    }),
    {
      ...AppCtr.actions,
      ...MovesCtr.actions,
    }
  ),
  (WrappedComponent: any) => (props: any) => {
    const {
      move,
      userProfile,
      videoLinksByMoveId,
      voteByObjectId,
      ...passThroughProps
    }: PropsT = props;

    const actions: any = props;

    const saveVideoLink = (videoLink: VideoLinkT) => {
      actions.actAddVideoLinks(querySetListToDict([videoLink]));
      let response = MovesCtr.api.saveVideoLink(move.id, videoLink);
      response.catch(createErrorHandler("We could not save the video link"));
    };

    const voteVideoLink = (id: UUID, vote: VoteT) => {
      actions.actCastVote(id, vote);
      AppCtr.api
        .voteVideoLink(id, vote)
        .catch(createErrorHandler("We could not save your vote"));
    };

    const videoLinksPanel = (
      <Widgets.VideoLinksPanel
        moveId={getId(move)}
        userProfile={userProfile}
        videoLinks={videoLinksByMoveId[getId(move)]}
        voteByObjectId={voteByObjectId}
        saveVideoLink={saveVideoLink}
        voteVideoLink={voteVideoLink}
      />
    );

    return (
      <WrappedComponent
        videoLinksPanel={videoLinksPanel}
        {...passThroughProps}
      />
    );
  }
);

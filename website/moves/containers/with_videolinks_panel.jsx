// @flow

import * as React from "react";
import { compose } from "redux";

import Ctr from "moves/containers/index";

import Widgets from "moves/presentation/index";

import { getId, createErrorHandler } from "app/utils";
import { querySetListToDict } from "utils/utils";

import type { MoveT, VideoLinkT, VideoLinksByIdT } from "moves/types";
import type { UUID } from "app/types";
import type { UserProfileT } from "profiles/types";
import type { VoteT, VoteByIdT } from "votes/types";

type PropsT = {
  move: MoveT,
  voteByObjectId: VoteByIdT,
  videoLinksByMoveId: VideoLinksByIdT,
  userProfile: UserProfileT,

  // receive any actions as well
};

// $FlowFixMe
export const withVideoLinksPanel = compose(
  Ctr.connect(
    state => ({
      move: Ctr.fromStore.getHighlightedMove(state),
      userProfile: Ctr.fromStore.getUserProfile(state),
      videoLinksByMoveId: Ctr.fromStore.getVideoLinksByMoveId(state),
      voteByObjectId: Ctr.fromStore.getVoteByObjectId(state),
    }),
    Ctr.actions
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
      let response = Ctr.api.saveVideoLink(move.id, videoLink);
      response.catch(createErrorHandler("We could not save the video link"));
    };

    const deleteVideoLink = (videolink: VideoLinkT) => {
      actions.actRemoveVideoLinks([videolink.id]);
      Ctr.api
        .deleteVideoLink(videolink.id)
        .catch(createErrorHandler("We could not delete the videolink"));
    };

    const voteVideoLink = (id: UUID, vote: VoteT) => {
      actions.actCastVote(id, vote);
      Ctr.api
        .voteVideoLink(id, vote)
        .catch(createErrorHandler("We could not save your vote"));
    };

    const videoLinksPanel = (
      <Widgets.VideoLinksPanel
        move={move}
        userProfile={userProfile}
        videoLinks={videoLinksByMoveId[getId(move)]}
        voteByObjectId={voteByObjectId}
        saveVideoLink={saveVideoLink}
        deleteVideoLink={deleteVideoLink}
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

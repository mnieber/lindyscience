// @flow

import * as React from "react";
import { compose } from "redux";

import Ctr from "screens/containers/index";

import Widgets from "screens/presentation/index";

import { getId, createErrorHandler } from "app/utils";
import { querySetListToDict } from "utils/utils";

import type { MoveT } from "moves/types";
import type { VideoLinkT, VideoLinksByIdT } from "videolinks/types";
import type { UUID } from "kernel/types";
import type { UserProfileT } from "profiles/types";
import type { VoteT, VoteByIdT } from "votes/types";

type PropsT = {
  voteByObjectId: VoteByIdT,
  videoLinksByMoveId: VideoLinksByIdT,
  userProfile: UserProfileT,

  // receive any actions as well
};

// $FlowFixMe
export const withVideoLinksPanel = getMove =>
  compose(
    Ctr.connect(
      state => ({
        userProfile: Ctr.fromStore.getUserProfile(state),
        videoLinksByMoveId: Ctr.fromStore.getVideoLinksByMoveId(state),
        voteByObjectId: Ctr.fromStore.getVoteByObjectId(state),
      }),
      Ctr.actions
    ),
    (WrappedComponent: any) => (props: any) => {
      const {
        userProfile,
        videoLinksByMoveId,
        voteByObjectId,
        ...passThroughProps
      }: PropsT = props;
      const move: MoveT = getMove();

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
          parentObject={move}
          userProfile={userProfile}
          videoLinks={videoLinksByMoveId[getId(move)] || []}
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

// @flow

import * as React from 'react'
// TODO: move out of the presentation layer
import * as api from 'moves/api'
import * as appApi from 'app/api'

import { VideoLinkList } from 'moves/presentation/videolink';

// $FlowFixMe
import uuidv4 from 'uuid/v4'
import { createErrorHandler } from 'app/utils'
import { querySetListToDict, slugify, isNone } from 'utils/utils'

import type { UUID, VoteT, VoteByIdT, UserProfileT } from 'app/types';
import type { MoveT, VideoLinkT } from 'moves/types'

// Behaviours

type InsertVideoLinkBvrT = {
  preview: Array<VideoLinkT>,
  prepare: Function,
  finalize: Function,
};

export function useInsertVideoLink(
  videoLinks: Array<VideoLinkT>,
) {
  const [sourceVideoLink, setSourceVideoLink] = React.useState(null);

  function prepare(videoLink: VideoLinkT) {
    setSourceVideoLink(videoLink);
  }

  function finalize(isCancel: boolean) {
    setSourceVideoLink(null);
  }

  const preview = !sourceVideoLink
    ? videoLinks
    : [...videoLinks, sourceVideoLink]

  return {preview, prepare, finalize};
}

type NewVideoLinkBvrT = {
  newVideoLink: ?VideoLinkT,
  add: Function,
  finalize: Function,
};

export function useNewVideoLink(
  userId: number,
  insertVideoLinkBvr: InsertVideoLinkBvrT,
  moveId: UUID,
) {
  const [newVideoLink, setNewVideoLink] = React.useState(null);

  function _createNewVideoLink(): VideoLinkT {
    return {
      id: uuidv4(),
      ownerId: userId,
      title: '',
      moveId: moveId,
      url: '',
      voteCount: 0,
      initialVoteCount: 0,
    };
  }

  // Store a new move in the function's state
  function add() {
    const newVideoLink = _createNewVideoLink();
    setNewVideoLink(newVideoLink);
    insertVideoLinkBvr.prepare(newVideoLink);
  }

  // Remove new move from the function's state
  function finalize(isCancel: boolean) {
    insertVideoLinkBvr.finalize(isCancel);
    setNewVideoLink(null);
  }

  return {newVideoLink, add, finalize};
}


type IncompleteValuesT = {
  url: string,
  title: string,
};


type SaveVideoLinkBvr = {
  save: Function,
  discardChanges: Function
};

export function useSaveVideoLink(
  newVideoLinkBvr: NewVideoLinkBvrT,
  moveId: UUID,
  videoLinks: Array<VideoLinkT>,
  actAddVideoLinks: Function,
) {
  function save(id: UUID, incompleteValues: IncompleteValuesT) {
    const videoLink: VideoLinkT = {
      ...videoLinks.find(x => x.id == id),
      ...incompleteValues,
    };

    actAddVideoLinks(querySetListToDict([videoLink]));
    let response = api.saveVideoLink(moveId, videoLink);
    response.catch(createErrorHandler('We could not save the video link'));

    newVideoLinkBvr.finalize(false);
  }

  function discardChanges() {
    newVideoLinkBvr.finalize(true);
  }

  return {save, discardChanges};
}

type VoteVideoLinkBvrT = {
  vote: Function
};

export function useVoteVideoLink(
  actCastVote: Function,
): VoteVideoLinkBvrT {
  const vote = (id: UUID, vote: VoteT) => {
    actCastVote(id, vote);
    appApi.voteVideoLink(id, vote)
    .catch(createErrorHandler('We could not save your vote'));
  }

  return {vote};
}

type VideoLinksPanelPropsT = {
  moveId: UUID,
  userProfile: UserProfileT,
  videoLinks: Array<VideoLinkT>,
  voteByObjectId: VoteByIdT,
  actAddVideoLinks: Function,
  actCastVote: Function,
};

export function VideoLinksPanel(props: VideoLinksPanelPropsT) {
  const insertVideoLinkBvr = useInsertVideoLink(props.videoLinks);

  const newVideoLinkBvr = useNewVideoLink(
    props.userProfile.userId,
    insertVideoLinkBvr,
    props.moveId,
  );
  const saveVideoLinkBvr = useSaveVideoLink(
    newVideoLinkBvr,
    props.moveId,
    insertVideoLinkBvr.preview,
    props.actAddVideoLinks,
  );
  const voteVideoLinkBvr = useVoteVideoLink(
    props.actCastVote
  );

  const addVideoLinkBtn = (
    <div
      className={"videoLinksPanel__addButton button button--wide ml-2"}
      onClick={newVideoLinkBvr.add}
    >
    Add
    </div>
  );

  return (
    <div className={"videoLinksPanel panel"}>
      <div className= {"videoLinksPanel__header flex flex-wrap mb-4"}>
        <h2>Video links</h2>
        {addVideoLinkBtn}
      </div>
      <VideoLinkList
        items={insertVideoLinkBvr.preview}
        setVote={voteVideoLinkBvr.vote}
        saveVideoLink={saveVideoLinkBvr.save}
        cancelEditVideoLink={saveVideoLinkBvr.discardChanges}
        voteByObjectId={props.voteByObjectId}
      />
    </div>
  );
};

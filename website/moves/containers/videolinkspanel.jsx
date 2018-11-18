// @flow

import * as actions from 'moves/actions'
import * as api from 'moves/api'
import * as fromStore from 'moves/reducers'
import * as React from 'react'
import type { UUID } from 'app/types';
import type { VoteT, VoteByIdT, MoveT, VideoLinkT } from 'moves/types'
// $FlowFixMe
import uuidv4 from 'uuid/v4'
import { connect } from 'react-redux'
import { createErrorHandler } from 'utils/utils'
import { querySetListToDict, slugify, isNone } from 'utils/utils'
import { useFlag } from 'utils/hooks'
import { useState } from 'react';
import { VideoLinkList } from 'moves/presentation/videolink';

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
  insertVideoLinkBvr: InsertVideoLinkBvrT,
  moveId: UUID,
) {
  const [newVideoLink, setNewVideoLink] = React.useState(null);

  function _createNewVideoLink(): VideoLinkT {
    return {
      id: uuidv4(),
      owner: 1,
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
  createErrorHandler: Function,
) {
  function save(id: UUID, incompleteValues: IncompleteValuesT) {
    const videoLink: VideoLinkT = {
      ...videoLinks.find(x => x.id == id),
      ...incompleteValues,
    };

    actAddVideoLinks(querySetListToDict([videoLink]));
    let response = api.saveVideoLink(
      !!newVideoLinkBvr.newVideoLink && newVideoLinkBvr.newVideoLink.id == id,
      moveId,
      videoLink,
    );
    response.catch(createErrorHandler('We could not save the video link'));

    newVideoLinkBvr.finalize(false);
  }

  function discardChanges() {
    newVideoLinkBvr.finalize(true);
  }

  return {save, discardChanges};
}


function VideoLinksPanel({
  moveId,
  videoLinks,
  voteByObjectId,
  actAddVideoLinks,
  actCastVote,
}: {
  moveId: UUID,
  videoLinks: Array<VideoLinkT>,
  voteByObjectId: VoteByIdT,
  actAddVideoLinks: Function,
  actCastVote: Function,
}) {
  const insertVideoLinkBvr = useInsertVideoLink(videoLinks);
  const newVideoLinkBvr = useNewVideoLink(
    insertVideoLinkBvr,
    moveId,
  );
  const saveVideoLinkBvr = useSaveVideoLink(
    newVideoLinkBvr,
    moveId,
    insertVideoLinkBvr.preview,
    actAddVideoLinks,
    createErrorHandler
  );

  const voteVideoLink = (id: UUID, vote: VoteT) => {
    actCastVote(id, vote);
    api.voteVideoLink(id, vote)
    .catch(createErrorHandler('We could not save your vote'));
  }

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
        setVote={voteVideoLink}
        saveVideoLink={saveVideoLinkBvr.save}
        cancelEditVideoLink={saveVideoLinkBvr.discardChanges}
        voteByObjectId={voteByObjectId}
      />
    </div>
  );
};


function mergeProps(state: any, actions: any,
  {
    moveId
  }: {
    moveId: UUID
  }
) {
  return {
    ...state,
    ...actions,
    moveId: moveId,
    videoLinks: state.videoLinksByMoveId[moveId],
  }
}

VideoLinksPanel = connect(
  (state) => ({
    videoLinksByMoveId: fromStore.getVideoLinksByMoveId(state.moves),
    voteByObjectId: fromStore.getVoteByObjectId(state.moves),
  }),
  actions,
  mergeProps
)(VideoLinksPanel)


export default VideoLinksPanel;

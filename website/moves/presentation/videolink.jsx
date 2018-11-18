// @flow

import * as React from 'react'
import { VoteCount } from 'moves/presentation/vote_count'
import { VideoLinkForm } from 'moves/presentation/video_link_form'
import { useFlag } from 'utils/hooks'
import type { VideoLinkT, VoteT, VoteByIdT } from 'moves/types'


// VideoLinkeoLink

export function VideoLink({
  item,
  vote,
  setVote,
  saveVideoLink,
  cancelEditVideoLink,
} : {
  item: VideoLinkT,
  vote: VoteT,
  setVote: Function,
  saveVideoLink: Function,
  cancelEditVideoLink: Function,
}) {
  const {
    flag: isEditing,
    setTrue: setEditingEnabled,
    setFalse: setEditingDisabled
  } = useFlag(item.url == '');

  if (isEditing) {
    function _onSubmit(values) {
      saveVideoLink(item.id, values);
      setEditingDisabled();
    }

    function _onCancel(e) {
      e.preventDefault();
      cancelEditVideoLink(item.id);
      setEditingDisabled();
    }

    const form = (
      <VideoLinkForm
        values={{
          url: item.url,
          title: item.title,
        }}
        onSubmit={_onSubmit}
        onCancel={_onCancel}
      />
    );

    return (
      <div className='videoLink'>
        {form}
      </div>
    );
  }
  else {
    function _setVote(value) {
      setVote(item.id, value);
    }

    const voteCount = (
      <VoteCount
        vote={vote}
        count={item.voteCount}
        setVote={_setVote}
      />
    )

    const link = (
      <a
        className='videoLink__url'
        href={item.url}
        target='blank'
      >
        {item.title || item.url}
      </a>
    );

    const editBtn = (
      <div
        className="videoLink__editButton ml-2"
        onClick={setEditingEnabled}
      >
      edit
      </div>
    );

    return (
      <div className='videoLink'>
        {voteCount}
        {link}
        {editBtn}
      </div>
    );
  }
}

// VideoLinkList

export function VideoLinkList({
  items,
  voteByObjectId,
  setVote,
  saveVideoLink,
  cancelEditVideoLink,
} : {
  items: Array<VideoLinkT>,
  voteByObjectId: VoteByIdT,
  setVote: Function,
  saveVideoLink: Function,
  cancelEditVideoLink: Function,
}) {
  const itemNodes = items.map<React.Node>((item, idx) => {
    return (
      <VideoLink
        key={item.id}
        item={item}
        vote={voteByObjectId[item.id]}
        setVote={setVote}
        saveVideoLink={saveVideoLink}
        cancelEditVideoLink={cancelEditVideoLink}
      />
    );
  })

  return itemNodes;
}

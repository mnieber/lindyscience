// @flow

import * as React from 'react'
import { VoteCount } from 'app/presentation/vote_count'
import { VideoLinkForm } from 'moves/presentation/video_link_form'
import { useFlag } from 'utils/hooks'
import type { VoteByIdT, VoteT } from 'app/types'
import type { VideoLinkT } from 'moves/types'


// VideoLinkeoLink

type VideoLinkPropsT = {
  item: VideoLinkT,
  vote: VoteT,
  setVote: Function,
  saveVideoLink: Function,
  cancelEditVideoLink: Function,
};

export function VideoLink(props: VideoLinkPropsT) {
  const {
    flag: isEditing,
    setTrue: setEditingEnabled,
    setFalse: setEditingDisabled
  } = useFlag(props.item.url == '');

  if (isEditing) {
    function _onSubmit(values) {
      props.saveVideoLink(props.item.id, values);
      setEditingDisabled();
    }

    function _onCancel(e) {
      e.preventDefault();
      props.cancelEditVideoLink(props.item.id);
      setEditingDisabled();
    }

    const form = (
      <VideoLinkForm
        values={{
          url: props.item.url,
          title: props.item.title,
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
      props.setVote(props.item.id, value);
    }

    const voteCount = (
      <VoteCount
        vote={props.vote}
        count={props.item.voteCount}
        setVote={_setVote}
      />
    )

    const link = (
      <a
        className='videoLink__url'
        href={props.item.url}
        target='blank'
      >
        {props.item.title || props.item.url}
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
type VideoLinkListPropsT = {
  items: Array<VideoLinkT>,
  voteByObjectId: VoteByIdT,
  setVote: Function,
  saveVideoLink: Function,
  cancelEditVideoLink: Function,
};

export function VideoLinkList(props: VideoLinkListPropsT) {
  const itemNodes = props.items.map<React.Node>((item, idx) => {
    return (
      <VideoLink
        key={item.id}
        item={item}
        vote={props.voteByObjectId[item.id] || 0}
        setVote={props.setVote}
        saveVideoLink={props.saveVideoLink}
        cancelEditVideoLink={props.cancelEditVideoLink}
      />
    );
  })

  return itemNodes;
}

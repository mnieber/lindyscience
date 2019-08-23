// @flow

import * as React from "react";
import { VoteCount } from "votes/presentation/vote_count";
import { VideoLinkForm } from "screens/presentation/video_link_form";
import type { UUID } from "app/types";
import type { UserProfileT } from "profiles/types";
import type { VoteByIdT, VoteT } from "votes/types";
import type { MoveT } from "moves/types";
import type { VideoLinkT } from "screens/types";

// VideoLinkeoLink

type VideoLinkPropsT = {
  isOwner: boolean,
  item: VideoLinkT,
  vote: VoteT,
  setVote: (UUID, VoteT) => void,
  saveVideoLink: Function,
  deleteVideoLink: Function,
  cancelEditVideoLink: Function,
};

export function VideoLink(props: VideoLinkPropsT) {
  const [isEditing, setIsEditing] = React.useState(props.item.url == "");
  const [armDelete, setArmDelete] = React.useState(false);

  if (isEditing) {
    function _onSubmit(values) {
      props.saveVideoLink(props.item.id, values);
      setIsEditing(false);
    }

    function _onCancel() {
      props.cancelEditVideoLink(props.item.id);
      setIsEditing(false);
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

    return <div className="videoLink">{form}</div>;
  } else {
    function _setVote(value) {
      props.setVote(props.item.id, value);
    }

    const voteCount = (
      <VoteCount
        vote={props.vote}
        count={props.item.voteCount}
        setVote={_setVote}
      />
    );

    const link = (
      <a className="videoLink__url" href={props.item.url} target="blank">
        {props.item.title || props.item.url}
      </a>
    );

    const editBtn = (
      <div
        className="videoLink__editButton ml-2"
        onClick={() => setIsEditing(true)}
      >
        edit
      </div>
    );

    const deleteBtn = (
      <div
        className="videoLink__editButton ml-2"
        onClick={() => setArmDelete(true)}
      >
        delete...
      </div>
    );

    const confirmDeleteBtn = (
      <div
        className="videoLink__editButton mx-1"
        onClick={() => {
          props.deleteVideoLink(props.item);
          setArmDelete(false);
        }}
      >
        confirm
      </div>
    );

    const cancelDeleteBtn = (
      <div
        className="videoLink__editButton mx-1"
        onClick={() => setArmDelete(false)}
      >
        cancel
      </div>
    );

    const cancelConfirmDiv = (
      <div className="ml-2 px-2 flexrow bg-red-light content-center">
        {confirmDeleteBtn}
        {cancelDeleteBtn}
      </div>
    );

    return (
      <div className="videoLink">
        {voteCount}
        {link}
        {props.isOwner && editBtn}
        {!armDelete && props.isOwner && deleteBtn}
        {armDelete && props.isOwner && cancelConfirmDiv}
      </div>
    );
  }
}

// VideoLinkList
type VideoLinkListPropsT = {
  userProfile: UserProfileT,
  move: MoveT,
  items: Array<VideoLinkT>,
  voteByObjectId: VoteByIdT,
  setVote: (UUID, VoteT) => void,
  saveVideoLink: Function,
  deleteVideoLink: Function,
  cancelEditVideoLink: Function,
};

export function VideoLinkList(props: VideoLinkListPropsT) {
  const itemNodes = props.items.map<React.Node>((item, idx) => {
    const isOwner =
      item.ownerId == props.userProfile.userId ||
      props.move.ownerId == props.userProfile.userId;

    return (
      <VideoLink
        key={item.id}
        item={item}
        isOwner={isOwner}
        vote={props.voteByObjectId[item.id] || 0}
        setVote={props.setVote}
        saveVideoLink={props.saveVideoLink}
        deleteVideoLink={props.deleteVideoLink}
        cancelEditVideoLink={props.cancelEditVideoLink}
      />
    );
  });

  return itemNodes;
}

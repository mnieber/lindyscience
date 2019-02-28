// @flow

import * as React from 'react';
import classnames from 'classnames';
import { Link } from '@reach/router';
import { MoveForm } from 'moves/presentation/move_form';
import type { FlagT } from 'utils/hooks'
import type { MoveT, MoveListT, TagT, VideoLinkT, TipT } from 'moves/types'
import type { UserProfileT, VoteByIdT } from 'app/types'
import { VideoLinksPanel } from 'moves/presentation/videolinks_panel'
import { TipsPanel } from 'moves/presentation/tips_panel'
import { difficulties } from 'utils/form_utils'
import { StaticMove } from 'moves/presentation/static_move'


export function MoveHeader() {
  return (
    <div className = {"move__header"}>
      <Link to='/app/moves'>All moves</Link>
    </div>
  );
}


// Move

type MovePropsT = {|
  move: MoveT,
  userProfile: UserProfileT,
  moveList: MoveListT,
  moveTags: Array<TagT>,
  saveMove: Function,
  cancelEditMove: Function,
  isEditing: boolean,
  setEditingEnabled: Function,
  buttons?: Array<React.Node>,
  className?: string,
  autoFocus?: boolean,
  tips: Array<TipT>,
  videoLinks: Array<VideoLinkT>,
  voteByObjectId: VoteByIdT,
  actAddTips: Function,
  actAddVideoLinks: Function,
  actCastVote: Function,
|};

export function Move(props: MovePropsT) {
  if (props.isEditing) {
    return (
      <div>
        <MoveForm
          autoFocus={props.autoFocus}
          move={props.move}
          onSubmit={props.saveMove}
          onCancel={props.cancelEditMove}
          knownTags={props.moveTags}
        />
      </div>
    );
  }
  else {
    const editMoveBtn =
      <div
        className={"move__editBtn button button--wide ml-2"}
        onClick={props.setEditingEnabled}
        key={1}
      >
      Edit move
      </div>;

    const videoLinksPanel = <VideoLinksPanel
      moveId={props.move.id}
      userProfile={props.userProfile}
      videoLinks={props.videoLinks}
      voteByObjectId={props.voteByObjectId}
      actAddVideoLinks={props.actAddVideoLinks}
      actCastVote={props.actCastVote}
    />;

    const tipsPanel = <TipsPanel
      moveId={props.move.id}
      userProfile={props.userProfile}
      tips={props.tips}
      voteByObjectId={props.voteByObjectId}
      actAddTips={props.actAddTips}
      actCastVote={props.actCastVote}
    />;

    return (
      <StaticMove
        move={props.move}
        userProfile={props.userProfile}
        moveList={props.moveList}
        moveTags={props.moveTags}
        buttons={[editMoveBtn]}
        className={props.className}
        videoLinksPanel={videoLinksPanel}
        tipsPanel={tipsPanel}
      />
    );
  }
}

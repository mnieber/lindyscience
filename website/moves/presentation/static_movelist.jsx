// @flow

import * as React from 'react'
import classnames from 'classnames';
import { makeSlugidMatcher, findMoveBySlugid } from 'moves/utils';
import {
  Menu, Item, Separator, Submenu, MenuProvider
} from 'react-contexify';
import {handleSelectionKeys, scrollIntoView} from 'app/utils'
import type { MoveT, VideoLinksByIdT } from 'moves/types'
import type { UUID, SlugidT } from 'app/types';


type OtherBvrT = {|
  setHighlightedMoveIdAndScroll: Function,
|};

function useOtherBehaviours(
  setHighlightedMoveId: Function,
): OtherBvrT {
  function setHighlightedMoveIdAndScroll(moveId: UUID) {
    setHighlightedMoveId(moveId);
    scrollIntoView(document.getElementById(moveId));
  }

  return {
    setHighlightedMoveIdAndScroll,
  }
}


type HandlersT = {|
  handleKeyDown: Function,
|};

function createHandlers(
  otherBvr: OtherBvrT,
  props: StaticMoveListPropsT,
): HandlersT {
  function handleKeyDown(e) {
    const highlightedMove = findMoveBySlugid(
      props.moves, props.highlightedMoveSlugid
    );
    handleSelectionKeys(
      e,
      "moveList",
      props.moves,
      highlightedMove.id,
      otherBvr.setHighlightedMoveIdAndScroll
    );
  }

  return {
    handleKeyDown,
  }
}


type StaticMoveListPropsT = {|
  moves: Array<MoveT>,
  videoLinksByMoveId: VideoLinksByIdT,
  highlightedMoveSlugid: SlugidT,
  setHighlightedMoveId: Function,
  className?: string,
  refs: any,
|};

export function StaticMoveList(props : StaticMoveListPropsT) {
  props.refs.moveListRef = React.useRef(null);

  const otherBvr = useOtherBehaviours(
    props.setHighlightedMoveId
  );
  const handlers = createHandlers(otherBvr, props);
  const slugidMatcher = makeSlugidMatcher(props.highlightedMoveSlugid);

  const moveNodes = props.moves.map((move, idx) => {
  const videoLinks = props.videoLinksByMoveId[move.id];
  const videoLinkDiv = (videoLinks && videoLinks.length)
    ? <a className='ml-2' href={videoLinks[0].url} target='blank'>VIDEO</a>
    : undefined;

  return (
    <div
      className = {classnames(
        {
          "moveList__item": true,
          "moveList__item--highlighted": slugidMatcher(move),
        }
      )}
      id={move.id}
      key={idx}
      onMouseDown={() => otherBvr.setHighlightedMoveIdAndScroll(move.id)}
    >
      {move.name}
      {videoLinkDiv}
    </div>
  )
  })

  // TODO: add menu
  return (
    <div
      className = {classnames(props.className, "moveList")}
      ref={props.refs.moveListRef}
      id="moveList"
      tabIndex={123}
      onKeyDown={handlers.handleKeyDown}
    >
      <MenuProvider id="moveContextMenu">
        {moveNodes}
      </MenuProvider>
    </div>
  );
}

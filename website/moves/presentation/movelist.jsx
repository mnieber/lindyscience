// @flow

import * as React from 'react'
import { useState } from 'react'
import type { MoveT, VideoLinksByIdT } from 'moves/types'
import type { UUID } from 'app/types';
import classnames from 'classnames';
import {handleSelectionKeys, scrollIntoView} from 'utils/utils'
import {
  Menu, Item, Separator, Submenu, MenuProvider
} from 'react-contexify';


// MoveList

type DraggingBvrT = {|
  draggingOverMoveId: UUID,
  isBefore: boolean,
  setDraggingOverMoveId: Function,
  dragSourceMoveId: UUID,
  setDragSourceMoveId: Function,
|};

function useDragging(): DraggingBvrT {
  const [[draggingOverMoveId: UUID, isBefore: boolean], setDraggingOverMoveId] = useState(["", false]);
  const [dragSourceMoveId: UUID, setDragSourceMoveId] = useState("");

  return {
    draggingOverMoveId,
    isBefore,
    setDraggingOverMoveId,
    dragSourceMoveId,
    setDragSourceMoveId,
  };
}

type OtherBvrT = {|
  setHighlightedMoveIdAndScroll: Function,
  trashHighlightedMove: Function,
|};

function useOtherBehaviours(
  setHighlightedMoveId: Function,
): OtherBvrT {
  function setHighlightedMoveIdAndScroll(id) {
    setHighlightedMoveId(id);
    scrollIntoView(document.getElementById(id));
  }

  async function trashHighlightedMove() {
    try {
      // TODO: determine neighbour move id, and go there afterwards
      // await trashMove(highlightedMoveId);
    }
    catch(e) {
      // TODO
    }
  }

  return {
    setHighlightedMoveIdAndScroll,
    trashHighlightedMove,
  }
}


type HandlersT = {|
  handleKeyDown: Function,
  handleDragStart: Function,
  handleDrop: Function,
  handleDragOver: Function,
|};

function createHandlers(
  draggingBvr: DraggingBvrT,
  otherBvr: OtherBvrT,
  props: MoveListPropsT,
): HandlersT {
  function handleKeyDown(e) {
    handleSelectionKeys(
      e,
      "moveList",
      props.moves,
      props.highlightedMoveId,
      otherBvr.setHighlightedMoveIdAndScroll
    );
  }

  function handleDragStart(sourceMoveId) {
    draggingBvr.setDragSourceMoveId(sourceMoveId);
  }

  function handleDrop(targetMoveId) {
    props.onDrop(draggingBvr.dragSourceMoveId, targetMoveId, draggingBvr.isBefore);
    draggingBvr.setDraggingOverMoveId([undefined, false]);
  }

  function handleDragOver(e, moveId) {
    e.preventDefault();
    const boundingRect = e.target.getBoundingClientRect();
    const height = boundingRect.bottom - boundingRect.top;
    const isBefore = (e.clientY - boundingRect.top) < 0.5 * height;
    draggingBvr.setDraggingOverMoveId([moveId, isBefore]);
  }

  return {
    handleKeyDown,
    handleDragStart,
    handleDrop,
    handleDragOver,
  }
}


type MoveListPropsT = {|
  moves: Array<MoveT>,
  videoLinksByMoveId: VideoLinksByIdT,
  highlightedMoveId: UUID,
  setHighlightedMoveId: Function,
  // trashMove: Function,
  onDrop: Function,
  className?: string,
  ref?: any,
|};

function _MoveList(props : MoveListPropsT) {
  const draggingBvr: DraggingBvrT = useDragging();
  const otherBvr: OtherBvrT = useOtherBehaviours(props.setHighlightedMoveId);
  const handlers = createHandlers(draggingBvr, otherBvr, props);

  const moveNodes = props.moves.map((move, idx) => {
    const videoLinks = props.videoLinksByMoveId[move.id];
    const videoLinkDiv = (videoLinks && videoLinks.length)
      ? <a className='ml-2' href={videoLinks[0].url} target='blank'>VIDEO</a>
      : undefined;

    // function _onContextMenu(e) {
    //   e.preventDefault();
    // }

    return (
      <div
        className = {classnames(
          {
            "moveList__item": true,
            "moveList__item--highlighted": (move.id == props.highlightedMoveId),
            "moveList__item--drag_before": (draggingBvr.isBefore && draggingBvr.draggingOverMoveId == move.id),
            "moveList__item--drag_after": (!draggingBvr.isBefore && draggingBvr.draggingOverMoveId == move.id),
          }
        )}
        id={move.id}
        key={idx}
        onMouseDown={() => otherBvr.setHighlightedMoveIdAndScroll(move.id)}
        // onContextMenu={_onContextMenu}
        draggable={true}
        onDragStart={e => handlers.handleDragStart(move.id)}
        onDragOver={e => handlers.handleDragOver(e, move.id)}
        onDrop={e => {handlers.handleDrop(move.id)}}
      >
        {move.name}
        {videoLinkDiv}
      </div>
    )
  })

  function _handleClick() {}

  return (
    <div
      className = {classnames(props.className, "moveList")}
      ref={props.ref}
      id="moveList"
      tabIndex={123}
      onKeyDown={handlers.handleKeyDown}
    >
      <MenuProvider id="moveContextMenu">
        {moveNodes}
      </MenuProvider>

      <Menu id="moveContextMenu">
        <Item onClick={otherBvr.trashHighlightedMove} >
          Trash
        </Item>
        <Submenu label="Foobar">
          <Item onClick={_handleClick}>Foo</Item>
          <Item onClick={_handleClick}>Bar</Item>
        </Submenu>
      </Menu>
    </div>
  );
}

// $FlowFixMe
export const MoveList = React.forwardRef((props, ref) => _MoveList({...props, ref}));

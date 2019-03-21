// @flow

import * as React from "react";
import classnames from "classnames";
import { Menu, Item, Separator, Submenu, MenuProvider } from "react-contexify";
import { handleSelectionKeys, scrollIntoView } from "app/utils";
import type { MoveT, VideoLinksByIdT } from "moves/types";
import type { UUID } from "app/types";

type OtherBvrT = {|
  setHighlightedMoveIdAndScroll: UUID => void,
|};

function useOtherBehaviours(setHighlightedMoveId: UUID => void): OtherBvrT {
  function setHighlightedMoveIdAndScroll(moveId: UUID) {
    setHighlightedMoveId(moveId);
    scrollIntoView(document.getElementById(moveId));
  }

  return {
    setHighlightedMoveIdAndScroll,
  };
}

type HandlersT = {|
  handleKeyDown: Function,
|};

function createHandlers(
  otherBvr: OtherBvrT,
  props: StaticMoveListPropsT
): HandlersT {
  function handleKeyDown(e) {
    if (props.highlightedMove) {
      e.target.id == "moveList" &&
        handleSelectionKeys(
          e,
          props.moves,
          props.highlightedMove.id,
          otherBvr.setHighlightedMoveIdAndScroll
        );
    }
  }

  return {
    handleKeyDown,
  };
}

type StaticMoveListPropsT = {|
  moves: Array<MoveT>,
  videoLinksByMoveId: VideoLinksByIdT,
  highlightedMove: ?MoveT,
  setHighlightedMoveId: Function,
  className?: string,
  refs: any,
|};

export function StaticMoveList(props: StaticMoveListPropsT) {
  props.refs.moveListRef = React.useRef(null);

  const otherBvr = useOtherBehaviours(props.setHighlightedMoveId);
  const handlers = createHandlers(otherBvr, props);
  const highlightedMoveId = props.highlightedMove
    ? props.highlightedMove.id
    : "";

  const moveNodes = props.moves.map((move, idx) => {
    const videoLinks = props.videoLinksByMoveId[move.id];
    const videoLinkDiv =
      videoLinks && videoLinks.length ? (
        <a className="ml-2" href={videoLinks[0].url} target="blank">
          VIDEO
        </a>
      ) : (
        undefined
      );

    return (
      <div
        className={classnames({
          moveList__item: true,
          "moveList__item--highlighted": move.id == highlightedMoveId,
        })}
        id={move.id}
        key={idx}
        onMouseDown={() => otherBvr.setHighlightedMoveIdAndScroll(move.id)}
      >
        {move.name}
        {videoLinkDiv}
      </div>
    );
  });

  // TODO: add menu
  return (
    <div
      className={classnames(props.className, "moveList")}
      ref={props.refs.moveListRef}
      id="moveList"
      tabIndex={123}
      onKeyDown={handlers.handleKeyDown}
    >
      <MenuProvider id="moveContextMenu">{moveNodes}</MenuProvider>
    </div>
  );
}

// @flow

import * as React from "react";
import { compose } from "redux";
import KeyboardEventHandler from "react-keyboard-event-handler";
import MovesCtr from "moves/containers/index";
import AppCtr, { browseToMove } from "app/containers/index";

import Widgets from "moves/presentation/index";

import {
  makeMoveListUrl,
  newMoveListSlug,
  createTagsAndKeywordsFilter,
} from "moves/utils";
import { pickNeighbour, scrollIntoView, getId } from "app/utils";

import { withMoveListFrameBvrs } from "moves/containers/with_move_list_frame_bvrs";
import { MoveCrudBvrsContext } from "moves/containers/move_crud_behaviours";
import { MoveListCrudBvrsContext } from "moves/containers/move_list_crud_behaviours";

import type {
  MoveListT,
  VideoLinksByIdT,
  MoveT,
  MoveCrudBvrsT,
  MoveListCrudBvrsT,
} from "moves/types";
import type { UUID, UserProfileT, TagT } from "app/types";
import type { NavigationBvrT } from "app/containers/navigation_bvr";
import type { SelectMovesBvrT } from "moves/containers/with_move_list_frame_bvrs";
import type { MoveClipboardBvrT } from "moves/containers/move_clipboard_behaviours";

// MoveListFrame

type MoveListFramePropsT = {
  userProfile: UserProfileT,
  videoLinksByMoveId: VideoLinksByIdT,
  navigationBvr: NavigationBvrT,
  moveCrudBvrs: MoveCrudBvrsT,
  moveListCrudBvrs: MoveListCrudBvrsT,
  selectMovesBvr: SelectMovesBvrT,
  moveClipboardBvr: MoveClipboardBvrT,
  moveTags: Array<TagT>,
  moveLists: Array<MoveListT>,
  moves: Array<MoveT>,
  highlightedMove: ?MoveT,
  moveList: ?MoveListT,
  children: any,
  // receive any actions as well
  ownerUsernamePrm: string,
  moveListSlugPrm: string,
};

function _MoveListFrame(props: MoveListFramePropsT) {
  const actions: any = props;
  const [isFilterEnabled, setIsFilterEnabled] = React.useState(true);

  const filterMoves = (tags, keywords) => {
    const _filter = createTagsAndKeywordsFilter(tags, keywords);
    const slugid = actions.actSetMoveFilter("tagsAndKeywords", _filter);
    if (props.moveList && slugid) {
      browseToMove([makeMoveListUrl(props.moveList), slugid]);
    }
  };

  const onKeyDown = (key, e) => {
    const edit_e = 69;
    if (key == "ctrl+e") {
      e.preventDefault();
      e.stopPropagation();
      if (props.moveCrudBvrs.isEditing) {
        props.moveCrudBvrs.saveMoveBvr.discardChanges();
      } else {
        props.moveCrudBvrs.setIsEditing(true);
      }
    }
    if (["ctrl+down", "ctrl+up"].includes(key)) {
      if (props.highlightedMove) {
        const selectMoveById = (moveId: UUID) => {
          scrollIntoView(document.getElementById(moveId));
          props.moveCrudBvrs.newMoveBvr.setHighlightedItemId(moveId);
        };
        pickNeighbour(
          props.moves,
          props.highlightedMove.id,
          key == "ctrl+down",
          selectMoveById
        );
      }
    }
  };

  const playMoves = () => {
    function playNextMove(moves: Array<MoveT>) {
      if (moves.length) {
        const move = moves.shift();
        // $FlowFixMe
        var utterance = new SpeechSynthesisUtterance(move.name);
        window.speechSynthesis.speak(utterance);
        setTimeout(() => playNextMove(moves), 12000);
      }
    }

    const moves = [...props.selectMovesBvr.selectedItems];
    playNextMove(moves);
  };

  return (
    <KeyboardEventHandler
      handleKeys={["ctrl+e", "ctrl+down", "ctrl+up"]}
      onKeyEvent={onKeyDown}
    >
      <Widgets.MoveListPanel
        userProfile={props.userProfile}
        moveList={props.moveList}
        moves={props.moves}
        playMoves={playMoves}
        moveCrudBvrs={props.moveCrudBvrs}
        moveLists={props.moveLists}
        moveListCrudBvrs={props.moveListCrudBvrs}
        moveClipboardBvr={props.moveClipboardBvr}
        selectMovesBvr={props.selectMovesBvr}
        moveTags={props.moveTags}
        videoLinksByMoveId={props.videoLinksByMoveId}
        highlightedMove={props.highlightedMove}
        filterMoves={filterMoves}
        isFilterEnabled={isFilterEnabled}
        setIsFilterEnabled={setIsFilterEnabled}
        selectMoveListById={
          props.moveListCrudBvrs.newMoveListBvr.setHighlightedItemId
        }
      >
        <MoveListCrudBvrsContext.Provider value={props.moveListCrudBvrs}>
          <MoveCrudBvrsContext.Provider value={props.moveCrudBvrs}>
            {props.children}
          </MoveCrudBvrsContext.Provider>
        </MoveListCrudBvrsContext.Provider>
      </Widgets.MoveListPanel>
    </KeyboardEventHandler>
  );
}

function MoveListFrame({ ownerUsernamePrm, moveListSlugPrm, ...props }) {
  const actions: any = props;
  React.useEffect(() => {
    if (
      props.userProfile &&
      moveListSlugPrm == newMoveListSlug &&
      !props.moveListCrudBvrs.newMoveListBvr.newItem
    ) {
      props.moveListCrudBvrs.newMoveListBvr.addNewItem();
    }
    actions.actSetSelectedMoveListUrl(ownerUsernamePrm, moveListSlugPrm);
  }, [!!props.userProfile, ownerUsernamePrm, moveListSlugPrm]);

  return <_MoveListFrame {...props} />;
}

// $FlowFixMe
MoveListFrame = compose(
  withMoveListFrameBvrs,
  MovesCtr.connect(
    state => ({
      userProfile: AppCtr.fromStore.getUserProfile(state),
      videoLinksByMoveId: MovesCtr.fromStore.getVideoLinksByMoveId(state),
      moves: MovesCtr.fromStore.getFilteredMovesInList(state),
      moveTags: MovesCtr.fromStore.getMoveTags(state),
      moveLists: MovesCtr.fromStore.getFilteredMoveLists(state),
      highlightedMove: MovesCtr.fromStore.getHighlightedMove(state),
      moveList: MovesCtr.fromStore.getSelectedMoveList(state),
    }),
    {
      ...AppCtr.actions,
      ...MovesCtr.actions,
    }
  )
)(MoveListFrame);

export default MoveListFrame;

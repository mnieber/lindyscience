// @flow

import * as React from "react";
import { compose } from "redux";
import KeyboardEventHandler from "react-keyboard-event-handler";
import Ctr from "screens/containers/index";

import Widgets from "screens/presentation/index";

import {
  makeMoveListUrl,
  newMoveListSlug,
  createTagsAndKeywordsFilter,
} from "screens/utils";
import {
  createErrorHandler,
  pickNeighbour,
  scrollIntoView,
  getId,
} from "app/utils";
import { withMoveListFrameBvrs } from "screens/hocs/with_move_list_frame_bvrs";
import { MoveCrudBvrsContext } from "screens/bvrs/move_crud_behaviours";
import { MoveListCrudBvrsContext } from "screens/bvrs/move_list_crud_behaviours";
import type { MoveListT } from "move_lists/types";
import type { MoveCrudBvrsT, MoveListCrudBvrsT } from "screens/types";
import type { MoveT, MoveByIdT } from "moves/types";
import type { UUID } from "kernel/types";
import type { UserProfileT } from "profiles/types";
import type { TagT } from "tags/types";
import type { SelectMovesBvrT } from "screens/hocs/with_move_list_frame_bvrs";
import type { MoveClipboardBvrT } from "screens/bvrs/move_clipboard_behaviours";
import type { DraggingBvrT } from "move_lists/bvrs/drag_behaviours";

// MoveListFrame

type MoveListFramePropsT = {
  userProfile: UserProfileT,
  moveById: MoveByIdT,
  moveCrudBvrs: MoveCrudBvrsT,
  moveListCrudBvrs: MoveListCrudBvrsT,
  selectMovesBvr: SelectMovesBvrT,
  moveClipboardBvr: MoveClipboardBvrT,
  draggingBvr: DraggingBvrT,
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
  const [isFilterEnabled, setIsFilterEnabled] = React.useState(false);

  const filterMoves = (tags, keywords) => {
    const _filter = createTagsAndKeywordsFilter(tags, keywords);
    const moveId = actions.actSetMoveFilter("tagsAndKeywords", _filter);
    if (moveId != getId(props.highlightedMove)) {
      props.moveCrudBvrs.setHighlightedMoveId(moveId);
    }
  };

  const onKeyDown = (key, e) => {
    if (key == "ctrl+space") {
      console.log("SPACE");
    }
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
          props.moveCrudBvrs.setHighlightedMoveId(moveId);
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

  const playMove = (move: MoveT) => {
    const maxLength = 200;
    // $FlowFixMe
    const utterance = new SpeechSynthesisUtterance(
      move.name.substr(0, maxLength)
    );
    return window.speechSynthesis.speak(utterance);
  };

  const _copyNamesToClipboard = () => {
    const text = props.selectMovesBvr.selectedItems
      .map(move => {
        return move.name;
      })
      .join("\n");
    navigator.clipboard.writeText(text);
  };

  const _copyLinksToClipboard = () => {
    const text = props.selectMovesBvr.selectedItems
      .map(move => {
        return (
          "http://www.lindyscience.org/app/lists/" +
          makeMoveListUrl(props.moveList) +
          "/" +
          move.slug
        );
      })
      .join("\n");
    navigator.clipboard.writeText(text);
  };

  const setIsFollowing = isFollowing => {
    if (!!props.userProfile && !!props.moveList) {
      const moveListId = props.moveList.id;
      const newMoveListIds = isFollowing
        ? actions.actInsertMoveListIds([moveListId], "")
        : actions.actRemoveMoveListIds([moveListId]);
      const term = isFollowing ? "follow" : "unfollow";
      Ctr.api
        .saveMoveListOrdering(newMoveListIds)
        .catch(createErrorHandler(`Could not ${term} the move list`));
    }
  };

  return (
    <KeyboardEventHandler
      handleKeys={["ctrl+e", "ctrl+down", "ctrl+up"]}
      onKeyEvent={onKeyDown}
    >
      <Widgets.MoveListPanel
        userProfile={props.userProfile}
        setIsFollowing={setIsFollowing}
        moveList={props.moveList}
        moves={props.moves}
        playMove={playMove}
        moveCrudBvrs={props.moveCrudBvrs}
        moveLists={props.moveLists}
        moveListCrudBvrs={props.moveListCrudBvrs}
        moveClipboardBvr={props.moveClipboardBvr}
        selectMovesBvr={props.selectMovesBvr}
        draggingBvr={props.draggingBvr}
        moveTags={props.moveTags}
        moveById={props.moveById}
        highlightedMove={props.highlightedMove}
        filterMoves={filterMoves}
        isFilterEnabled={isFilterEnabled}
        setIsFilterEnabled={setIsFilterEnabled}
        selectMoveListById={props.moveListCrudBvrs.setHighlightedMoveListId}
        copyNamesToClipboard={_copyNamesToClipboard}
        copyLinksToClipboard={_copyLinksToClipboard}
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
  Ctr.connect(
    state => ({
      userProfile: Ctr.fromStore.getUserProfile(state),
      moveById: Ctr.fromStore.getMoveById(state),
      moves: Ctr.fromStore.getFilteredMovesInList(state),
      moveTags: Ctr.fromStore.getMoveTags(state),
      moveLists: Ctr.fromStore.getFilteredMoveLists(state),
      highlightedMove: Ctr.fromStore.getHighlightedMove(state),
      moveList: Ctr.fromStore.getSelectedMoveList(state),
    }),
    Ctr.actions
  )
)(MoveListFrame);

export default MoveListFrame;

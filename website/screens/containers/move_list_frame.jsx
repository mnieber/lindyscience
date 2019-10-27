// @flow

import * as React from "react";
import { observer } from "mobx-react";
import { compose } from "redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVideo } from "@fortawesome/free-solid-svg-icons";

import { sayMove } from "screens/moves_container/handlers/say_move";
import { isNone } from "utils/utils";
import { getOwnerId, isOwner } from "app/utils";
import { MoveListFilter } from "move_lists/presentation/movelist_filter";
import { Addition } from "facets/generic/addition";
import { MovesContainer } from "screens/moves_container/moves_container";
import { withMovesCtr } from "screens/moves_container/moves_container_context";
import { withMoveListsCtr } from "screens/movelists_container/movelists_container_context";
import { SessionContainer } from "screens/session_container/session_container";
import { withMoveContextMenu } from "screens/hocs/with_move_context_menu";
import { MoveListsContainer } from "screens/movelists_container/movelists_container";
import Ctr from "screens/containers/index";
import Widgets from "screens/presentation/index";
import type { MoveListT } from "move_lists/types";
import type { MoveT } from "moves/types";
import type { TagT } from "tags/types";
import type { UserProfileT } from "profiles/types";

// MoveListFrame

type MoveListFramePropsT = {
  moveListsCtr: MoveListsContainer,
  movesCtr: MovesContainer,
  moveContextMenu: any,
  moveTags: Array<TagT>,
  userProfile: UserProfileT,
  children: any,
  dispatch: Function,
};

export function MoveListFrame(props: MoveListFramePropsT) {
  const selection = props.movesCtr.selection.items;
  const moveList = props.moveListsCtr.highlight.item;

  const isMoveListOwner =
    props.userProfile && isOwner(props.userProfile, getOwnerId(moveList));

  const moveListPlayerBtns = (
    <Widgets.MoveListPlayer moves={selection} sayMove={sayMove} className="" />
  );

  const isFollowing = ml =>
    !!props.userProfile && props.userProfile.moveListIds.includes(ml.id);

  const moveListPicker = (
    <Widgets.MoveListPicker
      key={moveList ? moveList.id : ""}
      className=""
      filter={isFollowing}
      moveListsCtr={props.moveListsCtr}
    />
  );

  const moveListHeaderBtns = (
    <Widgets.MoveListHeader
      addNewMove={() => {
        Addition.get(props.movesCtr).add({});
      }}
      className="ml-2"
    />
  );

  const moveListFilter = (
    <MoveListFilter
      className=""
      moveTags={props.moveTags}
      movesCtr={props.movesCtr}
    />
  );

  const createHostedPanels = move => {
    const icon = (
      <FontAwesomeIcon
        className={"ml-2 opacity-50"}
        style={{ marginBottom: "1px" }}
        icon={faVideo}
        size="xs"
      />
    );
    return isNone(move.link) || move.link == "" ? undefined : icon;
  };

  const moveListWidget = (
    <Widgets.MoveList
      className=""
      createHostedPanels={createHostedPanels}
      movesCtr={props.movesCtr}
      moveListsCtr={props.moveListsCtr}
      moveContextMenu={props.moveContextMenu}
      userProfile={props.userProfile}
    />
  );

  return (
    <div className="moveListPanel flexrow">
      <div className="moveListPanel__inner flexcol">
        {moveListPicker}
        {moveListFilter}
        <div className="flexrow w-full my-4">
          {moveListPlayerBtns}
          {isMoveListOwner && moveListHeaderBtns}
        </div>
        {moveListWidget}
      </div>
      <div className="movePanel pl-4 w-full">{props.children}</div>
    </div>
  );
}

// $FlowFixMe
MoveListFrame = compose(
  withMovesCtr,
  withMoveListsCtr,
  withMoveContextMenu,
  Ctr.connect(state => ({
    userProfile: Ctr.fromStore.getUserProfile(state),
    moveTags: Ctr.fromStore.getMoveTags(state),
  })),
  observer
)(MoveListFrame);

export default MoveListFrame;

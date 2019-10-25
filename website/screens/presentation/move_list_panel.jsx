// @flow

import * as React from "react";
import { compose } from "redux";
import { observer } from "mobx-react";

import type { UserProfileT } from "profiles/types";
import { isNone } from "utils/utils";
import { MovesContainer } from "screens/data_containers/moves_container";
import { MoveListsContainer } from "screens/data_containers/movelists_container";
import type { MoveT } from "moves/types";
import type { TagT } from "tags/types";
import { withMovesCtr } from "screens/data_containers/moves_container_context";
import { getId, getOwnerId, isOwner } from "app/utils";
import { MoveListFilter } from "move_lists/presentation/movelist_filter";
import { Highlight } from "screens/data_containers/bvrs/highlight";
import { Addition } from "screens/data_containers/bvrs/addition";
import Widgets from "screens/presentation/index";

///////////////////////////////////////////////////////////////////////
//
///////////////////////////////////////////////////////////////////////

type MoveContextMenuHOCPropsT = {
  movesCtr: MovesContainer,
  moveListsCtr: MoveListsContainer,
};

const withMoveContextMenu = (WrappedComponent: any) =>
  observer((props: MoveContextMenuHOCPropsT) => {
    const moveLists = props.moveListsCtr.data.display;
    const moveListId = Highlight.get(props.moveListsCtr).id;

    const targetMoveLists = props.movesCtr.clipboard.targetMoveLists;

    const targetMoveListsForMoving = moveLists.filter(
      x => moveListId != getId(x)
    );

    const moveContextMenu = (
      <Widgets.MoveContextMenu
        targetMoveLists={targetMoveLists || []}
        targetMoveListsForMoving={targetMoveListsForMoving}
        movesCtr={props.movesCtr}
      />
    );

    return <WrappedComponent moveContextMenu={moveContextMenu} {...props} />;
  });

///////////////////////////////////////////////////////////////////////
//
///////////////////////////////////////////////////////////////////////

export type MoveListPanelPropsT = {
  userProfile: ?UserProfileT,
  sayMove: MoveT => void,
  moveTags: Array<TagT>,
  moveContextMenu: any,
  children: any,
} & MoveContextMenuHOCPropsT;

function MoveListPanel_(props: MoveListPanelPropsT) {
  const selection = props.movesCtr.selection.items;
  const moveList = props.moveListsCtr.highlight.item;
  const userProfile = props.userProfile;

  const isMoveListOwner =
    userProfile && isOwner(userProfile, getOwnerId(moveList));

  const moveListPlayerBtns = (
    <Widgets.MoveListPlayer
      moves={selection}
      sayMove={props.sayMove}
      className=""
    />
  );

  const isFollowing = ml =>
    !!userProfile && userProfile.moveListIds.includes(ml.id);

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
    return isNone(move.link) || move.link == "" ? undefined : " (*)";
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

export const MoveListPanel = compose(
  withMovesCtr,
  withMoveContextMenu,
  observer
)(MoveListPanel_);

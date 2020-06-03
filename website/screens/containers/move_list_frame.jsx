// @flow

import * as React from "react";
import { observer } from "mobx-react";
import { compose } from "redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVideo } from "@fortawesome/free-solid-svg-icons";
import classnames from "classnames";
import CheeseburgerMenu from "cheeseburger-menu";
import { Selection } from "facet-mobx/facets/selection";

import { AccountMenu } from "app/presentation/accountmenu";
import { Display } from "screens/session_container/facets/display";
import { Navigation } from "screens/session_container/facets/navigation";
import { Filtering } from "facet-mobx/facets/filtering";
import type { UserProfileT } from "profiles/types";
import { mergeDefaultProps, withDefaultProps } from "mergeDefaultProps";
import { sayMove } from "screens/moves_container/handlers/say_move";
import { isNone } from "utils/utils";
import { MoveListFilter } from "move_lists/presentation/movelist_filter";
import { Addition } from "facet-mobx/facets/addition";
import { withMoveContextMenu } from "screens/hocs/with_move_context_menu";
import Ctr from "screens/containers/index";
import Widgets from "screens/presentation/index";
import type { MoveListT } from "move_lists/types";
import type { MoveT } from "moves/types";
import type { TagT } from "tags/types";

// MoveListFrame

type PropsT = {
  moveContextMenu: any,
  moveTags: Array<TagT>,
  children: any,
  dispatch: Function,
  defaultProps: any,
};

type DefaultPropsT = {
  // default props
  isOwner: any => boolean,
  moveList: ?MoveListT,
  movesSelection: Selection,
  userProfile: ?UserProfileT,
  movesFiltering: Filtering,
  movesAddition: Addition,
  navigation: Navigation,
  display: Display,
};

const _MoveListFrame = (p: PropsT) => {
  const props = mergeDefaultProps<PropsT & DefaultPropsT>(p);

  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const moveListPlayerBtns = (
    <Widgets.MoveListPlayer
      moves={props.movesSelection.items}
      sayMove={sayMove}
      className=""
    />
  );

  const isFollowing = ml =>
    !!props.userProfile && props.userProfile.moveListIds.includes(ml.id);

  const moveListPicker = (
    <Widgets.MoveListPicker
      key={props.moveList ? props.moveList.id : ""}
      className=""
      filter={isFollowing}
      navigateTo={x => props.navigation.navigateToMoveList(x)}
      defaultProps={props.defaultProps}
    />
  );

  const moveListHeaderBtns = (
    <Widgets.MoveListHeader
      addNewMove={() => {
        props.movesAddition.add({});
      }}
      className="ml-2"
    />
  );

  const moveListFilter = (
    <MoveListFilter
      className=""
      moveTags={props.moveTags}
      movesFiltering={props.movesFiltering}
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
      moveContextMenu={props.moveContextMenu}
      navigateTo={x => props.navigation.navigateToMove(x)}
      defaultProps={props.defaultProps}
    />
  );

  const accountMenu = (
    <div className="pt-4 pb-8 mx-auto">
      <AccountMenu defaultProps={props.defaultProps} />
    </div>
  );

  const contents = (
    <div
      className={classnames("moveListPanel__inner flexcol", {
        "moveListPanel__inner--expanded": true,
      })}
    >
      {props.display.small && accountMenu}
      {moveListPicker}
      {moveListFilter}
      <div className="flexrow w-full my-4">
        {moveListPlayerBtns}
        {props.moveList && props.isOwner(props.moveList) && moveListHeaderBtns}
      </div>
      {moveListWidget}
    </div>
  );

  const shrunkContents = (
    <CheeseburgerMenu
      // width="20rem"
      width={320}
      isOpen={isMenuOpen}
      closeCallback={() => setIsMenuOpen(false)}
    >
      {contents}
    </CheeseburgerMenu>
  );

  const ribbon = (
    <div
      className="moveListPanel__ribbon"
      onClick={() => {
        setIsMenuOpen(true);
      }}
    />
  );
  return (
    <div className="moveListPanel flexrow">
      {props.display.small ? shrunkContents : contents}
      {props.display.small && !isMenuOpen && ribbon}
      <div
        className={classnames("movePanel flex-auto", {
          "pl-4": !props.display.small,
          "pl-1": props.display.small,
        })}
      >
        {props.children}
      </div>
    </div>
  );
};

// $FlowFixMe
export const MoveListFrame = compose(
  withMoveContextMenu,
  Ctr.connect(state => ({
    moveTags: Ctr.fromStore.getMoveTags(state),
  })),
  withDefaultProps,
  observer
)(_MoveListFrame);

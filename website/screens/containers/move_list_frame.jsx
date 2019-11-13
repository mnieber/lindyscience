// @flow

import * as React from "react";
import { observer } from "mobx-react";
import { compose } from "redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVideo } from "@fortawesome/free-solid-svg-icons";
import classnames from "classnames";
import ReactResizeDetector from "react-resize-detector";

import { MoveListsContainer } from "screens/movelists_container/movelists_container";
import { Navigation } from "screens/session_container/facets/navigation";
import { Filtering } from "facet-mobx/facets/filtering";
import type { UserProfileT } from "profiles/types";
import { mergeDefaultProps, withDefaultProps } from "screens/default_props";
import { sayMove } from "screens/moves_container/handlers/say_move";
import { isNone } from "utils/utils";
import { MoveListFilter } from "move_lists/presentation/movelist_filter";
import { Addition } from "facet-mobx/facets/addition";
import { MovesContainer } from "screens/moves_container/moves_container";
import { SessionContainer } from "screens/session_container/session_container";
import { withMoveContextMenu } from "screens/hocs/with_move_context_menu";
import Ctr from "screens/containers/index";
import Widgets from "screens/presentation/index";
import type { MoveListT } from "move_lists/types";
import type { MoveT } from "moves/types";
import type { TagT } from "tags/types";

// MoveListFrame

type MoveListFramePropsT = {
  moveContextMenu: any,
  moveTags: Array<TagT>,
  children: any,
  dispatch: Function,
  defaultProps: any,
} & {
  // default props
  isOwner: any => boolean,
  moveList: ?MoveListT,
  movesSelection: Array<MoveT>,
  userProfile: ?UserProfileT,
  movesFiltering: Filtering,
  movesAddition: Addition,
  navigation: Navigation,
};

const _MoveListFrame = (p: MoveListFramePropsT) => {
  const panelRef = React.useRef(null);
  const [isMenuCollapsed, setIsMenuCollapsed] = React.useState(false);

  const props = mergeDefaultProps(p);

  const moveListPlayerBtns = (
    <Widgets.MoveListPlayer
      moves={props.movesSelection}
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

  React.useEffect(() => {
    if (panelRef.current) {
      debugger;
      panelRef.current.addEventListener("resize", e => {});
    }
  }, [panelRef.current]);

  const onResize = x => {
    setIsMenuCollapsed(x < 600);
  };

  return (
    <div className="moveListPanel flexrow">
      <ReactResizeDetector handleWidth onResize={onResize} />
      <div
        className={classnames("moveListPanel__inner flexcol", {
          "moveListPanel__inner--expanded": !isMenuCollapsed,
          "moveListPanel__inner--collapsed": isMenuCollapsed,
        })}
      >
        {moveListPicker}
        {moveListFilter}
        <div className="flexrow w-full my-4">
          {moveListPlayerBtns}
          {props.moveList &&
            props.isOwner(props.moveList) &&
            moveListHeaderBtns}
        </div>
        {moveListWidget}
      </div>
      <div className="movePanel pl-4 w-full">{props.children}</div>
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

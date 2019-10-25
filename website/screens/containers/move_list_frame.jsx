// @flow

import * as React from "react";
import { compose } from "redux";
import { useHistory, useParams } from "utils/react_router_dom_wrapper";
import KeyboardEventHandler from "react-keyboard-event-handler";

import { sayMove } from "screens/data_containers/handlers/say_move";
import { Selection } from "screens/data_containers/bvrs/selection";
import { movesContainerProps } from "screens/data_containers/moves_container_props";
import { MoveListsContainerContext } from "screens/data_containers/movelists_container_context";
import { listen } from "screens/data_containers/utils";
import { actSetSelectedMoveListUrl } from "screens/actions";
import { MovesContainerContext } from "screens/data_containers/moves_container_context";
import { MovesContainer } from "screens/data_containers/moves_container";
import {
  browseToMove,
  browseToMoveList,
} from "screens/data_containers/update_url";
import { MoveListsContainer } from "screens/data_containers/movelists_container";
import { MoveListPanel } from "screens/presentation/move_list_panel";
import { moveListsContainerProps } from "screens/data_containers/movelists_container_props";
import Ctr from "screens/containers/index";
import type { MoveListT } from "move_lists/types";
import type { MoveT } from "moves/types";
import type { TagT } from "tags/types";
import type { UserProfileT } from "profiles/types";

function useMovesCtr(dispatch: Function, history: any) {
  const [movesCtr, setMovesCtr] = React.useState(() => {
    return new MovesContainer(movesContainerProps(dispatch, history));
  });
  return movesCtr;
}

function useMoveListsCtr(dispatch: Function, history: any) {
  const [moveListsCtr, setMoveListsCtr] = React.useState(() => {
    return new MoveListsContainer(moveListsContainerProps(dispatch, history));
  });
  return moveListsCtr;
}

// MoveListFrame

type MoveListFramePropsT = {
  userProfile: UserProfileT,
  inputMoveTags: Array<TagT>,
  inputMoveLists: Array<MoveListT>,
  inputMoves: Array<MoveT>,
  moveListUrl: string,
  moveListNotFound: any,
  children: any,
  dispatch: Function,
};

export function MoveListFrame(props: MoveListFramePropsT) {
  const history = useHistory();
  const params = useParams();
  const [moveList, setMoveList] = React.useState(undefined);
  const [blackboard, setBlackboard] = React.useState({
    ignoreHighlightChanges: false,
  });

  const moveListsCtr = useMoveListsCtr(props.dispatch, history);
  moveListsCtr.setInputs(props.inputMoveLists, props.userProfile);

  const moveListMatchingUrl = props.inputMoveLists.find(
    moveList =>
      moveList.ownerUsername == params.ownerUsername &&
      moveList.slug == params.moveListSlug
  );

  React.useEffect(() => {
    if (moveListMatchingUrl) {
      blackboard.ignoreHighlightChanges = true;
      Selection.get(moveListsCtr).selectItem({
        itemId: moveListMatchingUrl.id,
        isShift: false,
        isCtrl: false,
      });
      blackboard.ignoreHighlightChanges = false;
      setMoveList(moveListsCtr.highlight.item);
    }
  }, [moveListMatchingUrl]);

  React.useEffect(() => {
    props.dispatch(
      actSetSelectedMoveListUrl(params.ownerUsername, params.moveListSlug)
    );
  }, [params.ownerUsername, params.moveListSlug]);

  const movesCtr = useMovesCtr(props.dispatch, history);

  movesCtr.setInputs(
    props.inputMoves,
    moveList,
    props.inputMoveLists,
    props.userProfile
  );

  React.useEffect(() => {
    listen(moveListsCtr.highlight, "highlightItem", id => {
      if (moveListsCtr.highlight.item && !blackboard.ignoreHighlightChanges) {
        browseToMoveList(history, moveListsCtr.highlight.item);
      }
    });
    listen(movesCtr.highlight, "highlightItem", id => {
      if (movesCtr.highlight.item) {
        browseToMove(
          history,
          moveListsCtr.highlight.item,
          movesCtr.data.preview,
          movesCtr.highlight.item
        );
      }
    });
  }, []);

  const notFoundDiv = <div>Oops, I cannot find this move list</div>;
  const loadingDiv = <div>Loading move list, please wait...</div>;

  return (
    <MoveListsContainerContext.Provider value={moveListsCtr}>
      <MovesContainerContext.Provider value={movesCtr}>
        <MoveListPanel
          userProfile={props.userProfile}
          sayMove={sayMove}
          moveTags={props.inputMoveTags}
          movesCtr={movesCtr}
          moveListsCtr={moveListsCtr}
        >
          {moveList && props.children}
          {!moveList &&
            props.moveListNotFound[props.moveListUrl] &&
            notFoundDiv}
          {!moveList &&
            !props.moveListNotFound[props.moveListUrl] &&
            loadingDiv}
        </MoveListPanel>
      </MovesContainerContext.Provider>
    </MoveListsContainerContext.Provider>
  );
}

// $FlowFixMe
MoveListFrame = compose(
  Ctr.connect(state => ({
    userProfile: Ctr.fromStore.getUserProfile(state),
    inputMoves: Ctr.fromStore.getMovesInList(state),
    inputMoveTags: Ctr.fromStore.getMoveTags(state),
    inputMoveLists: Ctr.fromStore.getMoveLists(state),
    moveListUrl: Ctr.fromStore.getSelectedMoveListUrl(state),
    moveListNotFound: Ctr.fromStore.getMoveListNotFound(state),
  }))
)(MoveListFrame);

export default MoveListFrame;

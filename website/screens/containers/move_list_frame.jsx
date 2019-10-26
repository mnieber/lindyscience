// @flow

import * as React from "react";
import { compose } from "redux";

import { SessionContainer } from "screens/session_container/session_container";
import { withSessionCtr } from "screens/session_container/session_container_context";
import { useHistory, useParams } from "utils/react_router_dom_wrapper";
import { sayMove } from "screens/moves_container/handlers/say_move";
import { Selection } from "facets/generic/selection";
import { movesContainerProps } from "screens/moves_container/moves_container_props";
import { MoveListsContainerContext } from "screens/movelists_container/movelists_container_context";
import { listen } from "facets/index";
import { actSetSelectedMoveListUrl } from "screens/actions";
import { MovesContainerContext } from "screens/moves_container/moves_container_context";
import { MovesContainer } from "screens/moves_container/moves_container";
import {
  browseToMove,
  browseToMoveList,
} from "screens/session_container/handlers/update_url";
import { MoveListsContainer } from "screens/movelists_container/movelists_container";
import { MoveListPanel } from "screens/presentation/move_list_panel";
import { moveListsContainerProps } from "screens/movelists_container/movelists_container_props";
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
  sessionCtr: SessionContainer,
  userProfile: UserProfileT,
  inputMoveTags: Array<TagT>,
  inputMoveLists: Array<MoveListT>,
  inputMoves: Array<MoveT>,
  moveListUrl: string,
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

  // TODO: move to sessionCtr
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
  const isMoveListNotFound = props.sessionCtr.data.notFoundMoveListUrls.includes(
    props.moveListUrl
  );

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
          {!moveList && isMoveListNotFound && notFoundDiv}
          {!moveList && !isMoveListNotFound && loadingDiv}
        </MoveListPanel>
      </MovesContainerContext.Provider>
    </MoveListsContainerContext.Provider>
  );
}

// $FlowFixMe
MoveListFrame = compose(
  withSessionCtr,
  Ctr.connect(state => ({
    userProfile: Ctr.fromStore.getUserProfile(state),
    inputMoves: Ctr.fromStore.getMovesInList(state),
    inputMoveTags: Ctr.fromStore.getMoveTags(state),
    inputMoveLists: Ctr.fromStore.getMoveLists(state),
    moveListUrl: Ctr.fromStore.getSelectedMoveListUrl(state),
  }))
)(MoveListFrame);

export default MoveListFrame;

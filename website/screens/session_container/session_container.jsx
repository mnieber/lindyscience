// @flow

import type { MoveByIdT, MoveT } from "moves/types";
import {
  Navigation,
  initNavigation,
} from "screens/session_container/facets/navigation";
import { Highlight } from "facets/generic/highlight";
import type { MoveListT } from "move_lists/types";
import { reaction, runInAction } from "utils/mobx_wrapper";
import { MovesContainer } from "screens/moves_container/moves_container";
import { MoveListsContainer } from "screens/movelists_container/movelists_container";
import {
  Profiling,
  initProfiling,
} from "screens/session_container/facets/profiling";
import { Loading, initLoading } from "screens/session_container/facets/loading";
import type { UserProfileT } from "profiles/types";
import {
  SessionData,
  initSessionData,
} from "screens/session_container/facets/session_data";
import { behaviour } from "facets/index";
import { Policies } from "screens/session_container/policies";

const updateMovesCtrInputs = (ctr: SessionContainer) => {
  reaction(
    () => ctr.data.inputMoves,
    (inputMoves: Array<MoveT>) => {
      const moveListsCtr = ctr.data.moveListsCtr;
      const moveList = Highlight.get(moveListsCtr).item;

      // TODO use relayData?
      ctr.data.movesCtr.setInputs(
        inputMoves,
        moveList,
        ctr.data.moveListsCtr.data.preview,
        ctr.profiling.userProfile
      );
    }
  );
};

type SessionContainerPropsT = {
  dispatch: Function,
  history: any,
  movesCtr: MovesContainer,
  moveListsCtr: MoveListsContainer,
};

export class SessionContainer {
  @behaviour(SessionData) data: SessionData;
  @behaviour(Loading) loading: Loading;
  @behaviour(Navigation) navigation: Navigation;
  @behaviour(Profiling) profiling: Profiling;

  _createFacets(props: SessionContainerPropsT) {
    this.data = initSessionData(
      new SessionData(),
      props.dispatch,
      props.movesCtr,
      props.moveListsCtr
    );
    this.loading = initLoading(new Loading());
    this.navigation = initNavigation(new Navigation(), props.history);
    this.profiling = initProfiling(new Profiling());
  }

  _applyPolicies(props: SessionContainerPropsT) {
    [
      Policies.navigation.handleNavigateToMove,
      Policies.navigation.handleNavigateToMoveList,
      Policies.navigation.selectTheMoveListThatMatchesTheUrl,
      Policies.navigation.selectTheMoveThatMatchesTheUrl,
      Policies.profiling.handleLoadEmail,
      Policies.profiling.handleLoadUserProfileForSignedInEmail,
      Policies.profiling.handleSignOut,
      Policies.url.handleLoadSelectedMoveListFromUrl,

      updateMovesCtrInputs,
    ].forEach(policy => policy(this));
  }

  constructor(props: SessionContainerPropsT) {
    this._createFacets(props);
    this._applyPolicies(props);
  }

  setInputs(
    userProfile: ?UserProfileT,
    moveLists: Array<MoveListT>,
    moveById: MoveByIdT
  ) {
    runInAction("sessionContainer.setInputs", () => {
      this.profiling.userProfile = userProfile;
    });
    this.data.moveListsCtr.setInputs(moveLists, userProfile);
    this.data.moveById = moveById;
  }
}

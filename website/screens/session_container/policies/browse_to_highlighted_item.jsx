// @flow

import { browseToMove } from "screens/session_container/handlers/update_url";
import type { MoveListT } from "move_lists/types";
import { action } from "utils/mobx_wrapper";
import type { MoveT } from "moves/types";
import { makeMoveListUrl, newMoveListSlug } from "screens/utils";
import { browseToMoveUrl } from "screens/containers";
import { Navigation } from "screens/session_container/facets/navigation";
import { SessionData } from "screens/session_container/facets/session_data";
import { Highlight } from "facets/generic/highlight";
import { MovesData } from "screens/moves_container/moves_data";
import { listen } from "facets/index";

export const handleNavigateToMoveList = (ctr: any) => {
  const navigation = Navigation.get(ctr);
  listen(
    navigation,
    "navigateToMoveList",
    action("navigateToMoveList", (moveList: MoveListT) => {
      const updateProfile = moveList.slug != newMoveListSlug;
      // We need this to prevent a stale value of
      // navigation.selectedMoveListUrl (in this function, we are
      // effectively setting a new value of navigation.selectedMoveListUrl)
      navigation.setUrlParams({
        ownerUsername: moveList.ownerUsername,
        moveListSlug: moveList.slug,
      });
      browseToMoveUrl(
        navigation.history,
        [makeMoveListUrl(moveList)],
        updateProfile
      );
    })
  );
};

export const handleNavigateToMove = (ctr: any) => {
  const navigation = Navigation.get(ctr);
  const data = SessionData.get(ctr);

  listen(
    navigation,
    "navigateToMove",
    action("navigateToMove", (move: MoveT) => {
      const moveList = Highlight.get(data.moveListsCtr).item;
      const movesData = MovesData.get(data.movesCtr);

      // We need this to prevent a stale value of
      // navigation.selectedMoveListUrl (in this function, we are
      // effectively setting a new value of navigation.selectedMoveListUrl)
      navigation.setUrlParams({
        ownerUsername: moveList.ownerUsername,
        moveListSlug: moveList.slug,
        moveSlug: move.slug,
        moveId: move.id,
      });
      browseToMove(navigation.history, moveList, movesData.preview, move);
    })
  );
};

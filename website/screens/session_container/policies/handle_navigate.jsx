// @flow

import { MoveListsContainer } from "screens/movelists_container/movelists_container";
import { MovesContainer } from "screens/moves_container/moves_container";
import {
  makeMoveListUrl,
  makeSlugidMatcher,
  newMoveListSlug,
} from "screens/utils";
import { getId } from "app/utils";
import type { MoveListT } from "move_lists/types";
import { action } from "utils/mobx_wrapper";
import type { MoveT } from "moves/types";
import { browseToMoveUrl } from "screens/containers";
import { Navigation } from "screens/session_container/facets/navigation";
import { Highlight } from "facets/generic/highlight";
import { Inputs } from "screens/moves_container/inputs";
import { listen } from "facets/index";

export const handleNavigateToMoveList = (ctr: any) => {
  const navigation = Navigation.get(ctr);
  listen(
    navigation,
    "navigateToMoveList",
    action("navigateToMoveList", (moveList: MoveListT) => {
      const updateProfile = moveList.slug != newMoveListSlug;
      // We need this to prevent a stale value of
      // navigation.moveListUrl (in this function, we are
      // effectively setting a new value of navigation.moveListUrl)
      navigation.setUrlParams({
        ownerUsername: moveList.ownerUsername,
        moveListSlug: moveList.slug,
      });
      browseToMoveUrl(
        navigation.history.push,
        [makeMoveListUrl(moveList)],
        updateProfile
      );
    })
  );
};

export const handleNavigateToMove = (ctr: any) => {
  const navigation = Navigation.get(ctr);
  const moveListsCtr = MoveListsContainer.get(ctr);
  const movesCtr = MovesContainer.get(ctr);

  listen(
    navigation,
    "navigateToMove",
    action("navigateToMove", (move: MoveT) => {
      const moveList = Highlight.get(moveListsCtr).item;
      const movesData = Inputs.get(movesCtr);

      // We need this to prevent a stale value of
      // navigation.moveListUrl (in this function, we are
      // effectively setting a new value of navigation.moveListUrl)
      navigation.setUrlParams({
        ownerUsername: moveList.ownerUsername,
        moveListSlug: moveList.slug,
        moveSlug: move.slug,
        moveId: move.id,
      });
      const isSlugUnique =
        movesData.preview.filter(makeSlugidMatcher(move.slug)).length <= 1;
      const maybeMoveId = isSlugUnique ? "" : getId(move);
      browseToMoveUrl(
        navigation.history.push,
        [makeMoveListUrl(moveList), move.slug, maybeMoveId],
        true
      );
    })
  );
};

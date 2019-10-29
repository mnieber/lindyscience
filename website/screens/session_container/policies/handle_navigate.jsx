// @flow

import { makeSlugid, makeSlugidMatcher, newMoveListSlug } from "screens/utils";
import { Outputs } from "screens/moves_container/facets/outputs";
import { MoveListsContainer } from "screens/movelists_container/movelists_container";
import { MovesContainer } from "screens/moves_container/moves_container";
import { getId } from "app/utils";
import type { MoveListT } from "move_lists/types";
import { action } from "utils/mobx_wrapper";
import type { MoveT } from "moves/types";
import { browseToMoveUrl } from "screens/containers";
import { Navigation } from "screens/session_container/facets/navigation";
import { Highlight } from "facet/facets/highlight";
import { listen } from "facet/index";

export const handleNavigateToMoveList = (ctr: any) => {
  const navigation = Navigation.get(ctr);
  listen(navigation, "navigateToMoveList", (moveList: MoveListT) => {
    const updateProfile = moveList.slug != newMoveListSlug;
    const moveListUrl = moveList.ownerUsername + "/" + moveList.slug;

    // We need this to prevent a stale value of
    // navigation.moveListUrl (in this function, we are
    // effectively setting a new value of navigation.moveListUrl)
    navigation.requestData({
      moveListUrl,
    });

    browseToMoveUrl(navigation.history.push, [moveListUrl], updateProfile);
  });
};

export const handleNavigateToMove = (ctr: any) => {
  const navigation = Navigation.get(ctr);
  const movesCtr = MovesContainer.get(ctr);
  const moveListsCtr = MoveListsContainer.get(ctr);

  listen(navigation, "navigateToMove", (move: MoveT) => {
    const moveList = Highlight.get(moveListsCtr).item;
    const outputs = Outputs.get(movesCtr);
    const moveSlugid = makeSlugid(move.slug, move.id);
    const moveListUrl = moveList.ownerUsername + "/" + moveList.slug;

    // We need this to prevent a stale value of
    // navigation.moveListUrl (in this function, we are
    // effectively setting a new value of navigation.moveListUrl)
    navigation.requestData({
      moveSlugid,
      moveListUrl,
    });

    const isSlugUnique =
      outputs.preview.filter(makeSlugidMatcher(move.slug)).length <= 1;
    const maybeMoveId = isSlugUnique ? "" : getId(move);
    browseToMoveUrl(
      navigation.history.push,
      [moveListUrl, move.slug, maybeMoveId],
      true
    );
  });
};

// @flow

import { makeSlugid, makeSlugidMatcher } from "screens/utils";
import { Inputs } from "screens/moves_container/facets/inputs";
import { Outputs } from "screens/moves_container/facets/outputs";
import { MovesContainer } from "screens/moves_container/moves_container";
import { getId } from "app/utils";
import { browseToMoveUrl } from "screens/containers";
import { Navigation } from "screens/session_container/facets/navigation";
import { listen } from "facet";
import type { MoveT } from "moves/types";

export const handleNavigateToMove = (navigation: Navigation) => (
  movesCtr: MovesContainer
) => {
  listen(navigation, "navigateToMove", (move: MoveT) => {
    const moveList = Inputs.get(movesCtr).moveList;
    const outputs = Outputs.get(movesCtr);
    const moveSlugid = makeSlugid(move.slug, move.id);
    const moveListUrl = moveList
      ? moveList.ownerUsername + "/" + moveList.slug
      : "";

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

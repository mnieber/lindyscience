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

export const handleBrowseToMoveList = (ctr: any) => {
  const navigation = Navigation.get(ctr);
  listen(
    navigation,
    "browseToMoveList",
    action("browseToMoveList", (moveList: MoveListT) => {
      const updateProfile = moveList.slug != newMoveListSlug;
      browseToMoveUrl(
        navigation.history,
        [makeMoveListUrl(moveList)],
        updateProfile
      );
    })
  );
};

export const handleBrowseToMove = (ctr: any) => {
  const navigation = Navigation.get(ctr);
  const data = SessionData.get(ctr);

  listen(
    navigation,
    "browseToMove",
    action("browseToMove", (move: MoveT) => {
      const moveList = Highlight.get(data.moveListsCtr).item;
      const movesData = MovesData.get(data.movesCtr);
      browseToMove(navigation.history, moveList, movesData.preview, move);
    })
  );
};

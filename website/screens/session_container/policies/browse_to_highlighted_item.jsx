// @flow

import { Navigation } from "screens/session_container/facets/navigation";
import { SessionData } from "screens/session_container/facets/session_data";
import { Highlight } from "facets/generic/highlight";
import { MovesData } from "screens/moves_container/moves_data";
import { listen } from "facets/index";
import {
  browseToMove,
  browseToMoveList,
} from "screens/session_container/handlers/update_url";

export const browseToHighlightedItem = (ctr: any) => {
  const navigation = Navigation.get(ctr);
  const data = SessionData.get(ctr);
  const moveListHighlight = Highlight.get(data.moveListsCtr);
  const moveHighlight = Highlight.get(data.movesCtr);
  const movesData = MovesData.get(data.movesCtr);

  listen(moveListHighlight, "highlightItem", id => {
    if (moveListHighlight.item && !navigation.ignoreHighlightChanges) {
      browseToMoveList(history, moveListHighlight.item);
    }
  });
  listen(moveHighlight, "highlightItem", id => {
    if (moveHighlight.item) {
      browseToMove(
        history,
        moveListHighlight.item,
        movesData.preview,
        moveHighlight.item
      );
    }
  });
};

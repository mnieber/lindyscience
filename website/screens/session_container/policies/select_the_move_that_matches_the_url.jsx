// @flow

import { listen } from "facet";
import { Addition } from "facet-mobx/facets/addition";
import { SessionContainer } from "screens/session_container/session_container";
import { Selection } from "facet-mobx/facets/selection";
import { findMoveBySlugid } from "screens/utils";
import { Outputs } from "screens/moves_container/facets/outputs";
import { MovesContainer } from "screens/moves_container/moves_container";
import { reaction } from "facet-mobx";
import {
  Navigation,
  ensureSelected,
} from "screens/session_container/facets/navigation";

export const syncMoveWithCurrentUrl = (ctr: SessionContainer) => {
  const navigation = Navigation.get(ctr);
  const movesCtr = MovesContainer.get(ctr);

  reaction(
    () => {
      const addition = Addition.get(movesCtr);
      const outputs = Outputs.get(movesCtr);
      return navigation.dataRequest.moveSlugid && !addition.item
        ? findMoveBySlugid(outputs.preview, navigation.dataRequest.moveSlugid)
        : undefined;
    },
    moveMatchingUrl => {
      if (moveMatchingUrl) {
        ensureSelected(Selection.get(movesCtr), moveMatchingUrl.id);
      }
    },
    {
      name: "syncMoveWithCurrentUrl",
    }
  );
};

export const syncUrlWithNewMove = (ctr: SessionContainer) => {
  const navigation = Navigation.get(ctr);
  const movesCtr = MovesContainer.get(ctr);
  const addition = Addition.get(movesCtr);

  listen(addition, "add", () => {
    if (addition.item) {
      navigation.navigateToMove(addition.item);
    }
  });
};

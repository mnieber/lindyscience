// @flow

import { Selection } from "facet/facets/selection";
import { findMoveBySlugid } from "screens/utils";
import { Outputs } from "screens/moves_container/facets/outputs";
import { MovesContainer } from "screens/moves_container/moves_container";
import { reaction } from "utils/mobx_wrapper";
import {
  Navigation,
  ensureSelected,
} from "screens/session_container/facets/navigation";

export const selectTheMoveThatMatchesTheUrl = (ctr: any) => {
  const navigation = Navigation.get(ctr);
  const movesCtr = MovesContainer.get(ctr);

  reaction(
    () => {
      const outputs = Outputs.get(movesCtr);
      return navigation.dataRequest.moveSlugid
        ? findMoveBySlugid(outputs.preview, navigation.dataRequest.moveSlugid)
        : undefined;
    },
    moveMatchingUrl => {
      if (moveMatchingUrl) {
        ensureSelected(Selection.get(movesCtr), moveMatchingUrl.id);
      }
    },
    {
      name: "selectTheMoveThatMatchesTheUrl",
    }
  );
};

// @flow

import { ensureSelected } from "screens/session_container/policies/select_the_movelist_that_matches_the_url";
import { Outputs } from "screens/moves_container/facets/outputs";
import { MovesContainer } from "screens/moves_container/moves_container";
import { reaction } from "utils/mobx_wrapper";
import { Navigation } from "screens/session_container/facets/navigation";
import { findMoveBySlugid, makeSlugid } from "screens/utils";
import { Selection } from "facets/generic/selection";

export const selectTheMoveThatMatchesTheUrl = (ctr: any) => {
  const navigation = Navigation.get(ctr);
  const movesCtr = MovesContainer.get(ctr);

  reaction(
    () => {
      const outputs = Outputs.get(movesCtr);
      const slugId =
        navigation.urlParams && navigation.urlParams.moveSlug
          ? makeSlugid(
              navigation.urlParams.moveSlug,
              navigation.urlParams.moveId
            )
          : undefined;
      return slugId ? findMoveBySlugid(outputs.preview, slugId) : undefined;
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

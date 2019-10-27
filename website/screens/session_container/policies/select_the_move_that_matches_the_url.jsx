// @flow

import { reaction } from "utils/mobx_wrapper";
import { MovesData } from "screens/moves_container/moves_data";
import { Navigation } from "screens/session_container/facets/navigation";
import { SessionData } from "screens/session_container/facets/session_data";
import { findMoveBySlugid, makeSlugid } from "screens/utils";
import { Selection } from "facets/generic/selection";

export const selectTheMoveThatMatchesTheUrl = (ctr: any) => {
  const navigation = Navigation.get(ctr);
  const data = SessionData.get(ctr);

  reaction(
    () => {
      const movesData = MovesData.get(data.movesCtr);
      const slugId =
        navigation.urlParams && navigation.urlParams.moveSlug
          ? makeSlugid(
              navigation.urlParams.moveSlug,
              navigation.urlParams.moveId
            )
          : undefined;
      const moveMatchingUrl = slugId
        ? findMoveBySlugid(movesData.preview, slugId)
        : undefined;
      return moveMatchingUrl;
    },
    moveMatchingUrl => {
      if (moveMatchingUrl) {
        const selection = Selection.get(data.movesCtr);
        selection.selectItem({
          itemId: moveMatchingUrl.id,
          isShift: false,
          isCtrl: false,
        });
      }
    },
    {
      name: "selectTheMoveThatMatchesTheUrl",
    }
  );
};

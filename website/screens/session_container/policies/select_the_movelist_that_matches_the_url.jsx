// @flow

import { compareIfNotNull, reaction } from "utils/mobx_wrapper";
import { Navigation } from "screens/session_container/facets/navigation";
import { SessionData } from "screens/session_container/facets/session_data";
import { MoveListsData } from "screens/movelists_container/movelists_data";
import { Selection } from "facets/generic/selection";

export const selectTheMoveListThatMatchesTheUrl = (ctr: any) => {
  const data = SessionData.get(ctr);
  const navigation = Navigation.get(ctr);

  reaction(
    () => {
      const moveListsData = MoveListsData.get(data.moveListsCtr);
      const moveListMatchingUrl = navigation.urlParams
        ? moveListsData.moveLists.find(
            moveList =>
              moveList.ownerUsername == navigation.urlParams.ownerUsername &&
              moveList.slug == navigation.urlParams.moveListSlug
          )
        : undefined;
      return moveListMatchingUrl || null;
    },
    moveListMatchingUrl => {
      const selection = Selection.get(data.moveListsCtr);
      navigation.ignoreHighlightChanges = true;
      selection.selectItem({
        itemId: moveListMatchingUrl.id,
        isShift: false,
        isCtrl: false,
      });
      navigation.ignoreHighlightChanges = false;
    },
    {
      name: "selectTheMoveListThatMatchesTheUrl",
      equals: compareIfNotNull,
    }
  );
};

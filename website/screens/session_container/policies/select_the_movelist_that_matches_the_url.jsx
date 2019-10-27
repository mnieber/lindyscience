// @flow

import { findMoveListByUrl } from "screens/utils";
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
      return navigation.moveListUrl
        ? findMoveListByUrl(moveListsData.preview, navigation.moveListUrl)
        : undefined;
    },
    moveListMatchingUrl => {
      if (moveListMatchingUrl) {
        const selection = Selection.get(data.moveListsCtr);
        if (!selection.ids.includes(moveListMatchingUrl.id)) {
          selection.selectItem({
            itemId: moveListMatchingUrl.id,
            isShift: false,
            isCtrl: false,
          });
        }
      }
    },
    {
      name: "selectTheMoveListThatMatchesTheUrl",
    }
  );
};

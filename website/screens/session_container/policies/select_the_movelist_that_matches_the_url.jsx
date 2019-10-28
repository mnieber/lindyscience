// @flow

import { Outputs } from "screens/movelists_container/facets/outputs";
import { reaction } from "utils/mobx_wrapper";
import { MoveListsContainer } from "screens/movelists_container/movelists_container";
import { findMoveListByUrl } from "screens/utils";
import { Navigation } from "screens/session_container/facets/navigation";
import { Selection } from "facets/generic/selection";

export const selectTheMoveListThatMatchesTheUrl = (ctr: any) => {
  const navigation = Navigation.get(ctr);
  const moveListsCtr = MoveListsContainer.get(ctr);

  reaction(
    () => {
      const outputs = Outputs.get(moveListsCtr);
      return navigation.moveListUrl
        ? findMoveListByUrl(outputs.preview, navigation.moveListUrl)
        : undefined;
    },
    moveListMatchingUrl => {
      if (moveListMatchingUrl) {
        const selection = Selection.get(moveListsCtr);
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

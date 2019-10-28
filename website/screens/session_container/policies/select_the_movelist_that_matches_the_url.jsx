// @flow

import { Selection } from "facets/generic/selection";
import { Outputs } from "screens/movelists_container/facets/outputs";
import { reaction } from "utils/mobx_wrapper";
import { MoveListsContainer } from "screens/movelists_container/movelists_container";
import { findMoveListByUrl } from "screens/utils";
import {
  Navigation,
  ensureSelected,
} from "screens/session_container/facets/navigation";

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
        ensureSelected(Selection.get(moveListsCtr), moveListMatchingUrl.id);
      }
    },
    {
      name: "selectTheMoveListThatMatchesTheUrl",
    }
  );
};

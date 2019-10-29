// @flow

import { Inputs } from "screens/session_container/facets/inputs";
import { Navigation } from "screens/session_container/facets/navigation";
import { reaction, action } from "utils/mobx_wrapper";
import { newMoveListSlug } from "screens/utils";
import { apiLoadMoveList } from "screens/api";
import { actAddMoves } from "moves/actions";
import { getObjectValues } from "utils/utils";
import { actAddMoveLists } from "move_lists/actions";
import { actAddTips } from "tips/actions";

export const handleLoadSelectedMoveListFromUrl = (ctr: any) => {
  const navigation = Navigation.get(ctr);
  const inputs = Inputs.get(ctr);

  reaction(
    () => navigation.dataRequest.moveListUrl,
    action("loadSelectedMoveListFromUrl", async selectedMoveListUrl => {
      if (
        !!selectedMoveListUrl &&
        !navigation.loadedData.moveListUrl.includes(selectedMoveListUrl)
      ) {
        const [ownerUsername, slug] = selectedMoveListUrl.split("/");

        if (slug != newMoveListSlug) {
          var moveList = undefined;
          try {
            moveList = await apiLoadMoveList(ownerUsername, slug);
          } catch {
            navigation.notFoundData.moveListUrl.push(selectedMoveListUrl);
          }

          if (moveList) {
            inputs.dispatch(
              actAddMoves(getObjectValues(moveList.entities.moves || {}))
            );
            inputs.dispatch(actAddMoveLists(moveList.entities.moveLists));
            inputs.dispatch(actAddTips(moveList.entities.tips || {}));
            navigation.loadedData.moveListUrl.push(selectedMoveListUrl);
          }
        }
      }
    }),
    { name: "handleLoadSelectedMoveListFromUrl" }
  );
};

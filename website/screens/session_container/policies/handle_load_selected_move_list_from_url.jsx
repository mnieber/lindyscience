// @flow

import { Inputs } from "screens/session_container/facets/inputs";
import { Loading } from "screens/session_container/facets/loading";
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
  const loading = Loading.get(ctr);
  const inputs = Inputs.get(ctr);

  reaction(
    () => navigation.target.moveListUrl,
    action("loadSelectedMoveListFromUrl", async selectedMoveListUrl => {
      if (
        !!selectedMoveListUrl &&
        !loading.loadedMoveListUrls.includes(selectedMoveListUrl)
      ) {
        const [ownerUsername, slug] = selectedMoveListUrl.split("/");

        if (slug != newMoveListSlug) {
          var moveList = undefined;
          try {
            moveList = await apiLoadMoveList(ownerUsername, slug);
          } catch {
            loading.notFoundMoveListUrls.push(selectedMoveListUrl);
          }

          if (moveList) {
            inputs.dispatch(
              actAddMoves(getObjectValues(moveList.entities.moves || {}))
            );
            inputs.dispatch(actAddMoveLists(moveList.entities.moveLists));
            inputs.dispatch(actAddTips(moveList.entities.tips || {}));
            loading.loadedMoveListUrls.push(selectedMoveListUrl);
          }
        }
      }
    }),
    { name: "handleLoadSelectedMoveListFromUrl" }
  );
};

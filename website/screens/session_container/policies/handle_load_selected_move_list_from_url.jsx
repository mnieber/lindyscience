// @flow

import { SessionData } from "screens/session_container/facets/session_data";
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
  const data = SessionData.get(ctr);

  reaction(
    () => navigation.selectedMoveListUrl,
    action(async selectedMoveListUrl => {
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
            data.dispatch(
              actAddMoves(getObjectValues(moveList.entities.moves || {}))
            );
            data.dispatch(actAddMoveLists(moveList.entities.moveLists));
            data.dispatch(actAddTips(moveList.entities.tips || {}));
            loading.loadedMoveListUrls.push(selectedMoveListUrl);
          }
        }
      }
    })
  );
};

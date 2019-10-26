// @flow

import { reaction, action } from "utils/mobx_wrapper";
import { newMoveListSlug } from "screens/utils";
import { apiLoadMoveList } from "screens/api";
import { actAddMoves } from "moves/actions";
import { getObjectValues } from "utils/utils";
import { actAddMoveLists } from "move_lists/actions";
import { actAddTips } from "tips/actions";

export const handleLoadSelectedMoveListFromUrl = (ctr: any) => {
  reaction(
    () => ctr.data.selectedMoveListUrl,
    action(async selectedMoveListUrl => {
      if (
        !!selectedMoveListUrl &&
        !ctr.data.loadedMoveListUrls.includes(selectedMoveListUrl)
      ) {
        const [ownerUsername, slug] = selectedMoveListUrl.split("/");

        if (slug != newMoveListSlug) {
          var moveList = undefined;
          try {
            moveList = await apiLoadMoveList(ownerUsername, slug);
          } catch {
            ctr.data.notFoundMoveListUrls.push(selectedMoveListUrl);
          }

          if (moveList) {
            ctr.data.dispatch(
              actAddMoves(getObjectValues(moveList.entities.moves || {}))
            );
            ctr.data.dispatch(actAddMoveLists(moveList.entities.moveLists));
            ctr.data.dispatch(actAddTips(moveList.entities.tips || {}));
            ctr.data.loadedMoveListUrls.push(selectedMoveListUrl);
          }
        }
      }
    })
  );
};

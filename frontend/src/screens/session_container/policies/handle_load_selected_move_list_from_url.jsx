// @flow

import { Data } from 'src/screens/session_container/facets/data';
import { action, reaction } from 'src/utils/mobx_wrapper';
import { Inputs } from 'src/screens/session_container/facets/inputs';
import { Navigation } from 'src/screens/session_container/facets/navigation';
import { newMoveListSlug } from 'src/screens/utils';
import { apiLoadMoveList } from 'src/screens/api';
import { getObjectValues } from 'src/utils/utils';

export const handleLoadSelectedMoveListFromUrl = (ctr: any) => {
  const navigation = Navigation.get(ctr);
  const inputs = Inputs.get(ctr);
  const data = Data.get(ctr);

  reaction(
    () => navigation.dataRequest.moveListUrl,
    action('loadSelectedMoveListFromUrl', async (selectedMoveListUrl) => {
      if (
        !!selectedMoveListUrl &&
        !navigation.loadedData.moveListUrl.includes(selectedMoveListUrl)
      ) {
        const [ownerUsername, slug] = selectedMoveListUrl.split('/');

        if (slug != newMoveListSlug) {
          var moveList = undefined;
          try {
            moveList = await apiLoadMoveList(ownerUsername, slug);
          } catch {
            navigation.notFoundData.moveListUrl.push(selectedMoveListUrl);
          }

          if (moveList) {
            data.movesStore.addMoves(
              getObjectValues(moveList.entities.moves || {})
            );
            data.moveListsStore.addMoveLists(moveList.entities.moveLists);
            data.tipsStore.addTips(moveList.entities.tips || {});
            navigation.loadedData.moveListUrl.push(selectedMoveListUrl);
          }
        }
      }
    }),
    { name: 'handleLoadSelectedMoveListFromUrl' }
  );
};

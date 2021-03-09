import { values } from 'lodash/fp';

import { SessionContainer } from 'src/session/SessionCtr';
import { loadRes } from 'src/utils/RST';
import { Navigation } from 'src/session/facets/Navigation';
import { action } from 'mobx';
import { declareReaction } from 'facility-mobx';
import { newMoveListSlug } from 'src/app/utils';
import { apiLoadMoveList } from 'src/search/api';

export const handleLoadSelectedMoveListFromUrl = (ctr: SessionContainer) => {
  const navigation = Navigation.get(ctr);

  declareReaction(
    ctr,
    () => navigation.dataRequest.moveListUrl,
    action('loadSelectedMoveListFromUrl', async (selectedMoveListUrl) => {
      if (!!selectedMoveListUrl) {
        const [ownerUsername, slug] = selectedMoveListUrl.split('/');

        if (slug !== newMoveListSlug) {
          loadRes(
            ctr.moveListsStore.moveListRSByUrl,
            selectedMoveListUrl,
            () => apiLoadMoveList(ownerUsername, slug),
            (response: any) => {
              ctr.movesStore.addMoves(values(response.entities.moves || {}));
              ctr.moveListsStore.addMoveLists(
                response.entities.moveLists ?? []
              );
              ctr.tipsStore.addTips(response.entities.tips || {});
            }
          );
        }
      }
    })
  );
};

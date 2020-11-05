import { values } from 'lodash/fp';

import { SessionContainer } from 'src/session/SessionCtr';
import { loadRes } from 'src/utils/RST';
import { Navigation } from 'src/session/facets/Navigation';
import { action, reaction } from 'src/utils/mobx_wrapper';
import { newMoveListSlug } from 'src/app/utils';
import { apiLoadMoveList } from 'src/search/api';

export const handleLoadSelectedMoveListFromUrl = (ctr: SessionContainer) => {
  const navigation = Navigation.get(ctr);

  reaction(
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

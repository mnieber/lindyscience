import { values } from 'lodash/fp';

import { loadRes } from 'src/utils/RST';
import { AppStore } from 'src/app/AppStore';
import { newMoveListSlug } from 'src/app/utils';
import { apiLoadMoveList } from 'src/search/api';

export const handleLoadSelectedMoveListFromUrl = (
  appStore: AppStore,
  moveListUrl?: string
) => {
  if (!!moveListUrl) {
    const [ownerUsername, slug] = moveListUrl.split('/');

    if (slug !== newMoveListSlug) {
      loadRes(
        appStore.moveListsStore.moveListRSByUrl,
        moveListUrl,
        () => apiLoadMoveList(ownerUsername, slug),
        (response: any) => {
          appStore.movesStore.addMoves(values(response.entities.moves || {}));
          appStore.moveListsStore.addMoveLists(
            response.entities.moveLists ?? []
          );
          appStore.tipsStore.addTips(response.entities.tips || {});
        }
      );
    }
  }
};

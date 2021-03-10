import { values } from 'lodash/fp';

import { DataRequestT } from 'src/session/NavigationStore';
import { loadRes } from 'src/utils/RST';
import { AppStore } from 'src/app/AppStore';
import { newMoveListSlug } from 'src/app/utils';
import { apiLoadMoveList } from 'src/search/api';

export const handleLoadSelectedMoveListFromUrl = (
  appStore: AppStore,
  dataRequest: DataRequestT
) => {
  const selectedMoveListUrl = appStore.navigationStore.dataRequest.moveListUrl;
  if (!!selectedMoveListUrl) {
    const [ownerUsername, slug] = selectedMoveListUrl.split('/');

    if (slug !== newMoveListSlug) {
      loadRes(
        appStore.moveListsStore.moveListRSByUrl,
        selectedMoveListUrl,
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

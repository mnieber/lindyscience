import { Data } from 'src/session/facets/Data';
import { Inputs } from 'src/move_lists/facets/Inputs';
import { Navigation } from 'src/session/facets/Navigation';
import { action, reaction } from 'src/utils/mobx_wrapper';
import { newMoveListSlug } from 'src/app/utils';
import { apiLoadMoveList } from 'src/search/api';
import { values } from 'lodash/fp';

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
            data.movesStore.addMoves(values(moveList.entities.moves || {}));
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

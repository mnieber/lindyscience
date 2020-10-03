import { Navigation } from 'src/session/facets/Navigation';
import { MoveListT } from 'src/move_lists/types';
import { newMoveListSlug } from 'src/app/utils';
import { browseToMoveUrl } from 'src/app/containers';
import { listen } from 'src/npm/facet';

export const handleNavigateToMoveList = (ctr: any) => {
  const navigation = Navigation.get(ctr);
  listen(navigation, 'navigateToMoveList', (moveList: MoveListT) => {
    const updateProfile = moveList.slug != newMoveListSlug;
    const moveListUrl = moveList.ownerUsername + '/' + moveList.slug;

    // We need this to prevent a stale value of
    // navigation.moveListUrl (in this function, we are
    // effectively setting a new value of navigation.moveListUrl)
    navigation.requestData({
      moveListUrl,
    });

    browseToMoveUrl(navigation.history.push, [moveListUrl], updateProfile);
  });
};

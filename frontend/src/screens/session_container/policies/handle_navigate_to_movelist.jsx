import { Navigation } from 'src/screens/session_container/facets/navigation';
import { listen } from 'src/facet';
import { newMoveListSlug } from 'src/screens/utils';
import { browseToMoveUrl } from 'src/screens/containers';
import type { MoveListT } from 'src/move_lists/types';

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

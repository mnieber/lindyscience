import { Navigation } from 'src/session/facets/Navigation';
import { MoveListT } from 'src/move_lists/types';
import { newMoveListSlug } from 'src/app/utils';
import { browseToMoveUrl } from 'src/app/containers';

export function handleNavigateToMoveList(
  facet: Navigation,
  moveList: MoveListT
) {
  const updateProfile = moveList.slug !== newMoveListSlug;
  const moveListUrl = moveList.ownerUsername + '/' + moveList.slug;

  browseToMoveUrl(facet.history.push, [moveListUrl], updateProfile);
}

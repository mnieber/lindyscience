import { Navigation } from 'src/session/facets/Navigation';
import { MoveListT } from 'src/move_lists/types';
import { newMoveListSlug } from 'src/app/utils';
import { browseToMoveUrl } from 'src/app/containers';

export function handleNavigateToMoveList(
  this: Navigation,
  moveList: MoveListT
) {
  const updateProfile = moveList.slug !== newMoveListSlug;
  const moveListUrl = moveList.ownerUsername + '/' + moveList.slug;

  browseToMoveUrl(this.history.push, [moveListUrl], updateProfile);
}

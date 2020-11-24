import { SessionContainer } from 'src/session/SessionCtr';
import { getId, makeSlugidMatcher } from 'src/app/utils';
import { MoveListT } from 'src/move_lists/types';
import { lookUp } from 'src/utils/utils';
import { Navigation } from 'src/session/facets/Navigation';
import { MoveT } from 'src/moves/types';
import { browseToMoveUrl } from 'src/app/containers';
import { getCtr } from 'facility';

export function handleNavigateToMove(
  this: Navigation,
  moveList: MoveListT,
  move: MoveT
) {
  const ctr = getCtr<SessionContainer>(this);
  const moves = lookUp(moveList.moves, ctr.movesStore.moveById);
  const moveListUrl = moveList.ownerUsername + '/' + moveList.slug;
  const isSlugUnique = moves.filter(makeSlugidMatcher(move.slug)).length <= 1;
  const maybeMoveId = isSlugUnique ? '' : getId(move);

  browseToMoveUrl(
    this.history.push,
    [moveListUrl, move.slug, maybeMoveId],
    true
  );
}

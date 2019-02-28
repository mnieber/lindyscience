import type { MoveT, MoveListT } from 'moves/types'
import type { UUID, SlugidT } from 'app/types';

export function makeSlugid(slug: string, id: UUID) {
  return slug + (id ? ('/' + id) : "")
}

export function makeMoveListUrl(moveList: MoveListT) {
  return moveList.ownerUsername + '/' + moveList.slug;
}

export function makeSlugidMatcher(slugid: SlugidT) {
  const parts = slugid.split('/');
  return move => (
    parts.length == 2
      ? move.id == parts[1]
      : move.slug == parts[0]
  );
}

export function findMoveBySlugid(moves: Array<MoveT>, slugid: string) {
  return moves.find(makeSlugidMatcher(slugid));
}
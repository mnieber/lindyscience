// @flow

import { slugify, splitIntoKeywords } from 'src/utils/utils';
import type { MoveT } from 'src/moves/types';
import type { MoveListT } from 'src/move_lists/types';
import type { TagT } from 'src/tags/types';
import type { ObjectT, SlugidT, UUID } from 'src/kernel/types';
import type { UserProfileT } from 'src/profiles/types';
import type { CutPointT } from 'src/video/types';

export function makeSlugid(slug: string, id: ?UUID) {
  return slug + (id ? '/' + id : '');
}

export function makeMoveListUrl(moveList: MoveListT) {
  return moveList.ownerUsername + '/' + moveList.slug;
}

export function makeSlugidMatcher(slugid: SlugidT) {
  const parts = slugid.split('/');
  return (move: MoveT) =>
    parts.length == 2 ? move.id == parts[1] : move.slug == parts[0];
}

export function makeIdMatcher(id: UUID) {
  return (obj: ObjectT) => obj.id == id;
}

export function findMoveBySlugid(moves: Array<MoveT>, slugid: string) {
  return moves.find(makeSlugidMatcher(slugid));
}

export function findMoveListByUrl(moveLists: Array<MoveListT>, url: string) {
  return moveLists.find((x) => makeMoveListUrl(x) == url);
}

export const newMoveListSlug = 'new-move-list';

export function findNeighbourIdx(
  filteredIds: Array<UUID>,
  allIds: Array<UUID>,
  beginIndex: number,
  endIndex: number,
  step: number
) {
  for (var idx = beginIndex; idx != endIndex; idx += step) {
    if (filteredIds.includes(allIds[idx])) {
      return { result: idx };
    }
  }
  return undefined;
}

export function createTagsAndKeywordsFilter(
  tags: Array<TagT>,
  keywords: Array<string>
) {
  function _filter(moves: Array<MoveT>) {
    function match(move) {
      const moveKeywords = splitIntoKeywords(move.name);
      return (
        (!tags.length || tags.every((tag) => move.tags.includes(tag))) &&
        (!keywords.length ||
          keywords.every((keyword) =>
            move.name.toLowerCase().includes(keyword.toLowerCase())
          ))
      );
    }

    // $FlowFixMe
    return tags.length || keywords.length ? moves.filter(match) : moves;
  }
  return _filter;
}

export function createMoveFromCutPoint(
  cutPoint: CutPointT,
  cutVideoLink: string,
  userProfile: UserProfileT,
  moveList: MoveListT
) {
  return {
    id: cutPoint.id,
    ownerId: userProfile.userId,
    ownerUsername: userProfile.username,
    name: cutPoint.name,
    slug: slugify(cutPoint.name),
    description: cutPoint.description,
    tags: cutPoint.tags,
    startTimeMs: cutPoint.t * 1000,
    endTimeMs: undefined,
    link: cutVideoLink,
    sourceMoveListId: moveList.id,
  };
}

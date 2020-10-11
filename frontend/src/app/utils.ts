import scrollIntoViewIfNeeded from 'scroll-into-view-if-needed';

import { ObjectT, OwnedObjectT, SlugidT, UUID } from 'src/kernel/types';
import { slugify, stripQuotes } from 'src/utils/utils';
import { MoveListT } from 'src/move_lists/types';
import { MoveT } from 'src/moves/types';
import { CutPointT } from 'src/video/types';
import { UserProfileT } from 'src/profiles/types';
import { TagT } from 'src/tags/types';

export function isOwner(userProfile: UserProfileT, ownerId: number) {
  return userProfile && userProfile.userId === ownerId;
}

export function pickNeighbour2(
  allItems: Array<any>,
  pickedItem: any,
  isForward: boolean,
  pickItem: (x: any) => void
) {
  const idx = allItems.findIndex((x) => x === pickedItem);

  if (isForward && idx + 1 < allItems.length) {
    pickItem(allItems[idx + 1]);
    return true;
  }
  if (!isForward && idx - 1 >= 0) {
    pickItem(allItems[idx - 1]);
    return true;
  }
  return false;
}

export function handleSelectionKeys2(
  key: string,
  e: any,
  allItems: Array<any>,
  selectedItem: any,
  selectItem: (x: any) => void
) {
  if (['up', 'down'].includes(key)) {
    e.stopPropagation();
    if (pickNeighbour2(allItems, selectedItem, key === 'down', selectItem)) {
      e.preventDefault();
    }
    return true;
  }

  const pageUp = 33;
  const pageDown = 34;
  if ([pageUp, pageDown].includes(e.keyCode)) {
    e.preventDefault();
    e.stopPropagation();
    return true;
  }

  return false;
}

export function scrollIntoView(elm: any, boundary?: any) {
  if (elm) {
    return scrollIntoViewIfNeeded(elm, {
      block: 'nearest',
      boundary: boundary,
    });
  }
}

export function tagStringToTags(tagString: string): Array<TagT> {
  return tagString
    .split(',')
    .map((x) => stripQuotes(x.trim()))
    .filter((x) => !!x);
}

export function createErrorHandler(msg: string) {
  return function (e: any) {
    console.log(msg, e);
    // TODO: not using toastr anymore
    console.error('Oops!', msg);
  };
}

export function getId(x?: ObjectT) {
  return x ? x.id : '';
}

export function getIds(x: Array<ObjectT>): Array<UUID> {
  return x.map((x) => x.id);
}

export function idTable(items: Array<any>): Function {
  return (id: any) => items.find((x) => x.id === id);
}

export function getOwnerId(x?: OwnedObjectT): number {
  return x ? x.ownerId : -1;
}

export function last(x: Array<any>): any {
  return x[x.length - 1];
}

export function makeSlugid(slug: string, id?: UUID) {
  return slug + (id ? '/' + id : '');
}

export function makeMoveListUrl(moveList: MoveListT) {
  return moveList.ownerUsername + '/' + moveList.slug;
}

export function makeSlugidMatcher(slugid: SlugidT) {
  const parts = slugid.split('/');
  return (move: MoveT) =>
    parts.length === 2 ? move.id === parts[1] : move.slug === parts[0];
}

export function makeIdMatcher(id: UUID) {
  return (obj: ObjectT) => obj.id === id;
}

export function findMoveBySlugid(moves: Array<MoveT>, slugid: string) {
  return moves.find(makeSlugidMatcher(slugid));
}

export function findMoveListByUrl(moveLists: Array<MoveListT>, url: string) {
  return moveLists.find((x) => makeMoveListUrl(x) === url);
}

export const newMoveListSlug = 'new-move-list';

export function findNeighbourIdx(
  filteredIds: Array<UUID>,
  allIds: Array<UUID>,
  beginIndex: number,
  endIndex: number,
  step: number
) {
  for (var idx = beginIndex; idx !== endIndex; idx += step) {
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
    function match(move: MoveT) {
      return (
        (!tags.length || tags.every((tag) => move.tags.includes(tag))) &&
        (!keywords.length ||
          keywords.every((keyword) =>
            move.name.toLowerCase().includes(keyword.toLowerCase())
          ))
      );
    }

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
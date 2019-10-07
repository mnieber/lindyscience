// @flow

import { splitIntoKeywords, isNone } from "utils/utils";
// $FlowFixMe
import parse from "url-parse";
import type { MoveT } from "moves/types";
import type { MoveListT } from "move_lists/types";
import type { PayloadT } from "screens/containers/data_container";
import type { TagT } from "tags/types";
import type { ObjectT, SlugidT, UUID } from "kernel/types";

export function makeSlugid(slug: string, id: ?UUID) {
  return slug + (id ? "/" + id : "");
}

export function makeMoveListUrl(moveList: MoveListT) {
  return moveList.ownerUsername + "/" + moveList.slug;
}

export function makeSlugidMatcher(slugid: SlugidT) {
  const parts = slugid.split("/");
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
  return moveLists.find(x => makeMoveListUrl(x) == url);
}

export const newMoveListSlug = "new-move-list";

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

export function getPreview<ItemT: ObjectT>(
  items: Array<ItemT>,
  payload: ?PayloadT<ItemT>
): Array<ItemT> {
  // $FlowFixMe
  const pl: PayloadT<ItemT> = payload;

  return !payload || !payload.payload.length
    ? items
    : items.reduce(
        (acc, item) => {
          if (item.id == pl.targetItemId && pl.isBefore) {
            acc.push(...pl.payload);
          }
          if (!pl.payload.find(makeIdMatcher(item.id))) {
            acc.push(item);
          }
          if (item.id == pl.targetItemId && !pl.isBefore) {
            acc.push(...pl.payload);
          }
          return acc;
        },
        pl.targetItemId ? [] : [...pl.payload]
      );
}

export function createTagsAndKeywordsFilter(
  tags: Array<TagT>,
  keywords: Array<string>
) {
  function _filter(moves: Array<MoveT>) {
    function match(move) {
      const moveKeywords = splitIntoKeywords(move.name);
      return (
        (!tags.length || tags.every(tag => move.tags.includes(tag))) &&
        (!keywords.length ||
          keywords.every(keyword =>
            move.name.toLowerCase().includes(keyword.toLowerCase())
          ))
      );
    }

    // $FlowFixMe
    return tags.length || keywords.length ? moves.filter(match) : moves;
  }
  return _filter;
}

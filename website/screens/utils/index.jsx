// @Flow

import { splitIntoKeywords, isNone } from "utils/utils";
import parse from "url-parse";

import type { MoveT } from "moves/types";
import type { MoveListT } from "screens/types";
import type { UUID, SlugidT } from "kernel/types";

export function makeSlugid(slug: string, id: UUID) {
  return slug + (id ? "/" + id : "");
}

export function makeMoveListUrl(moveList: MoveListT) {
  return moveList.ownerUsername + "/" + moveList.slug;
}

export function makeSlugidMatcher(slugid: SlugidT) {
  const parts = slugid.split("/");
  return move =>
    parts.length == 2 ? move.id == parts[1] : move.slug == parts[0];
}

export function makeIdMatcher(id: UUID) {
  return obj => obj.id == id;
}

export function findMoveBySlugid(moves: Array<MoveT>, slugid: string) {
  return moves.find(makeSlugidMatcher(slugid));
}

export function findMoveListByUrl(moveLists: Array<MoveListT>, url: string) {
  return moveLists.find(x => makeMoveListUrl(x) == url);
}

export const newMoveSlug = "new-move";

export const newMoveListSlug = "new-move-list";

export function findNeighbourIdx(
  filteredIds,
  allIds,
  beginIndex,
  endIndex,
  step
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
  payload: Array<ItemT>,
  targetMoveId: UUID
): Array<ItemT> {
  return !payload.length
    ? items
    : items.reduce(
        (acc, item) => {
          if (!payload.find(makeIdMatcher(item.id))) {
            acc.push(item);
          }
          if (item.id == targetMoveId) {
            acc.push(...payload);
          }
          return acc;
        },
        targetMoveId ? [] : [...payload]
      );
}

export function findTargetId(
  itemIds: Array<UUID>,
  targetItemId: UUID,
  isBefore: boolean
) {
  if (isBefore) {
    const idx = itemIds.findIndex(x => x == targetItemId) - 1;
    targetItemId = idx < 0 ? "" : itemIds[idx];
  }
  return targetItemId;
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
          keywords.every(keyword => move.name.toLowerCase().includes(keyword)))
      );
    }

    return tags.length || keywords.length ? moves.filter(match) : moves;
  }
  return _filter;
}

export function validateVideoLinkUrl(url: string) {
  const parsedUrl = parse(url);
  var netloc = parsedUrl.hostname;
  if (netloc.startsWith("www.")) {
    netloc = netloc.substring(4);
  }
  if (netloc.startsWith("youtube") || netloc.startsWith("youtu.be")) {
    const query = parse.qs.parse(parsedUrl.query);
    if (isNone(query["t"])) {
      return "Missing t=<timestamp> parameter in youtube url";
    }
  }
  return undefined;
}

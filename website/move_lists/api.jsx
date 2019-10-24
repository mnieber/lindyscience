// @flow

import { doQuery } from "app/client";

import type { UUID } from "kernel/types";
import type { MoveListT } from "move_lists/types";

export function apiSaveMoveList(values: MoveListT) {
  return doQuery(
    `mutation saveMoveList(
      $id: String!,
      $name: String!,
      $slug: String!,
      $description: String!,
      $isPrivate: Boolean!,
      $tags: [String]!
    ) {
      saveMoveList(
        pk: $id,
        name: $name,
        slug: $slug,
        description: $description,
        isPrivate: $isPrivate,
        tags: $tags
      ) { ok }
    }`,
    {
      ...values,
    }
  );
}

export function apiUpdateSourceMoveListId(
  moveIds: Array<UUID>,
  sourceMoveListId: UUID
) {
  return doQuery(
    `mutation updateSourceMoveListId(
      $moveIds: [String]!,
      $sourceMoveListId: String!
    ) {
      updateSourceMoveListId(
        moveIds: $moveIds,
        sourceMoveListId: $sourceMoveListId
      ) { ok }
    }`,
    {
      moveIds,
      sourceMoveListId,
    }
  );
}

export function apiSaveMoveOrdering(moveListId: UUID, moveIds: Array<UUID>) {
  return doQuery(
    `mutation saveMoveOrdering(
      $moveListId: String!,
      $moveIds: [String]!,
    ) {
      saveMoveOrdering(
        moveListId: $moveListId,
        moveIds: $moveIds
      ) { ok }
    }`,
    {
      moveListId,
      moveIds,
    }
  );
}

export function apiSaveMoveListOrdering(moveListIds: Array<UUID>) {
  return doQuery(
    `mutation saveMoveListOrdering(
      $moveListIds: [String]!,
    ) {
      saveMoveListOrdering(
        moveListIds: $moveListIds
      ) { ok }
    }`,
    {
      moveListIds,
    }
  );
}

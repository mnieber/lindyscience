// @flow

import type { MoveListT } from 'src/move_lists/types';
import type { UUID } from 'src/kernel/types';
import { doQuery } from 'src/app/client';

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

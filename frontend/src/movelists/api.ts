import { MoveListT } from 'src/movelists/types';
import { UUID } from 'src/kernel/types';
import { doQuery } from 'src/app/client';

export function apiSaveMoveList(values: MoveListT) {
  const query = `mutation saveMoveList(
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
    }`;
  return doQuery(query, {
    ...values,
  });
}

export function apiUpdateSourceMoveListId(
  moveIds: Array<UUID>,
  sourceMoveListId: UUID
) {
  const query = `mutation updateSourceMoveListId(
      $moveIds: [String]!,
      $sourceMoveListId: String!
    ) {
      updateSourceMoveListId(
        moveIds: $moveIds,
        sourceMoveListId: $sourceMoveListId
      ) { ok }
    }`;
  return doQuery(query, {
    moveIds,
    sourceMoveListId,
  });
}

export function apiSaveMoveOrdering(moveListId: UUID, moveIds: Array<UUID>) {
  const query = `mutation saveMoveOrdering(
      $moveListId: String!,
      $moveIds: [String]!,
    ) {
      saveMoveOrdering(
        moveListId: $moveListId,
        moveIds: $moveIds
      ) { ok }
    }`;
  return doQuery(query, {
    moveListId,
    moveIds,
  });
}

export function apiSaveMoveListOrdering(moveListIds: Array<UUID>) {
  const query = `mutation saveMoveListOrdering(
      $moveListIds: [String]!,
    ) {
      saveMoveListOrdering(
        moveListIds: $moveListIds
      ) { ok }
    }`;
  return doQuery(query, {
    moveListIds,
  });
}

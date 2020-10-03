import { MovePrivateDataT, MoveT } from 'src/moves/types';
import { doQuery } from 'src/app/client';
import { flatten } from 'src/utils/utils';
import { normalize, schema } from 'normalizr';

export function apiSaveMove(values: MoveT) {
  return doQuery(
    `mutation saveMove(
      $id: String!,
      $name: String!,
      $slug: String!,
      $link: String,
      $startTimeMs: Int,
      $endTimeMs: Int,
      $description: String!,
      $tags: [String]!,
      $sourceMoveListId: String!,
    ) {
      saveMove(
        pk: $id,
        name: $name,
        slug: $slug,
        link: $link,
        startTimeMs: $startTimeMs,
        endTimeMs: $endTimeMs,
        description: $description,
        tags: $tags,
        sourceMoveListId: $sourceMoveListId
      ) { ok }
    }`,
    {
      ...values,
    }
  );
}

export function apiSaveMovePrivateData(values: MovePrivateDataT) {
  return doQuery(
    `mutation saveMovePrivateData(
      $id: String!,
      $moveId: String!,
      $notes: String!,
      $tags: [String]!
    ) {
      saveMovePrivateData(
        pk: $id,
        moveId: $moveId,
        notes: $notes,
        tags: $tags
      ) { ok }
    }`,
    {
      ...values,
    }
  );
}

const movePrivateData = new schema.Entity('movePrivateDatas');

export function apiLoadMovePrivateDatas() {
  return doQuery(
    `query queryMovePrivateDatas {
      movePrivateDatas {
        id
        notes
        tags
        move {
          id
        }
      }
    }`
  )
    .then((result) => flatten(result, ['/movePrivateDatas/*/move']))
    .then((result) => normalize(result.movePrivateDatas, [movePrivateData]));
}

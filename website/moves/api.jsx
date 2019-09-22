// @flow

import { normalize, schema } from "normalizr";
import { flatten } from "utils/utils";
import { doQuery } from "app/client";

import type { MoveT, MovePrivateDataT } from "moves/types";

export function saveMove(values: MoveT) {
  return doQuery(
    `mutation saveMove(
      $id: String!,
      $name: String!,
      $slug: String!,
      $link: String!,
      $startTimeMs: Int!,
      $endTimeMs: Int!,
      $description: String!,
      $tags: [String]!,
      $variationNames: [String]!,
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
        variationNames: $variationNames,
        sourceMoveListId: $sourceMoveListId
      ) { ok }
    }`,
    {
      ...values,
    }
  );
}

export function saveMovePrivateData(values: MovePrivateDataT) {
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

const movePrivateData = new schema.Entity("movePrivateDatas");

export function loadMovePrivateDatas() {
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
    .then(result => flatten(result, ["/movePrivateDatas/*/move"]))
    .then(result => normalize(result.movePrivateDatas, [movePrivateData]));
}

// @flow

import { flatten } from "utils/utils";
import { normalize, schema } from "normalizr";
import { doQuery } from "app/client";
import type { MoveListT } from "screens/types";
import type { UUID } from "kernel/types";
import type { TagT } from "tags/types";

// Api moves

export function saveMoveList(values: MoveListT) {
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

export function updateSourceMoveListId(
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

export function saveMoveOrdering(moveListId: UUID, moveIds: Array<UUID>) {
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

export function saveMoveListOrdering(moveListIds: Array<UUID>) {
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

const videoLink = new schema.Entity("videoLinks");
const tip = new schema.Entity("tips");
const move = new schema.Entity("moves", {
  videoLinks: [videoLink],
  tips: [tip],
});
const moveList = new schema.Entity("moveLists", {
  moves: [move],
});

export function findMoveLists(ownerUsername: string) {
  return doQuery(
    `query queryMoveLists($ownerUsername: String) {
      findMoveLists(ownerUsername: $ownerUsername) {
        id
        name
        slug
        description
        isPrivate
        role
        tags
        owner {
          username
          id
        }
        moves {
          id
        }
      }
    }`,
    { ownerUsername }
  )
    .then(result => flatten(result, ["/findMoveLists/*/owner"]))
    .then(result => normalize(result.findMoveLists, [moveList]));
}

export function findMoves(
  ownerUsername: string,
  keywords: Array<string>,
  tags: Array<TagT>
) {
  return doQuery(
    `query queryFindMoves($ownerUsername: String, $keywords: [String], $tags: [String]) {
      findMoves(ownerUsername: $ownerUsername, keywords: $keywords, tags: $tags) {
        id
        name
        slug
        sourceMoveList {
          id
          slug
          name
          owner {
            username
          }
        }
      }
    }`,
    { ownerUsername, keywords, tags }
  ).then(
    result => flatten(result, ["/findMoves/*/sourceMoveList/owner"]).findMoves
  );
}

export function loadMoveList(moveListId: UUID) {
  return doQuery(
    `query queryMoveList($moveListId: String!) {
      moveList(id: $moveListId) {
        id
        name
        slug
        description
        isPrivate
        role
        tags
        owner {
          username
          id
        }
        moves {
          id
          owner { id }
          name
          slug
          description
          sourceMoveList { id }
          tags
          videoLinks {
            id
            url
            title
            voteCount
            initialVoteCount: voteCount
            move { id }
            owner { id }
          }
          tips {
            id
            text
            voteCount
            initialVoteCount: voteCount
            move { id }
            owner { id }
          }
        }
      }
    }`,
    { moveListId }
  )
    .then(result =>
      flatten(result, [
        "/moveList/owner",
        "/moveList/moves/*/owner",
        "/moveList/moves/*/sourceMoveList",
        "/moveList/moves/*/videoLinks/*/move",
        "/moveList/moves/*/videoLinks/*/owner",
        "/moveList/moves/*/tips/*/move",
        "/moveList/moves/*/tips/*/owner",
      ])
    )
    .then(result => normalize(result.moveList, moveList));
}

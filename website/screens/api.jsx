// @flow

import { flatten } from "utils/utils";
import { normalize, schema } from "normalizr";
import { doQuery } from "app/client";
import type { UUID } from "kernel/types";
import type { TagT } from "tags/types";

// Api moves

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

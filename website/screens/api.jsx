// @flow

import { flatten } from "utils/utils";
import { normalize, schema } from "normalizr";
import { doQuery } from "app/client";
import type { UUID } from "kernel/types";
import type { TagT } from "tags/types";

// Api moves

const tip = new schema.Entity("tips");
const move = new schema.Entity("moves", {
  tips: [tip],
});
const moveList = new schema.Entity("moveLists", {
  moves: [move],
});

export function apiFindMoveLists(ownerUsername: string) {
  return doQuery(
    `query queryMoveLists($ownerUsername: String!) {
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

export function apiFindMoves(
  ownerUsername: string,
  keywords: Array<string>,
  tags: Array<TagT>
) {
  return doQuery(
    `query queryFindMoves($ownerUsername: String!, $keywords: [String]!, $tags: [String]!) {
      findMoves(ownerUsername: $ownerUsername, keywords: $keywords, tags: $tags) {
        id
        name
        slug
        link
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

export function apiLoadMoveList(ownerUsername: string, slug: string) {
  return doQuery(
    `query queryMoveList(
       $ownerUsername: String!,
       $slug: String!,
     ) {
      moveList(ownerUsername: $ownerUsername, slug: $slug) {
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
          owner {
            id
            username
          }
          name
          slug
          link
          description
          startTimeMs
          endTimeMs
          sourceMoveList { id }
          tags
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
    { ownerUsername, slug }
  )
    .then(result =>
      flatten(result, [
        "/moveList/owner",
        "/moveList/moves/*/owner",
        "/moveList/moves/*/sourceMoveList",
        "/moveList/moves/*/tips/*/move",
        "/moveList/moves/*/tips/*/owner",
      ])
    )
    .then(result => normalize(result.moveList, moveList));
}

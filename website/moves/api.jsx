// @flow

import { flatten } from 'utils/utils'
import { normalize, schema } from 'normalizr';
import { client, doQuery } from 'app/client';
import type { TipT, VideoLinkT, MoveT } from 'moves/types'
import type { UUID } from 'app/types';


// Api moves

export function saveVideoLink(
  create: boolean, moveId: UUID, values: VideoLinkT
) {
  if (
    !values.url.startsWith('http://') &&
    !values.url.startsWith('https://')
  ) {
    values = {...values,
      url: 'http://' + values.url
    }
  }
  return doQuery(
    `mutation saveVideoLink(
      $create: Boolean!,
      $id: String!,
      $moveId: String!
      $url: String!,
      $title: String!,
    ) {
      saveVideoLink(
        create: $create,
        pk: $id,
        moveId: $moveId,
        url: $url,
        title: $title,
      ) { ok }
    }`,
    {
      ...values,
      moveId,
      create,
    }
  )
}


export function saveTip(
  create: boolean, moveId: UUID, values: TipT
) {
  return doQuery(
    `mutation saveTip(
      $create: Boolean!,
      $id: String!,
      $moveId: String!
      $text: String!,
    ) {
      saveTip(
        create: $create,
        pk: $id,
        moveId: $moveId,
        text: $text,
      ) { ok }
    }`,
    {
      ...values,
      moveId,
      create,
    }
  )
}


export function saveMove(create: boolean, values: MoveT) {
  return doQuery(
    `mutation saveMove(
      $create: Boolean!,
      $id: String!,
      $name: String!,
      $slug: String!,
      $description: String!,
      $difficulty: String!,
      $tags: [String]!
    ) {
      saveMove(
        create: $create,
        pk: $id,
        name: $name,
        slug: $slug,
        description: $description,
        difficulty: $difficulty,
        tags: $tags
      ) { ok }
    }`,
    {
      ...values,
      create: create
    }
  )
}

export function saveMoveListOrdering(moveListId: UUID, moveIds: Array<number>) {
  return doQuery(
    `mutation saveMoveListOrdering(
      $moveListId: String!,
      $moveIds: [String]!,
    ) {
      saveMoveListOrdering(
        moveListId: $moveListId,
        moveIds: $moveIds
      ) { ok }
    }`,
    {
      moveListId,
      moveIds
    }
  )
}


const videoLink = new schema.Entity('videoLinks');
const tip = new schema.Entity('tips');
const movePrivateData = new schema.Entity('movePrivateDatas');
const move = new schema.Entity('moves', {
  videoLinks: [videoLink],
  tips: [tip],
});
const moveList = new schema.Entity('moveLists', {
  moves: [move]
});

export function loadMoveLists() {
  return doQuery(
    `query queryMoveLists {
      allMoveLists {
        id
        name
        slug
        description
        tags
        owner {
          username
        }
      }
    }`
  )
  .then(result => flatten(result, ['/allMoveLists/*/owner',]))
  .then(result => normalize(result.allMoveLists, [moveList]))
}

export function loadMoveList(moveListId: UUID) {
  return doQuery(
    `query queryMoveList($moveListId: String!) {
      moveList(id: $moveListId) {
        id
        name
        slug
        description
        tags
        owner {
          username
        }
        moves {
          id
          name
          slug
          description
          difficulty
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
    {moveListId}
  )
  .then(result => flatten(
    result,
    [
      '/moveList/owner',
      '/moveList/moves/*/videoLinks/*/move',
      '/moveList/moves/*/videoLinks/*/owner',
      '/moveList/moves/*/tips/*/move',
      '/moveList/moves/*/tips/*/owner',
    ]
  ))
  .then(result => normalize(result.moveList, moveList))
}


export function loadMovePrivateDatas() {
  return doQuery(
    `query queryMovePrivateDatas {
      movePrivateDatas {
        id
        notes
      }
    }`
  )
  .then(result => normalize(result.movePrivateDatas, [movePrivateData]))
}


export function updateProfile(
  moveUrl: string,
) {
  return doQuery(
    `mutation updateProfile(
      $moveUrl: String!,
    ) {
      updateProfile(
        recentMoveUrl: $moveUrl,
      ) {
        ok
      }
    }`,
    {moveUrl}
  )
}

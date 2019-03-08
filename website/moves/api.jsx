// @flow

import { flatten } from 'utils/utils'
import { normalize, schema } from 'normalizr';
import { client, doQuery } from 'app/client';
import type {
  TipT, VideoLinkT, MoveT, MoveListT, MovePrivateDataT
} from 'moves/types'
import type { UUID } from 'app/types';


// Api moves

export function saveVideoLink(
  moveId: UUID, values: VideoLinkT
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
      $id: String!,
      $moveId: String!
      $url: String!,
      $title: String!,
    ) {
      saveVideoLink(
        pk: $id,
        moveId: $moveId,
        url: $url,
        title: $title,
      ) { ok }
    }`,
    {
      ...values,
      moveId,
    }
  )
}


export function saveTip(
  moveId: UUID, values: TipT
) {
  return doQuery(
    `mutation saveTip(
      $id: String!,
      $moveId: String!
      $text: String!,
    ) {
      saveTip(
        pk: $id,
        moveId: $moveId,
        text: $text,
      ) { ok }
    }`,
    {
      ...values,
      moveId,
    }
  )
}


export function saveMoveList(values: MoveListT) {
  return doQuery(
    `mutation saveMoveList(
      $id: String!,
      $name: String!,
      $slug: String!,
      $description: String!,
      $tags: [String]!
    ) {
      saveMoveList(
        pk: $id,
        name: $name,
        slug: $slug,
        description: $description,
        tags: $tags
      ) { ok }
    }`,
    {
      ...values,
    }
  )
}


export function saveMove(values: MoveT) {
  return doQuery(
    `mutation saveMove(
      $id: String!,
      $name: String!,
      $slug: String!,
      $description: String!,
      $difficulty: String!,
      $tags: [String]!
    ) {
      saveMove(
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
    }
  )
}


export function saveMovePrivateData(values: MovePrivateDataT) {
  return doQuery(
    `mutation saveMovePrivateData(
      $id: String!,
      $moveId: String!,
      $notes: String!,
    ) {
      saveMovePrivateData(
        pk: $id,
        moveId: $moveId,
        notes: $notes,
      ) { ok }
    }`,
    {
      ...values
    }
  )
}

export function saveMoveOrdering(moveListId: UUID, moveIds: Array<number>) {
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
      moveIds
    }
  )
}

export function saveMoveListOrdering(moveListIds: Array<number>) {
  return doQuery(
    `mutation saveMoveListOrdering(
      $moveListIds: [String]!,
    ) {
      saveMoveListOrdering(
        moveListIds: $moveListIds
      ) { ok }
    }`,
    {
      moveListIds
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
          id
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
          id
        }
        moves {
          id
          owner { id }
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
      '/moveList/moves/*/owner',
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
        move {
          id
        }
      }
    }`
  )
  .then(result => flatten(
      result,
      [
        '/movePrivateDatas/*/move',
      ]
    ))
  .then(result => normalize(result.movePrivateDatas, [movePrivateData]))
}

// @flow

import { flatten } from 'utils/utils'
import { normalize, schema } from 'normalizr';
import { client, doQuery } from 'app/client';
import type { VoteT, TipT, VideoLinkT, MoveT } from 'moves/types'
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
const privateData = new schema.Entity('privateDatas');
const move = new schema.Entity('moves', {
  videoLinks: [videoLink],
  tips: [tip],
  privateDatas: [privateData],
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
        tags
      }
    }`
  ).then(result => normalize(result.allMoveLists, [moveList]))
}

export function loadMoveList(moveListId: UUID) {
  return doQuery(
    `query queryMoveList($moveListId: String!) {
      moveList(id: $moveListId) {
        id
        name
        slug
        tags
        moves {
          id
          name
          slug
          description
          difficulty
          tags
          privateDatas {
            id
            notes
          }
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
      '/moveList/moves/*/videoLinks/*/move',
      '/moveList/moves/*/videoLinks/*/owner',
      '/moveList/moves/*/tips/*/move',
      '/moveList/moves/*/tips/*/owner',
    ]
  ))
  .then(result => normalize(result.moveList, moveList))
}


export function loadUserVotes() {
  return doQuery(
    `query queryUserVotes {
      userVotes {
        objectId
        value
      }
    }`
  )
  .then(result => result.userVotes.reduce(
    (acc, vote) => {
      acc[vote.objectId] = vote.value;
      return acc;
    },
    {}
  ))
}


function _castVote(
  appLabel: string,
  model: string,
  objectId: UUID,
  value: VoteT,
) {
  return doQuery(
    `mutation castVote(
      $appLabel: String!,
      $model: String!,
      $objectId: String!,
      $value: Int!
    ) {
      castVote(
        appLabel: $appLabel,
        model: $model,
        objectId: $objectId,
        value: $value
      ) {
        ok
        vote {
          value
        }
      }
    }`,
    {appLabel, model, objectId, value}
  )
}

export const voteTip = (objectId: UUID, value: VoteT) => _castVote('moves', 'Tip', objectId, value);
export const voteVideoLink = (objectId: UUID, value: VoteT) => _castVote('moves', 'VideoLink', objectId, value);

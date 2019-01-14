export const moveList1 = {
  "description": "All the moves",
  "id": "02f82088-dee1-4b80-9c1c-0bec2b8255a3",
  "isPrivate": false,
  "isTrash": false,
  "moves": [
    "18561d09-0727-441d-bdd9-d3d8c33ebde3",
    "3ba5ed84-34d5-442c-921c-50da0dc022da",
    "b95df10a-cbe2-4ec4-9a03-1b61c5452e9d",
  ],
  "name": "Moves",
  "slug": "moves",
  "tags": ["one", "two", "three"],
}

export const moveList2 = {
  "description": "Some moves",
  "id": "jJroEMamLu",
  "isPrivate": true,
  "isTrash": false,
  "moves": [
    "18561d09-0727-441d-bdd9-d3d8c33ebde3",
    "3ba5ed84-34d5-442c-921c-50da0dc022da",
  ],
  "name": "Some moves",
  "slug": "some-moves",
  "tags": ["two"],
}

export const moveLists = {
  [moveList1.id]: moveList1,
  [moveList2.id]: moveList2,
};

export const moves = {
  "18561d09-0727-441d-bdd9-d3d8c33ebde3": {
    "id": "18561d09-0727-441d-bdd9-d3d8c33ebde3",
    "name": "Three wall swing out",
    "slug": "three-wall-swing-out",
    "tags": ["swing out"],
  },
  "3ba5ed84-34d5-442c-921c-50da0dc022da": {
    "id": "3ba5ed84-34d5-442c-921c-50da0dc022da",
    "name": "Basket Whip",
    "slug": "basket-whip",
    "tags": ["basket whip", "fun"],
  },
  "b95df10a-cbe2-4ec4-9a03-1b61c5452e9d": {
    "id": "b95df10a-cbe2-4ec4-9a03-1b61c5452e9d",
    "name": "Heel pops",
    "slug": "heel-pops",
    "tags": [],
  }
}

export const votes = {
  "759b488d-ffa4-467c-8157-6ca27114bda9": -1,
  "e758ae21-aa62-4e88-9ae6-1ff1c28d3056": 0,
  "eb59c0e1-dd0e-473e-b7eb-8445a869a67b": 1,
}

export const movePrivateDatas = {
  "18561d09-0727-441d-bdd9-d3d8c33ebde3": {foo: 'bar'}
}

export const videoLinks = {
  "759b488d-ffa4-467c-8157-6ca27114bda9": {
    "id": "759b488d-ffa4-467c-8157-6ca27114bda9",
    "url": "https://youtu.be/O-6iHUgDGj8?t=244",
    "title": "Adrienne and Rafal",
    "voteCount": -1,
    "initialVoteCount": -1,
    "moveId": "18561d09-0727-441d-bdd9-d3d8c33ebde3",
    "ownerId": "1"
  },
  "e758ae21-aa62-4e88-9ae6-1ff1c28d3056": {
    "id": "e758ae21-aa62-4e88-9ae6-1ff1c28d3056",
    "url": "https://youtu.be/EZkJlstt1qw?t=108",
    "title": "Nina and Adam",
    "voteCount": 0,
    "initialVoteCount": 0,
    "moveId": "3ba5ed84-34d5-442c-921c-50da0dc022da",
    "ownerId": "1"
  },
  "eb59c0e1-dd0e-473e-b7eb-8445a869a67b": {
    "id": "eb59c0e1-dd0e-473e-b7eb-8445a869a67b",
    "url": "https://youtu.be/Pu01PjZhNrQ?t=260",
    "title": "Jon and Jenna",
    "voteCount": 1,
    "initialVoteCount": 1,
    "moveId": "3ba5ed84-34d5-442c-921c-50da0dc022da",
    "ownerId": "1"
  },
}

export const tips = {
  "e525a3bf-37d3-4ee0-8e59-f37475d042cf": {
    "id": "e525a3bf-37d3-4ee0-8e59-f37475d042cf",
    "text": "Do it!",
    "voteCount": 0,
    "initialVoteCount": 0,
    "moveId": "b95df10a-cbe2-4ec4-9a03-1b61c5452e9d",
    "ownerId": "1"
  },
  "7c390ef6-74de-492b-86ec-b14869bd608c": {
    "id": "7c390ef6-74de-492b-86ec-b14869bd608c",
    "text": "Oh yeah",
    "voteCount": 0,
    "initialVoteCount": 0,
    "moveId": "b95df10a-cbe2-4ec4-9a03-1b61c5452e9d",
    "ownerId": "1"
  },
  "1ba32a5c-f1b9-45fa-9754-e2818331035c": {
    "id": "1ba32a5c-f1b9-45fa-9754-e2818331035c",
    "text": "Hello",
    "voteCount": 0,
    "initialVoteCount": 0,
    "moveId": "b95df10a-cbe2-4ec4-9a03-1b61c5452e9d",
    "ownerId": "1"
  },
  "0878b026-6964-4bd9-b871-8cbd66467b72": {
    "id": "0878b026-6964-4bd9-b871-8cbd66467b72",
    "text": "Try it out",
    "voteCount": 0,
    "initialVoteCount": 0,
    "moveId": "18561d09-0727-441d-bdd9-d3d8c33ebde3",
    "ownerId": "1"
  },
};

export const state = {
  moves: {
    moves: moves,
    moveLists: moveLists,
    selection: {
      moveListId: moveList1.id,
      highlightedMoveId: "",
      moveFilterTags: [],
    },
    movePrivateDatas: {},
    videoLinks: videoLinks,
    tips: tips,
    votes: votes,
    tags: {
      moveTags: {},
      moveListTags: {},
    }
  }
};

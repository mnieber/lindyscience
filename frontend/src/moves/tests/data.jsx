export const profile1 = {
  userId: 1,
  username: 'mnieber',
};

export const profile2 = {
  userId: 2,
  username: 'mn',
};

export const moves = {
  '18561d09-0727-441d-bdd9-d3d8c33ebde3': {
    id: '18561d09-0727-441d-bdd9-d3d8c33ebde3',
    name: 'Three wall swing out',
    slug: 'three-wall-swing-out',
    tags: ['swing out'],
    ownerId: profile1.userId,
    ownerUsername: profile1.username,
  },
  '3ba5ed84-34d5-442c-921c-50da0dc022da': {
    id: '3ba5ed84-34d5-442c-921c-50da0dc022da',
    name: 'Basket Whip',
    slug: 'basket-whip',
    tags: ['basket whip', 'fun'],
    ownerId: profile1.userId,
    ownerUsername: profile1.username,
  },
  'b95df10a-cbe2-4ec4-9a03-1b61c5452e9d': {
    id: 'b95df10a-cbe2-4ec4-9a03-1b61c5452e9d',
    name: 'Heel pops',
    slug: 'heel-pops',
    tags: [],
    ownerId: profile2.userId,
    ownerUsername: profile2.username,
  },
  '95f5fb91-81ce-4895-a945-59dada5b8b7e': {
    id: '95f5fb91-81ce-4895-a945-59dada5b8b7e',
    name: 'Slides',
    slug: 'slides',
    tags: [],
    ownerId: profile2.userId,
    ownerUsername: profile2.username,
  },
};

export const votes = {
  '759b488d-ffa4-467c-8157-6ca27114bda9': -1,
  'e758ae21-aa62-4e88-9ae6-1ff1c28d3056': 0,
  'eb59c0e1-dd0e-473e-b7eb-8445a869a67b': 1,
};

export const movePrivateDatas = {
  '18561d09-0727-441d-bdd9-d3d8c33ebde3': { foo: 'bar' },
};

export const state = {
  moves: moves,
  movePrivateDatas: {},
  tags: {},
};

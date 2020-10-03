///////////////////////////////////////////////////////////////////////
// Types
///////////////////////////////////////////////////////////////////////

export type UUID = string;

export type SlugidT = string;

export type ObjectT = {
  id: UUID;
};

export type OwnedT = {
  ownerId: number;
  ownerUsername: string;
};

export type OwnedObjectT = ObjectT & OwnedT;

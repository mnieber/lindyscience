import { Addition } from 'skandha-facets/Addition';
import { MovesContainer } from 'src/moves/MovesCtr/MovesCtr';
import { UserProfileT } from 'src/profiles/types';
import { UUID } from 'src/kernel/types';
import { MoveT } from 'src/moves/types';
import { createUUID } from 'src/utils/utils';
import { newMoveSlug } from 'src/moves/utils';
import { getc } from 'skandha';

function createNewMove(
  userProfile: UserProfileT,
  sourceMoveListId: UUID
): MoveT {
  return {
    id: createUUID(),
    // id: "<<<      NEWMOVE      >>>",
    slug: newMoveSlug,
    link: '',
    name: 'New move',
    description: '',
    startTimeMs: undefined,
    endTimeMs: undefined,
    tags: [],
    ownerId: userProfile.userId,
    ownerUsername: userProfile.username,
    sourceMoveListId: sourceMoveListId,
  };
}

export function handleCreateMove(facet: Addition, values: any) {
  const ctr = getc<MovesContainer>(facet);
  if (!ctr.inputs.userProfile) {
    throw Error('No user profile');
  }
  if (!ctr.inputs.moveList) {
    throw Error('No movelist');
  }
  return createNewMove(ctr.inputs.userProfile, ctr.inputs.moveList.id);
}

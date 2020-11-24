import { Addition } from 'facility-mobx/facets/Addition';
import { MovesContainer } from 'src/moves/MovesCtr/MovesCtr';
import { UserProfileT } from 'src/profiles/types';
import { UUID } from 'src/kernel/types';
import { MoveT } from 'src/moves/types';
import { createUUID } from 'src/utils/utils';
import { newMoveSlug } from 'src/moves/utils';
import { getCtr } from 'facility';

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

export function handleCreateMove(this: Addition, values: any) {
  const ctr = getCtr<MovesContainer>(this);
  if (!ctr.inputs.userProfile) {
    throw Error('No user profile');
  }
  if (!ctr.inputs.moveList) {
    throw Error('No movelist');
  }
  return createNewMove(ctr.inputs.userProfile, ctr.inputs.moveList.id);
}

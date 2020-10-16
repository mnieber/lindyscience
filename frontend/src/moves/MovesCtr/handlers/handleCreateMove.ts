import { MovesContainer } from 'src/moves/MovesCtr/MovesCtr';
import { UserProfileT } from 'src/profiles/types';
import { UUID } from 'src/kernel/types';
import { MoveT } from 'src/moves/types';
import { createUUID } from 'src/utils/utils';
import { newMoveSlug } from 'src/moves/utils';

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

export const handleCreateMove = (ctr: MovesContainer) => {
  return (values: any) => {
    if (!ctr.inputs.userProfile) {
      throw Error('No user profile');
    }
    if (!ctr.inputs.moveList) {
      throw Error('No movelist');
    }
    return createNewMove(ctr.inputs.userProfile, ctr.inputs.moveList.id);
  };
};

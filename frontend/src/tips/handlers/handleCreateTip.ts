import { TipT } from 'src/tips/types';
import { TipsCtr } from 'src/tips/TipsCtr';
import { UUID } from 'src/kernel/types';
import { createUUID } from 'src/utils/utils';

function createNewTip(userId: number, moveId: UUID): TipT {
  return {
    id: createUUID(),
    ownerId: userId,
    moveId: moveId,
    text: '',
    voteCount: 0,
    initialVoteCount: 0,
  };
}

export const handleCreateTip = (ctr: TipsCtr) => {
  return (values: any) => {
    if (!ctr.inputs.userProfile) {
      throw Error('No user profile');
    }
    if (!ctr.inputs.move) {
      throw Error('No move');
    }
    return createNewTip(ctr.inputs.userProfile.userId, ctr.inputs.move.id);
  };
};

import { MoveListT } from 'src/move_lists/types';
import { MoveListsContainer } from 'src/move_lists/MovelistsCtr';
import { createUUID, slugify } from 'src/utils/utils';
import { newMoveListSlug } from 'src/app/utils';

function createNewMoveList(props: any): MoveListT {
  return {
    // id: "<<< NEW MOVELIST >>>",
    id: createUUID(),
    slug: props.name ? slugify(props.name) : newMoveListSlug,
    name: 'New move list',
    description: '',
    isPrivate: false,
    role: '',
    tags: [],
    moves: [],
    ...props,
  };
}

export const handleCreateMoveList = (ctr: MoveListsContainer, values: any) => {
  const userProfile = ctr.inputs.userProfile as any;
  return createNewMoveList({
    ...values,
    ownerId: userProfile.userId,
    ownerUsername: userProfile.username,
  });
};

import { createErrorHandler, newMoveListSlug } from 'src/app/utils';
import { MoveListsContainer } from 'src/move_lists/MovelistsCtr';
import { apiSaveMoveList } from 'src/move_lists/api';
import { MoveListsStore } from 'src/move_lists/MoveListsStore';
import { listToItemById, slugify } from 'src/utils/utils';

export const handleSaveMoveList = (moveListsStore: MoveListsStore) => (
  ctr: MoveListsContainer
) => {
  return (values: any) => {
    const slug =
      values.slug === newMoveListSlug ? slugify(values.name) : values.slug;

    const newMoveList = {
      ...ctr.highlight.item,
      ...values,
      slug,
    };

    moveListsStore.addMoveLists(listToItemById([newMoveList]));
    return apiSaveMoveList(newMoveList).catch(
      createErrorHandler('We could not save the movelist')
    );
  };
};

import { createErrorHandler, newMoveListSlug } from 'src/app/utils';
import { Editing } from 'facility-mobx/facets/Editing';
import { getCtr } from 'facility';
import { apiSaveMoveList } from 'src/move_lists/api';
import { MoveListsStore } from 'src/move_lists/MoveListsStore';
import { listToItemById, slugify } from 'src/utils/utils';

export const handleSaveMoveList = (moveListsStore: MoveListsStore) =>
  function (this: Editing, values: any) {
    const ctr = getCtr(this);
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

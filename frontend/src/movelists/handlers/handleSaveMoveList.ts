import { createErrorHandler, newMoveListSlug } from 'src/app/utils';
import { Editing } from 'skandha-facets/Editing';
import { getc } from 'skandha';
import { apiSaveMoveList } from 'src/movelists/api';
import { MoveListsStore } from 'src/movelists/MoveListsStore';
import { listToItemById, slugify } from 'src/utils/utils';

export const handleSaveMoveList = (
  facet: Editing,
  moveListsStore: MoveListsStore,
  values: any
) => {
  const ctr = getc(facet);
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

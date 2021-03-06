import { Editing } from 'skandha-facets/Editing';
import { Highlight } from 'skandha-facets/Highlight';
import { MovesStore } from 'src/moves/MovesStore';
import { getf, getc } from 'skandha';
import { newMoveSlug } from 'src/moves/utils';
import { slugify } from 'src/utils/utils';
import { apiSaveMove } from 'src/moves/api';
import { createErrorHandler } from 'src/app/utils';

export const handleSaveMove = (
  facet: Editing,
  movesStore: MovesStore,
  values: any
) => {
  const ctr = getc(facet);
  const move = getf(Highlight, ctr).item;
  const isNewMove = values.slug === newMoveSlug;
  const slug = isNewMove ? slugify(values.name) : values.slug;

  const newMove = {
    ...move,
    ...values,
    slug,
  };

  movesStore.addMoves([newMove]);

  apiSaveMove(newMove).catch(createErrorHandler('We could not save the move'));
};

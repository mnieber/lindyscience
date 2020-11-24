import { Editing } from 'facility-mobx/facets/Editing';
import { Highlight } from 'facility-mobx/facets/Highlight';
import { MovesStore } from 'src/moves/MovesStore';
import { getCtr } from 'facility';
import { newMoveSlug } from 'src/moves/utils';
import { slugify } from 'src/utils/utils';
import { apiSaveMove } from 'src/moves/api';
import { createErrorHandler } from 'src/app/utils';

export const handleSaveMove = (movesStore: MovesStore) =>
  function (this: Editing, values: any) {
    const ctr = getCtr(this);
    const move = Highlight.get(ctr).item;
    const isNewMove = values.slug === newMoveSlug;
    const slug = isNewMove ? slugify(values.name) : values.slug;

    const newMove = {
      ...move,
      ...values,
      slug,
    };

    movesStore.addMoves([newMove]);

    apiSaveMove(newMove).catch(
      createErrorHandler('We could not save the move')
    );
  };

import { Highlight } from 'facet-mobx/facets/Highlight';
import { Navigation } from 'src/session/facets/Navigation';
import { MovesStore } from 'src/moves/MovesStore';
import { MovesContainer } from 'src/moves/MovesCtr/MovesCtr';
import { newMoveSlug } from 'src/moves/utils';
import { slugify } from 'src/utils/utils';
import { apiSaveMove } from 'src/moves/api';
import { createErrorHandler } from 'src/app/utils';

export const handleSaveMove = (
  ctr: MovesContainer,
  navigation: Navigation,
  movesStore: MovesStore
) => {
  return (values: any) => {
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

    if (isNewMove) {
      navigation.navigateToMove(newMove);
    }
  };
};

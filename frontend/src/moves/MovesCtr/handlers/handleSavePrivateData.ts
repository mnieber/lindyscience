import { EditingPrivateData } from 'src/moves/MovesCtr/facets/EditingPrivateData';
import { Highlight } from 'skandha-facets/Highlight';
import { MovesStore } from 'src/moves/MovesStore';
import { getf, getc } from 'skandha';
import { createErrorHandler } from 'src/app/utils';
import { apiSaveMovePrivateData } from 'src/moves/api';

export const handleSavePrivateData = (
  facet: EditingPrivateData,
  movesStore: MovesStore,
  values: any
) => {
  const ctr = getc(facet);
  const move = getf(Highlight, ctr).item;
  const movePrivateData = movesStore.getOrCreatePrivateData(move.id);
  const mpd = {
    ...movePrivateData,
    ...values,
  };

  movesStore.addMovePrivateDatas({
    [movePrivateData.moveId]: mpd,
  });
  apiSaveMovePrivateData(mpd).catch(
    createErrorHandler('We could not update your private data for this move')
  );
};

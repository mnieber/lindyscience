import { MovesStore } from 'src/moves/MovesStore';
import { SessionContainer } from 'src/session/SessionCtr';
import { MoveT } from 'src/moves/types';
import { getCtr } from 'facility';

export function handleAddMoveTags(facet: MovesStore, moves: MoveT[]) {
  const ctr = getCtr<SessionContainer>(facet);
  ctr.tagsStore.addMoveTags(moves.map((x) => x.tags));
}

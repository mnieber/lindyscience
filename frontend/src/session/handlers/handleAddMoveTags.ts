import { MovesStore } from 'src/moves/MovesStore';
import { SessionContainer } from 'src/session/SessionCtr';
import { MoveT } from 'src/moves/types';
import { getCtr } from 'facet';

export function handleAddMoveTags(this: MovesStore, moves: MoveT[]) {
  const ctr = getCtr<SessionContainer>(this);
  ctr.tagsStore.addMoveTags(moves.map((x) => x.tags));
}

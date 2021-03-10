import { TagsStore } from 'src/tags/TagsStore';
import { MoveT } from 'src/moves/types';

export function handleAddMoveTags(tagsStore: TagsStore, moves: MoveT[]) {
  tagsStore.addMoveTags(moves.map((x) => x.tags));
}

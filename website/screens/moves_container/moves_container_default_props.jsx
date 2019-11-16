// @flow

import { MovesContainer } from "screens/moves_container/moves_container";
import { Editing } from "facet-mobx/facets/editing";
import { Highlight } from "facet-mobx/facets/highlight";

export function getMovesCtrDefaultProps(movesCtr: MovesContainer) {
  return {
    movesCtr: () => movesCtr,
    isEditingMove: () => Editing.get(movesCtr).isEditing,
    move: () => Highlight.get(movesCtr).item,
    moves: () => movesCtr.outputs.display,
    movesPreview: () => movesCtr.outputs.preview,
    movesEditing: () => movesCtr.editing,
    movesDragging: () => movesCtr.dragging,
    movesHighlight: () => movesCtr.highlight,
    movesSelection: () => movesCtr.selection,
    movesClipboard: () => movesCtr.clipboard,
    movesFiltering: () => movesCtr.filtering,
    movesAddition: () => movesCtr.addition,
  };
}

import { MoveListsContainer } from "screens/movelists_container/movelists_container";
import { Editing } from "facet-mobx/facets/editing";
import { Highlight } from "facet-mobx/facets/highlight";

export function getMoveListsCtrDefaultProps(moveListsCtr: MoveListsContainer) {
  return {
    moveListsCtr: () => moveListsCtr,
    isEditingMoveList: () => Editing.get(moveListsCtr).isEditing,
    moveList: () => Highlight.get(moveListsCtr).item,
    moveLists: () => moveListsCtr.outputs.display,
    moveListsPreview: () => moveListsCtr.outputs.preview,
    moveListsEditing: () => moveListsCtr.editing,
    moveListsHighlight: () => moveListsCtr.highlight,
    moveListsSelection: () => moveListsCtr.selection,
    moveListsLabelling: () => moveListsCtr.labelling,
    moveListsAddition: () => moveListsCtr.addition,
  };
}

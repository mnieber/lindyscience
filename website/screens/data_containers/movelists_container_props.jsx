// @flow

import {
  restoreLocationMemo,
  storeLocationMemo,
} from "screens/data_containers/moves_container_props";
import { createUUID, listToItemById, slugify } from "utils/utils";
import { actAddMoveLists } from "move_lists/actions";
import { apiSaveMoveList } from "move_lists/api";
import { newMoveListSlug } from "screens/utils";
import { createErrorHandler } from "app/utils";
import type { MoveListT } from "move_lists/types";

export function moveListsContainerProps(dispatch: Function) {
  function _saveMoveList(moveList: MoveListT, values: any) {
    const slug =
      values.slug == newMoveListSlug ? slugify(values.name) : values.slug;

    const newMoveList = {
      ...moveList,
      ...values,
      slug,
    };

    dispatch(actAddMoveLists(listToItemById([newMoveList])));
    return apiSaveMoveList(newMoveList).catch(
      createErrorHandler("We could not save the movelist")
    );
  }

  function createNewMoveList(props: any): MoveListT {
    return {
      id: createUUID(),
      slug: props.name ? slugify(props.name) : newMoveListSlug,
      name: "New move list",
      description: "",
      isPrivate: false,
      role: "",
      tags: [],
      moves: [],
      ...props,
    };
  }

  function storeHighlight() {
    storeLocationMemo(dispatch);
  }

  function restoreHighlight() {
    restoreLocationMemo(dispatch);
  }

  return {
    saveMoveList: _saveMoveList,
    setMoveLists: (moveLists: Array<MoveListT>) => {
      // Nothing to do
    },
    createNewMoveList,
    storeHighlight,
    restoreHighlight,
  };
}

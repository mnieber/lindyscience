// @flow

import { Navigation } from "screens/session_container/facets/navigation";
import { createUUID, listToItemById, slugify } from "utils/utils";
import { apiSaveMoveList, apiSaveMoveListOrdering } from "move_lists/api";
import { actSetFollowedMoveListIds } from "profiles/actions";
import type { UUID } from "kernel/types";
import { actAddMoveLists } from "move_lists/actions";
import { newMoveListSlug } from "screens/utils";
import { createErrorHandler } from "app/utils";
import type { MoveListT } from "move_lists/types";

export function moveListsContainerProps(
  dispatch: Function,
  navigation: Navigation
) {
  function saveMoveList(moveList: MoveListT, values: any) {
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
      // id: "<<< NEW MOVELIST >>>",
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

  function setFollowedMoveListIds(ids: Array<UUID>) {
    dispatch(actSetFollowedMoveListIds(ids));
    apiSaveMoveListOrdering(ids).catch(
      createErrorHandler(`Could not update the user profile`)
    );
  }

  function setMoveLists(moveLists: Array<MoveListT>) {
    // Nothing to do
  }

  function isEqual(lhs: any, rhs: any): boolean {
    return lhs.id == rhs.id;
  }

  return {
    isEqual,
    saveMoveList,
    setMoveLists,
    createNewMoveList,
    setFollowedMoveListIds,
    navigation,
  };
}

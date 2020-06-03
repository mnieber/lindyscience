// @flow

import { Profiling } from 'src/screens/session_container/facets/profiling';
import { MoveListsStore } from 'src/move_lists/MoveListsStore';
import { Navigation } from 'src/screens/session_container/facets/navigation';
import { createUUID, listToItemById, slugify } from 'src/utils/utils';
import { apiSaveMoveList, apiSaveMoveListOrdering } from 'src/move_lists/api';
import type { UUID } from 'src/kernel/types';
import { newMoveListSlug } from 'src/screens/utils';
import { createErrorHandler } from 'src/app/utils';
import type { MoveListT } from 'src/move_lists/types';

export function moveListsContainerProps(
  navigation: Navigation,
  profiling: Profiling,
  moveListsStore: MoveListsStore
) {
  function saveMoveList(moveList: MoveListT, values: any) {
    const slug =
      values.slug == newMoveListSlug ? slugify(values.name) : values.slug;

    const newMoveList = {
      ...moveList,
      ...values,
      slug,
    };

    moveListsStore.addMoveLists(listToItemById([newMoveList]));
    return apiSaveMoveList(newMoveList).catch(
      createErrorHandler('We could not save the movelist')
    );
  }

  function createNewMoveList(props: any): MoveListT {
    return {
      // id: "<<< NEW MOVELIST >>>",
      id: createUUID(),
      slug: props.name ? slugify(props.name) : newMoveListSlug,
      name: 'New move list',
      description: '',
      isPrivate: false,
      role: '',
      tags: [],
      moves: [],
      ...props,
    };
  }

  function setFollowedMoveListIds(ids: Array<UUID>) {
    profiling.setFollowedMoveListIds(ids);
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

// @flow
import { createSelector } from "reselect";
import { getObjectValues } from "utils/utils";

import type { TagT, TagMapT } from "tags/types";
import type { RootReducerStateT, Selector } from "app/root_reducer";
import type { MoveListT } from "move_lists/types"; // TODO
import type { MoveT } from "moves/types"; // TODO

const _stateTags = (state: RootReducerStateT): TagsStateT => state.tags;

///////////////////////////////////////////////////////////////////////
// Tags
///////////////////////////////////////////////////////////////////////

const _createTagMap = (tags: Array<string>): TagMapT => {
  return tags.reduce((acc, tag) => {
    acc[tag] = true;
    return acc;
  }, ({}: TagMapT));
};

type TagsStateT = {
  moveTags: TagMapT,
  moveListTags: TagMapT,
};

export type ReducerStateT = TagsStateT;

function _addTags(listOfTagLists: Array<Array<TagT>>, tagMap: TagMapT) {
  return listOfTagLists.reduce(
    (acc, tags) => {
      tags.forEach(tag => {
        acc[tag] = true;
      });
      return acc;
    },
    { ...tagMap }
  );
}

export function tagsReducer(
  state: TagsStateT = {
    moveTags: {},
    moveListTags: {},
  },
  action: any
): TagsStateT {
  switch (action.type) {
    case "SET_MOVE_TAGS":
      return {
        ...state,
        moveTags: action.tags,
      };
    case "SET_MOVE_LIST_TAGS":
      return {
        ...state,
        moveListTags: action.tags,
      };
    case "ADD_MOVES":
      return {
        ...state,
        moveTags: _addTags(
          getObjectValues(action.moves).map(x => x.tags),
          state.moveTags
        ),
      };
    case "ADD_MOVE_LISTS":
      return {
        ...state,
        moveListTags: _addTags(
          getObjectValues(action.moveLists).map((x: MoveListT) => x.tags),
          state.moveListTags
        ),
      };
    default:
      return state;
  }
}

export const getMoveTags: Selector<Array<TagT>> = createSelector(
  [_stateTags],

  (stateTags): Array<TagT> => {
    return Object.keys(stateTags.moveTags);
  }
);
export const getMoveListTags: Selector<Array<TagT>> = createSelector(
  [_stateTags],

  (stateTags): Array<TagT> => {
    return Object.keys(stateTags.moveListTags);
  }
);

export const reducer = tagsReducer;

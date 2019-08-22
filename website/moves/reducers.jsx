// @flow

import { combineReducers, compose } from "redux";
import { createSelector } from "reselect";
import type {
  MoveByIdT,
  MoveT,
  MoveListT,
  MoveListByIdT,
  TipByIdT,
  TipsByIdT,
  VideoLinkByIdT,
  VideoLinksByIdT,
  MovePrivateDataByIdT,
  FunctionByIdT,
} from "moves/types";
import {
  reduceMapToMap,
  getObjectValues,
  querySetListToDict,
  insertIdsIntoList,
} from "utils/utils";
import { findMove, findMoveBySlugid } from "moves/utils";

import type { UUID } from "app/types";
import type { TagT, TagMapT } from "profile/types";
import type { RootReducerStateT, Selector } from "app/root_reducer";

///////////////////////////////////////////////////////////////////////
// Private state helpers
///////////////////////////////////////////////////////////////////////

const _stateMoves = (state: RootReducerStateT): MovesState => state.moves.moves;
const _stateMoveLists = (state: RootReducerStateT): MoveListsState =>
  state.moves.moveLists;
const _stateTags = (state: RootReducerStateT): TagsState => state.moves.tags;
const _stateTips = (state: RootReducerStateT): TipsState => state.moves.tips;
const _stateVideoLinks = (state: RootReducerStateT): VideoLinksState =>
  state.moves.videoLinks;
const _stateMovePrivateDatas = (
  state: RootReducerStateT
): MovePrivateDatasState => state.moves.movePrivateDatas;
const _stateSelection = (state: RootReducerStateT): SelectionState =>
  state.moves.selection;
const _stateMoveFilters = (state: RootReducerStateT): MoveFiltersState =>
  state.moves.moveFilters;
const _stateMoveListFilters = (
  state: RootReducerStateT
): MoveListFiltersState => state.moves.moveListFilters;

///////////////////////////////////////////////////////////////////////
// Selection
///////////////////////////////////////////////////////////////////////

type SelectionState = {
  highlightedMoveSlugid: string,
  moveListUrl: string,
};

export function selectionReducer(
  state: SelectionState = {
    highlightedMoveSlugid: "",
    moveListUrl: "",
  },
  action: any
): SelectionState {
  switch (action.type) {
    case "SET_HIGHLIGHTED_MOVE_SLUGID":
      return { ...state, highlightedMoveSlugid: action.moveSlugid };
    case "SET_SELECTED_MOVE_LIST_URL":
      return { ...state, moveListUrl: action.moveListUrl };
    default:
      return state;
  }
}

type MoveFiltersState = FunctionByIdT;

export function moveFiltersReducer(
  state: MoveFiltersState = {},
  action: any
): MoveFiltersState {
  switch (action.type) {
    case "SET_MOVE_FILTER":
      return { ...state, [action.filterName]: action.filter };
    default:
      return state;
  }
}

export const getHighlightedMoveSlugid = (state: RootReducerStateT) =>
  state.moves.selection.highlightedMoveSlugid;
export const getSelectedMoveListUrl = (state: RootReducerStateT) =>
  state.moves.selection.moveListUrl;
export const hasLoadedSelectedMoveList = (state: RootReducerStateT) =>
  state.app.status.loadedMoveListUrls.includes(
    state.moves.selection.moveListUrl
  );

type MoveListFiltersState = FunctionByIdT;

export function moveListFiltersReducer(
  state: MoveListFiltersState = {},
  action: any
): MoveListFiltersState {
  switch (action.type) {
    case "SET_MOVE_LIST_FILTER":
      return { ...state, [action.filterName]: action.filter };
    default:
      return state;
  }
}

///////////////////////////////////////////////////////////////////////
// Private data
///////////////////////////////////////////////////////////////////////

type MovePrivateDatasState = MovePrivateDataByIdT;

export function movePrivateDatasReducer(
  state: MovePrivateDatasState = {},
  action: any
): MovePrivateDatasState {
  switch (action.type) {
    case "SET_SIGNED_IN_EMAIL":
      return {};
    case "ADD_MOVE_PRIVATE_DATAS":
      return { ...state, ...action.movePrivateDatas };
    case "SET_MOVE_PRIVATE_DATAS":
      return { ...action.movePrivateDatas };
    default:
      return state;
  }
}

export const getPrivateDataByMoveId: Selector<MovePrivateDataByIdT> = createSelector(
  [_stateMovePrivateDatas],

  (stateMovePrivateDatas): MovePrivateDataByIdT => {
    return getObjectValues(stateMovePrivateDatas).reduce((acc, x) => {
      acc[x.moveId] = x;
      return acc;
    }, {});
  }
);

///////////////////////////////////////////////////////////////////////
// Moves
///////////////////////////////////////////////////////////////////////

type MovesState = MoveByIdT;

export function movesReducer(state: MovesState = {}, action: any): MovesState {
  switch (action.type) {
    case "ADD_MOVES":
      return {
        ...state,
        ...querySetListToDict(action.moves),
      };
    default:
      return state;
  }
}

export const getMoveById: Selector<MoveByIdT> = createSelector(
  [_stateMoves, _stateSelection, getPrivateDataByMoveId],

  (stateMoves, stateSelection, privateDataByMoveId): MoveByIdT => {
    return reduceMapToMap<MoveByIdT>(
      stateMoves,
      (acc, id: UUID, move: MoveT) => {
        acc[id] = {
          ...move,
          privateData: privateDataByMoveId[id] || {},
        };
      }
    );
  }
);
export const getMoves: Selector<Array<MoveT>> = createSelector(
  [getMoveById],

  (moveById): Array<MoveT> => {
    return getObjectValues(moveById);
  }
);

///////////////////////////////////////////////////////////////////////
// MoveList
///////////////////////////////////////////////////////////////////////

type MoveListsState = MoveListByIdT;

export function moveListsReducer(
  state: MoveListsState = {},
  action: any
): MoveListsState {
  switch (action.type) {
    case "ADD_MOVE_LISTS":
      return {
        ...state,
        ...action.moveLists,
      };
    case "INSERT_MOVES_INTO_LIST":
      const acc = insertIdsIntoList(
        action.moveIds,
        state[action.moveListId].moves,
        action.targetMoveId
      );
      return {
        ...state,
        [action.moveListId]: {
          ...state[action.moveListId],
          moves: acc,
        },
      };
    case "REMOVE_MOVES_FROM_LIST":
      const moves = state[action.moveListId].moves.filter(
        x => !action.moveIds.includes(x)
      );

      return {
        ...state,
        [action.moveListId]: {
          ...state[action.moveListId],
          moves: moves,
        },
      };

    default:
      return state;
  }
}

export const getMoveLists: Selector<Array<MoveListT>> = createSelector(
  [_stateMoveLists, _stateSelection],

  (stateMoveLists, stateSelection): Array<MoveListT> => {
    return getObjectValues(stateMoveLists);
  }
);
export const getMoveListById = _stateMoveLists;

///////////////////////////////////////////////////////////////////////
// Tags
///////////////////////////////////////////////////////////////////////

const _createTagMap = (tags: Array<string>): TagMapT => {
  return tags.reduce((acc, tag) => {
    acc[tag] = true;
    return acc;
  }, ({}: TagMapT));
};

type TagsState = {
  moveTags: TagMapT,
  moveListTags: TagMapT,
};

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
  state: TagsState = {
    moveTags: {},
    moveListTags: {},
  },
  action: any
): TagsState {
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

///////////////////////////////////////////////////////////////////////
// Videolinks
///////////////////////////////////////////////////////////////////////

type VideoLinksState = VideoLinkByIdT;

export function videoLinksReducer(
  state: VideoLinksState = {},
  action: any
): VideoLinksState {
  switch (action.type) {
    case "ADD_VIDEO_LINKS":
      return {
        ...state,
        ...action.videoLinks,
      };
    case "REMOVE_VIDEO_LINKS":
      return Object.keys(state)
        .filter(x => !action.videoLinks.includes(x))
        .reduce((acc, id) => {
          acc[id] = state[id];
          return acc;
        }, {});
    case "CAST_VOTE":
      if (!state[action.id]) return state;
      return {
        ...state,
        [action.id]: {
          ...state[action.id],
          voteCount:
            state[action.id].voteCount + (action.vote - action.prevVote),
        },
      };
    default:
      return state;
  }
}

export const getVideoLinksByMoveId: Selector<VideoLinksByIdT> = createSelector(
  [_stateMoves, _stateVideoLinks],

  (stateMoves, stateVideoLinks): VideoLinksByIdT => {
    return reduceMapToMap<VideoLinksByIdT>(stateMoves, (acc, moveId, move) => {
      acc[moveId] = getObjectValues(stateVideoLinks)
        .filter(videoLink => videoLink.moveId == moveId)
        .sort((lhs, rhs) => rhs.initialVoteCount - lhs.initialVoteCount);
    });
  }
);
export function getVideoLinkById(state: RootReducerStateT) {
  return state.moves.videoLinks;
}

///////////////////////////////////////////////////////////////////////
// Tips
///////////////////////////////////////////////////////////////////////

type TipsState = TipByIdT;

export function tipsReducer(state: TipsState = {}, action: any): TipsState {
  switch (action.type) {
    case "ADD_TIPS":
      return {
        ...state,
        ...action.tips,
      };
    case "REMOVE_TIPS":
      return Object.keys(state)
        .filter(x => !action.tips.includes(x))
        .reduce((acc, id) => {
          acc[id] = state[id];
          return acc;
        }, {});
    case "CAST_VOTE":
      if (!state[action.id]) return state;
      return {
        ...state,
        [action.id]: {
          ...state[action.id],
          voteCount:
            state[action.id].voteCount + (action.vote - action.prevVote),
        },
      };
    default:
      return state;
  }
}

export function getTipById(state: RootReducerStateT) {
  return state.moves.tips;
}
export const getTipsByMoveId: Selector<TipsByIdT> = createSelector(
  [_stateMoves, _stateTips],

  (stateMoves, stateTips): TipsByIdT => {
    return reduceMapToMap<TipsByIdT>(stateMoves, (acc, moveId, move) => {
      acc[moveId] = getObjectValues(stateTips)
        .filter(tip => tip.moveId == moveId)
        .sort((lhs, rhs) => rhs.initialVoteCount - lhs.initialVoteCount);
    });
  }
);

export type ReducerStateT = {
  moves: MovesState,
  moveFilters: MoveFiltersState,
  moveListFilters: MoveListFiltersState,
  moveLists: MoveListsState,
  selection: SelectionState,
  movePrivateDatas: MovePrivateDatasState,
  videoLinks: VideoLinksState,
  tips: TipsState,
  tags: TagsState,
};

// $FlowFixMe
export const reducer = combineReducers({
  moves: movesReducer,
  moveFilters: moveFiltersReducer,
  moveListFilters: moveListFiltersReducer,
  moveLists: moveListsReducer,
  selection: selectionReducer,
  movePrivateDatas: movePrivateDatasReducer,
  videoLinks: videoLinksReducer,
  tips: tipsReducer,
  tags: tagsReducer,
});

export const getFilteredMoveLists: Selector<Array<MoveListT>> = createSelector(
  [getMoveLists, _stateMoveListFilters],

  (moveLists, stateMoveListFilters): Array<MoveListT> => {
    const filters = getObjectValues(stateMoveListFilters);
    return filters.length ? compose(...filters)(moveLists) : moveLists;
  }
);

export const getSelectedMoveList: Selector<?MoveListT> = createSelector(
  [_stateSelection, getFilteredMoveLists],

  (stateSelection, moveLists): ?MoveListT => {
    const [ownerUsername, slug] = stateSelection.moveListUrl.split("/");
    const isMatch = x => x.ownerUsername == ownerUsername && x.slug == slug;
    return moveLists.find(isMatch);
  }
);

export const getMovesInList: Selector<Array<MoveT>> = createSelector(
  [getMoveById, getSelectedMoveList],

  (moveById, moveList): Array<MoveT> => {
    return moveList
      ? (moveList.moves || []).map(moveId => moveById[moveId]).filter(x => !!x)
      : [];
  }
);

export const getFilteredMovesInList: Selector<Array<MoveT>> = createSelector(
  [getMovesInList, _stateMoveFilters],

  (moves, stateMoveFilters): Array<MoveT> => {
    const filters = getObjectValues(stateMoveFilters);
    return filters.length ? compose(...filters)(moves) : moves;
  }
);

export const getHighlightedMove: Selector<MoveT> = createSelector(
  [_stateSelection, getFilteredMovesInList],
  (stateSelection, moves): MoveT => {
    return findMoveBySlugid(moves, stateSelection.highlightedMoveSlugid);
  }
);

// @flow

import { combineReducers } from "redux";
import { createSelector } from "reselect";
import type {
  MoveByIdT,
  MoveBySlugT,
  MoveT,
  MoveListT,
  MoveListByIdT,
  TipByIdT,
  TipsByIdT,
  TipT,
  VideoLinkByIdT,
  VideoLinksByIdT,
  VideoLinkT,
  MovePrivateDataByIdT,
} from "moves/types";
import type { UUID, TagT, TagMapT } from "app/types";
import type { InputSelector } from "reselect";
import {
  reduceMapToMap,
  getObjectValues,
  isNone,
  querySetListToDict,
  addToSet,
  insertIdsIntoList,
  splitIntoKeywords,
} from "utils/utils";
import { findMove } from "moves/utils";

///////////////////////////////////////////////////////////////////////
// Private state helpers
///////////////////////////////////////////////////////////////////////

const _stateMoves = (state: ReducerStateT): MovesState => state.moves;
const _stateMoveLists = (state: ReducerStateT): MoveListsState =>
  state.moveLists;
const _stateTags = (state: ReducerStateT): TagsState => state.tags;
const _stateTips = (state: ReducerStateT): TipsState => state.tips;
const _stateVideoLinks = (state: ReducerStateT): VideoLinksState =>
  state.videoLinks;
const _stateMovePrivateDatas = (state: ReducerStateT): MovePrivateDatasState =>
  state.movePrivateDatas;
const _stateSelection = (state: ReducerStateT): SelectionState =>
  state.selection;

///////////////////////////////////////////////////////////////////////
// Selection
///////////////////////////////////////////////////////////////////////

type SelectionState = {
  highlightedMoveSlugid: string,
  moveListUrl: string,
  moveFilterTags: Array<TagT>,
  moveFilterKeywords: Array<string>,
};

export function selectionReducer(
  state: SelectionState = {
    highlightedMoveSlugid: "",
    moveListUrl: "",
    moveFilterTags: [],
    moveFilterKeywords: [],
  },
  action: any
): SelectionState {
  switch (action.type) {
    case "SET_HIGHLIGHTED_MOVE_SLUGID":
      return { ...state, highlightedMoveSlugid: action.moveSlugid };
    case "SET_SELECTED_MOVE_LIST_URL":
      return { ...state, moveListUrl: action.moveListUrl };
    case "SET_MOVE_LIST_FILTER":
      return {
        ...state,
        moveFilterTags: action.tags,
        moveFilterKeywords: action.keywords,
      };
    default:
      return state;
  }
}

function _filterMoves(moves, tags, keywords) {
  function match(move) {
    const moveKeywords = splitIntoKeywords(move.name);
    return (
      (!tags.length || tags.every(tag => move.tags.includes(tag))) &&
      (!keywords.length ||
        keywords.every(
          keyword => move.name.toLowerCase().indexOf(keyword) >= 0
        ))
    );
  }

  return tags.length || keywords.length ? moves.filter(match) : moves;
}

export const getHighlightedMoveSlugid = (state: ReducerStateT) =>
  state.selection.highlightedMoveSlugid;
export const getSelectedMoveListUrl = (state: ReducerStateT) =>
  state.selection.moveListUrl;

///////////////////////////////////////////////////////////////////////
// Private data
///////////////////////////////////////////////////////////////////////

type MovePrivateDatasState = MovePrivateDataByIdT;

export function movePrivateDatasReducer(
  state: MovePrivateDatasState = {},
  action: any
): MovePrivateDatasState {
  switch (action.type) {
    case "ADD_MOVE_PRIVATE_DATAS":
      return { ...state, ...action.movePrivateDatas };
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
  [_stateMoves, getPrivateDataByMoveId],

  (stateMoves, privateDataByMoveId): MoveByIdT => {
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
  [_stateMoveLists],

  (stateMoveLists): Array<MoveListT> => {
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
export function getVideoLinkById(state: ReducerStateT) {
  return state.videoLinks;
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

export function getTipById(state: ReducerStateT) {
  return state.tips;
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
  moveLists: MoveListsState,
  selection: SelectionState,
  movePrivateDatas: MovePrivateDatasState,
  videoLinks: VideoLinksState,
  tips: TipsState,
  tags: TagsState,
};

export type Selector<TResult> = InputSelector<ReducerStateT, void, TResult>;

// $FlowFixMe
export const reducer = combineReducers({
  moves: movesReducer,
  moveLists: moveListsReducer,
  selection: selectionReducer,
  movePrivateDatas: movePrivateDatasReducer,
  videoLinks: videoLinksReducer,
  tips: tipsReducer,
  tags: tagsReducer,
});

export const getSelectedMoveList: Selector<?MoveListT> = createSelector(
  [_stateSelection, getMoveLists],

  (stateSelection, moveLists): ?MoveListT => {
    const [ownerUsername, slug] = stateSelection.moveListUrl.split("/");
    return moveLists.find(
      x => x.ownerUsername == ownerUsername && x.slug == slug
    );
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
  [getMovesInList, _stateSelection],

  (moves, stateSelection): Array<MoveT> => {
    return _filterMoves(
      moves,
      stateSelection.moveFilterTags,
      stateSelection.moveFilterKeywords
    );
  }
);

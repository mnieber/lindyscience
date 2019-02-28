// @flow

import { combineReducers } from 'redux'
import { createSelector } from 'reselect'
import type {
  MoveByIdT,
  MoveBySlugT,
  MoveT,
  MoveListT,
  MoveListByIdT,
  TagT,
  TagMapT,
  TipByIdT,
  TipsByIdT,
  TipT,
  VideoLinkByIdT,
  VideoLinksByIdT,
  VideoLinkT,
  MovePrivateDataByIdT,
} from 'moves/types'
import type { UUID } from 'app/types';
import type { InputSelector } from 'reselect';
import {
  reduceMapToMap,
  getObjectValues,
  isNone,
  querySetListToDict,
  addToSet
} from 'utils/utils'
import {
  findMove,
} from 'moves/utils'

///////////////////////////////////////////////////////////////////////
// Private state helpers
///////////////////////////////////////////////////////////////////////

const _stateMoves = (state: ReducerState): MovesState => state.moves;
const _stateMoveLists = (state: ReducerState): MoveListsState => state.moveLists;
const _stateTags = (state: ReducerState): TagsState => state.tags;
const _stateTips = (state: ReducerState): TipsState => state.tips;
const _stateVideoLinks = (state: ReducerState): VideoLinksState => state.videoLinks;
const _stateMovePrivateDatas = (state: ReducerState): MovePrivateDatasState => state.movePrivateDatas;
const _stateSelection = (state: ReducerState): SelectionState => state.selection;

///////////////////////////////////////////////////////////////////////
// Selection
///////////////////////////////////////////////////////////////////////

type SelectionState = {
  highlightedMoveSlugid: string,
  moveListUrl: string,
  moveFilterTags: Array<TagT>,
};

export function selectionReducer(
  state: SelectionState = {
    highlightedMoveSlugid: "",
    moveListUrl: "",
    moveFilterTags: [],
  },
  action: any
): SelectionState
{
  switch (action.type) {
    case 'SET_HIGHLIGHTED_MOVE_SLUGID':
      return { ...state,
        highlightedMoveSlugid: action.moveSlugid,
      }
    case 'SET_SELECTED_MOVE_LIST_URL':
      return { ...state,
        moveListUrl: action.moveListUrl,
      }
    case 'SET_MOVE_LIST_FILTER':
      return { ...state,
        moveFilterTags: action.tags
      }
    default:
      return state
  }
}

function _filterMovesByTags(moves, moveFilterTags) {
  function match(move) {
    return moveFilterTags.every(
      tag => (-1 != move.tags.indexOf(tag))
    );
  }

  return (moveFilterTags.length)
    ? moves.filter(match)
    : moves;
}

export const getHighlightedMoveSlugid = (state: ReducerState) => state.selection.highlightedMoveSlugid;

///////////////////////////////////////////////////////////////////////
// Moves
///////////////////////////////////////////////////////////////////////

type MovesState = MoveByIdT;

export function movesReducer(
  state: MovesState = {},
  action: any
): MovesState
{
  switch (action.type) {
    case 'ADD_MOVE_LISTS':
      return {
        ...state,
        ...action.moves
      };
    case 'UPDATE_MOVES':
      return {
        ...state,
        ...querySetListToDict(action.moves)
      };
    default:
      return state
  }
}

export const getMoveById: Selector<MoveByIdT> = createSelector(
  [_stateMoves, _stateMovePrivateDatas],

  (stateMoves, stateMovePrivateDatas): MoveByIdT => {
    return reduceMapToMap<MoveByIdT>(
      stateMoves,
      (acc, id: UUID, move: MoveT) => {
        acc[id] = {
          ...move,
          privateData: stateMovePrivateDatas[id] || {},
        }
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
export const getFilteredMoves: Selector<Array<MoveT>> = createSelector(
  [getMoves, _stateSelection],

  (moves, stateSelection): Array<MoveT> => {
    return _filterMovesByTags(moves, stateSelection.moveFilterTags);
  }
);

///////////////////////////////////////////////////////////////////////
// MoveList
///////////////////////////////////////////////////////////////////////

type MoveListsState = MoveListByIdT;

export function moveListsReducer(
  state: MoveListsState = {},
  action: any
): MoveListsState
{
  switch (action.type) {
    case 'ADD_MOVE_LISTS':
      return {
        ...state,
        ...action.moveLists
      }
    case 'INSERT_MOVES_INTO_LIST':
      const acc = state[action.moveListId].moves.reduce(
        (acc: Array<UUID>, moveId: UUID) => {
          if (!action.moveIds.includes(moveId)) {
            acc.push(moveId);
            if (moveId == action.targetMoveId) {
              acc.push(...action.moveIds);
            }
          }
          return acc;
        },
        !action.targetMoveId
          ? [...action.moveIds]
          : []
      );

      return {
        ...state,
        [action.moveListId]: {
          ...state[action.moveListId],
          moves: acc
        }
      }

    default:
      return state
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
// Private data
///////////////////////////////////////////////////////////////////////

type MovePrivateDatasState = MovePrivateDataByIdT;

export function movePrivateDatasReducer(
  state: MovePrivateDatasState = {},
  action: any
): MovePrivateDatasState
{
  switch (action.type) {
    case 'ADD_MOVE_PRIVATE_DATAS':
      return {...state,
        ...action.movePrivateDatas
    }
    default:
      return state
  }
}


///////////////////////////////////////////////////////////////////////
// Tags
///////////////////////////////////////////////////////////////////////

const _createTagMap = (tags: Array<string>): TagMapT => {
  return tags.reduce(
    (acc, tag) => {
      acc[tag] = true;
      return acc;
    },
    ({}: TagMapT)
  );
}

type TagsState = {
  moveTags: TagMapT,
  moveListTags: TagMapT,
};

function _addTags(listOfTagLists: Array<Array<TagT>>, tagMap: TagMapT) {
  return listOfTagLists.reduce(
    (acc, tags) => {
      tags.forEach(tag => {acc[tag] = true;});
      return acc;
    },
    {...tagMap}
  )
}

export function tagsReducer(
  state: TagsState = {
    moveTags: {},
    moveListTags: {},
  },
  action: any
): TagsState
{
  switch (action.type) {
    case 'ADD_MOVE_LISTS':
      return {
        ...state,
        moveTags: _addTags(
          getObjectValues(action.moves).map(x => x.tags),
          state.moveTags
        ),
        moveListTags: _addTags(
          getObjectValues(action.moveLists).map((x: MoveListT) => x.tags),
          state.moveListTags
        )
      }
    default:
      return state
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
): VideoLinksState
{
  switch (action.type) {
    case 'ADD_VIDEO_LINKS':
      return {
        ...state,
        ...action.videoLinks
      }
    case 'CAST_VOTE':
      if (!state[action.id]) return state;
      return {
        ...state,
        [action.id]: {
          ...state[action.id],
          voteCount: state[action.id].voteCount + (action.vote - action.prevVote),
        }
      }
    default:
      return state
  }
}

export const getVideoLinksByMoveId: Selector<VideoLinksByIdT> = createSelector(
  [_stateMoves, _stateVideoLinks],

  (stateMoves, stateVideoLinks): VideoLinksByIdT => {
    return reduceMapToMap<VideoLinksByIdT>(
      stateMoves,
      (acc, moveId, move) => {
        acc[moveId] = getObjectValues(stateVideoLinks)
          .filter(videoLink => (videoLink.moveId == moveId))
          .sort((lhs, rhs) => (rhs.initialVoteCount - lhs.initialVoteCount));
      }
    );
  }
);
export function getVideoLinkById(state: ReducerState) {
  return state.videoLinks;
}

///////////////////////////////////////////////////////////////////////
// Tips
///////////////////////////////////////////////////////////////////////

type TipsState = TipByIdT;

export function tipsReducer(
  state: TipsState = {},
  action: any
): TipsState
{
  switch (action.type) {
    case 'ADD_TIPS':
      return {
        ...state,
        ...action.tips
      }
    case 'CAST_VOTE':
      if (!state[action.id]) return state;
      return {
        ...state,
        [action.id]: {
          ...state[action.id],
          voteCount: state[action.id].voteCount + (action.vote - action.prevVote),
        }
      }
    default:
      return state
  }
}

export function getTipById(state: ReducerState) {
  return state.tips;
}
export const getTipsByMoveId: Selector<TipsByIdT> = createSelector(
  [_stateMoves, _stateTips],

  (stateMoves, stateTips): TipsByIdT => {
    return reduceMapToMap<TipsByIdT>(
      stateMoves,
      (acc, moveId, move) => {
        acc[moveId] = getObjectValues(stateTips)
          .filter(tip => (tip.moveId == moveId))
          .sort((lhs, rhs) => (rhs.initialVoteCount - lhs.initialVoteCount));
      }
    );
  }
);


type ReducerState = {
  moves: MovesState,
  moveLists: MoveListsState,
  selection: SelectionState,
  movePrivateDatas: MovePrivateDatasState,
  videoLinks: VideoLinksState,
  tips: TipsState,
  tags: TagsState,
};

export type Selector<TResult> = InputSelector<ReducerState, void, TResult>;

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
    const [ownerUsername, slug] = stateSelection.moveListUrl.split('/');
    return moveLists.find(
      x => (
        x.ownerUsername == ownerUsername &&
        x.slug == slug
      )
    )}
);

export const getSelectedMoveListId: Selector<UUID> = createSelector(
  [getSelectedMoveList],

  (selectedMoveList): UUID => selectedMoveList ? selectedMoveList.id : ""
);

export const getMovesInList: Selector<Array<MoveT>> = createSelector(
  [getMoveById, _stateMoveLists, getSelectedMoveList],

  (moveById, stateMoveLists, moveList): Array<MoveT> => {
    return moveList
      ? (moveList.moves || []).map(moveId => moveById[moveId])
      : [];
  }
);

export const getFilteredMovesInList: Selector<Array<MoveT>> = createSelector(
  [getMovesInList, _stateSelection],

  (moves, stateSelection): Array<MoveT> => {
    return _filterMovesByTags(moves, stateSelection.moveFilterTags);
  }
);

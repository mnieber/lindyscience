import type { VideoLinkByIdT, VideoLinksByIdT } from "screens/types";

import { isNone } from "utils/utils";

const _stateVideoLinks = (state: RootReducerStateT): VideoLinksState =>
  state.videoLinks;

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
  [_stateVideoLinks],

  (stateVideoLinks): VideoLinksByIdT => {
    return (
      reduceMapToMap <
      VideoLinksByIdT >
      (stateVideoLinks,
      (acc, videoLinkId, videoLink) => {
        if (isNone(acc[videoLink.moveId])) {
          acc[videoLink.moveId] = [];
        }
        acc[videoLink.moveId].push(videoLink);
        // TODO:
        // acc[videoLink.moveId] = acc[videoLink.moveId]
        //   .sort((lhs, rhs) => rhs.initialVoteCount - lhs.initialVoteCount);
      })
    );
  }
);

export function getVideoLinkById(state: RootReducerStateT) {
  return state.videoLinks;
}

export const reducer = videoLinksReducer;

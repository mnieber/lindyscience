// @flow

import * as React from "react";
import { compose } from "redux";

import Ctr from "screens/containers/index";

import Widgets from "screens/presentation/index";

import { VideoPlayer } from "video/presentation/video_player";

import { getId, createErrorHandler } from "app/utils";
import { querySetListToDict } from "utils/utils";
import { getVideoFromMove } from "moves/utils";

import type { MoveT } from "moves/types";
import type { TipT } from "tips/types";
import type { UUID } from "kernel/types";
import type { VoteT } from "votes/types";
import type { UserProfileT } from "profiles/types";
import type { VideoT } from "video/types";

type PropsT = {
  // receive any actions as well
};

// $FlowFixMe
export const withVideoPlayerPanel = getMove =>
  compose(
    Ctr.connect(state => ({}), Ctr.actions),
    (WrappedComponent: any) => (props: any) => {
      const { ...passThroughProps }: PropsT = props;
      const move: MoveT = getMove();

      const video: ?VideoT = move && move.link ? getVideoFromMove(move) : null;

      const videoPlayerPanel = video ? (
        <div className={"move__video panel"}>
          <VideoPlayer video={video} />
        </div>
      ) : (
        <React.Fragment />
      );

      return (
        <WrappedComponent
          videoPlayerPanel={videoPlayerPanel}
          {...passThroughProps}
        />
      );
    }
  );

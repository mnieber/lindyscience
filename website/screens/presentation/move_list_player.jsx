// @flow

import * as React from "react";

import { deepCopy } from "utils/utils";
import type { MoveT } from "moves/types";

// MoveListPlayer

type MoveListPlayerPropsT = {|
  moves: Array<MoveT>,
  sayMove: MoveT => void,
  className: string,
|};

export function MoveListPlayer(props: MoveListPlayerPropsT) {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [moveIdx, setMoveIdx] = React.useState(0);
  const [moves, setMoves] = React.useState([]);

  React.useEffect(() => {
    if (isPlaying && moves.length) {
      props.sayMove(moves[moveIdx % moves.length]);
      setTimeout(() => setMoveIdx((moveIdx + 1) % moves.length), 12000);
    }
  }, [isPlaying, moveIdx]);

  const playBtn = (
    <div
      key="playBtn"
      className={"moveListPlayer__playButton button button--wide"}
      onClick={() => {
        setMoveIdx(0);
        setMoves(deepCopy(props.moves));
        setIsPlaying(true);
      }}
    >
      Play moves
    </div>
  );

  const stopBtn = (
    <div
      key="stopBtn"
      className={"moveListPlayer__stopButton button button--wide"}
      onClick={() => {
        setIsPlaying(false);
      }}
    >
      Stop
    </div>
  );

  return [isPlaying ? stopBtn : playBtn];
}

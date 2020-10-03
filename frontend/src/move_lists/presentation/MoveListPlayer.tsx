import * as React from 'react';

import { MoveT } from 'src/moves/types';
import { deepCopy } from 'src/utils/utils';

// MoveListPlayer

type PropsT = {
  moves: Array<MoveT>;
  sayMove: (move: MoveT) => void;
  className: string;
};

export const MoveListPlayer: React.FC<PropsT> = (props) => {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [moveIdx, setMoveIdx] = React.useState(0);
  const [moves, setMoves] = React.useState([]);

  const { sayMove } = props;

  React.useEffect(() => {
    if (isPlaying && moves.length) {
      sayMove(moves[moveIdx % moves.length]);
      setTimeout(() => setMoveIdx((moveIdx + 1) % moves.length), 12000);
    }
  }, [isPlaying, moveIdx, moves, sayMove]);

  const playBtn = (
    <div
      key="playBtn"
      className={'moveListPlayer__playButton button button--wide'}
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
      className={'moveListPlayer__stopButton button button--wide'}
      onClick={() => {
        setIsPlaying(false);
      }}
    >
      Stop
    </div>
  );

  return <React.Fragment>{isPlaying ? stopBtn : playBtn}</React.Fragment>;
};

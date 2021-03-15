import { observer } from 'mobx-react';
import { useDefaultProps, FC } from 'react-default-props-context';
import { Highlight } from 'skandha-facets/Highlight';
import { Effect } from 'src/app/components/Effect';
import { MoveT } from 'src/moves/types';
import { findMoveBySlugid, makeSlugid } from 'src/app/utils';

type ArgsT = {
  move: MoveT | undefined;
};

type PropsT = {};

type DefaultPropsT = {
  moves: MoveT[];
  movesHighlight: Highlight;
};

export const SelectMoveEffect: FC<PropsT, DefaultPropsT> = observer(
  (p: PropsT) => {
    const props = useDefaultProps<PropsT, DefaultPropsT>(p);

    return (
      <Effect
        f={(args: ArgsT) => {
          if (args.move) {
            props.movesHighlight.highlightItem(args.move.id);
          }
        }}
        getArgs={(params): ArgsT => {
          return {
            move: findMoveBySlugid(
              props.moves,
              makeSlugid(params.moveSlug, params.moveId)
            ),
          };
        }}
      />
    );
  }
);

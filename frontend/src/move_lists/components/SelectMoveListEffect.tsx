import * as _ from 'lodash/fp';
import { observer } from 'mobx-react';
import { useDefaultProps, FC } from 'react-default-props-context';
import { Highlight } from 'facility-facets/Highlight';
import { Effect } from 'src/app/containers/Effect';
import { MoveListT } from 'src/move_lists/types';

type ArgsT = {
  moveList: MoveListT | undefined;
};

type PropsT = {};

type DefaultPropsT = {
  moveLists: MoveListT[];
  moveListsHighlight: Highlight;
};

export const SelectMoveListEffect: FC<PropsT, DefaultPropsT> = observer(
  (p: PropsT) => {
    const props = useDefaultProps<PropsT, DefaultPropsT>(p);

    return (
      <Effect
        f={(args: ArgsT) => {
          if (args.moveList) {
            props.moveListsHighlight.highlightItem(args.moveList.id);
          }
        }}
        getArgs={(params): ArgsT => {
          return {
            moveList: _.flow(
              _.always(props.moveLists),
              _.values,
              _.find(
                (x) =>
                  x.slug === params.moveListSlug &&
                  x.ownerUsername === params.ownerUsername
              )
            )(),
          };
        }}
      />
    );
  }
);

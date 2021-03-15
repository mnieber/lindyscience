import * as React from 'react';
import { observer } from 'mobx-react';

import { MoveListT } from 'src/movelists/types';
import { useDefaultProps, FC } from 'react-default-props-context';
import { Labelling } from 'skandha-facets/Labelling';

type PropsT = {};

type DefaultPropsT = {
  moveList: MoveListT;
  moveListsLabelling: Labelling;
};

export const FollowMoveListBtn: FC<PropsT, DefaultPropsT> = observer(
  (p: PropsT) => {
    const props = useDefaultProps<PropsT, DefaultPropsT>(p);

    const isFollowing = props.moveListsLabelling
      .ids('following')
      .includes(props.moveList.id);

    return (
      <div
        className={'FieldButton button--wide ml-2'}
        onClick={() =>
          props.moveListsLabelling.setLabel({
            label: 'following',
            id: props.moveList.id,
            flag: !isFollowing,
          })
        }
        key={2}
      >
        {isFollowing ? 'Stop following' : 'Follow'}
      </div>
    );
  }
);

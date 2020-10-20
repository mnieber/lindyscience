import { compose } from 'lodash/fp';
import * as React from 'react';
import { observer } from 'mobx-react';

import { MoveListT } from 'src/move_lists/types';
import {
  mergeDefaultProps,
  withDefaultProps,
  FC,
} from 'react-default-props-context';
import { Labelling } from 'facet-mobx/facets/labelling';

type PropsT = {};

type DefaultPropsT = {
  moveList: MoveListT;
  moveListsLabelling: Labelling;
};

export const FollowMoveListBtn: FC<PropsT, DefaultPropsT> = compose(
  withDefaultProps,
  observer
)((p: PropsT) => {
  const props = mergeDefaultProps<PropsT, DefaultPropsT>(p);

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
});

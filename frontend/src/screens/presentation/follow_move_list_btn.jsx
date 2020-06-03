// @flow

import { compose } from 'rambda';
import * as React from 'react';
import { observer } from 'mobx-react';

import type { MoveListT } from 'src/move_lists/types';
import { mergeDefaultProps, withDefaultProps } from 'src/mergeDefaultProps';
import { Labelling } from 'src/facet-mobx/facets/labelling';

type PropsT = {
  defaultProps?: any,
};

type DefaultPropsT = {
  moveList: MoveListT,
  moveListsLabelling: Labelling,
};

export const FollowMoveListBtn: (PropsT) => any = compose(
  withDefaultProps,
  observer
)((p: PropsT) => {
  const props: PropsT & DefaultPropsT = mergeDefaultProps(p);

  const isFollowing = props.moveListsLabelling
    .ids('following')
    .includes(props.moveList.id);

  return (
    <div
      className={'button button--wide ml-2'}
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

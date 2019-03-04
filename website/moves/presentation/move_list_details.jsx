// @flow

import * as React from 'react'
import classnames from 'classnames';
import type {
  MoveListT
} from 'moves/types'
import type { UserProfileT } from 'app/types';

// MoveListDetails

type MoveListDetailsPropsT = {|
  userProfile: UserProfileT,
  moveList: MoveListT,
|};

export function MoveListDetails(props: MoveListDetailsPropsT) {
  return (
    <div className={classnames("moveListDetails flex flex-col")}>
      <h1>{props.moveList.name}</h1>
      <p>{props.moveList.description}</p>
    </div>
  );
}

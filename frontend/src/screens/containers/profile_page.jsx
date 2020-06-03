// @flow

import * as React from 'react';

import { useParams } from 'src/utils/react_router_dom_wrapper';
import Widgets from 'src/screens/presentation/index';
import { getObjectValues } from 'src/utils/utils';
import { apiFindMoveLists } from 'src/screens/api';
import type { TagT } from 'src/tags/types';
import type { MoveListT } from 'src/move_lists/types';

type PropsT = {};

export function ProfilePage(props: PropsT) {
  const params = useParams();

  const [
    ownMoveLists: Array<MoveListT>,
    setOwnMoveLists: Function,
  ] = React.useState([]);
  async function _loadOwnMoveLists() {
    const moveLists = await apiFindMoveLists({
      ownerUsername: params.username || '',
    });
    setOwnMoveLists(getObjectValues(moveLists.entities.moveLists));
  }

  React.useEffect(() => {
    if (params.username) {
      _loadOwnMoveLists();
    }
  }, [params.username]);

  return (
    <div>
      <h1>{params.username}</h1>
      <h2>Move lists</h2>
      <Widgets.MoveListTable moveLists={ownMoveLists} />
    </div>
  );
}

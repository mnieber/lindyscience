// @flow

import * as React from 'react';

import { MoveListTable } from 'src/move_lists/presentation/MoveListTable';
import { useParams } from 'src/utils/react_router_dom_wrapper';
import { MoveListT } from 'src/move_lists/types';
import { apiFindMoveLists } from 'src/search/api';
import { getObjectValues } from 'src/utils/utils';

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
      <MoveListTable moveLists={ownMoveLists} />
    </div>
  );
}

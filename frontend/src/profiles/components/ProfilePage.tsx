import * as React from 'react';

import { MoveListTable } from 'src/movelists/components/MoveListTable';
import { useParams } from 'react-router-dom';
import { MoveListT } from 'src/movelists/types';
import { apiFindMoveLists } from 'src/search/api';
import { values } from 'lodash/fp';

type PropsT = {};

export function ProfilePage(props: PropsT) {
  const params: any = useParams();

  const [ownMoveLists, setOwnMoveLists]: [
    Array<MoveListT>,
    Function
  ] = React.useState([]);

  React.useEffect(() => {
    async function _loadOwnMoveLists() {
      const moveLists = await apiFindMoveLists({
        ownerUsername: params.username || '',
      });
      setOwnMoveLists(values(moveLists.entities.moveLists));
    }

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

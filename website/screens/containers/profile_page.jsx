// @flow

import * as React from "react";

import { useParams } from "utils/react_router_dom_wrapper";
import Ctr from "screens/containers/index";
import Widgets from "screens/presentation/index";
import { getObjectValues } from "utils/utils";
import { apiFindMoveLists } from "screens/api";
import type { TagT } from "tags/types";
import type { MoveListT } from "move_lists/types";

type ProfilePagePropsT = {
  moveListTags: Array<TagT>,
  moveLists: Array<MoveListT>,
};

export function ProfilePage(props: ProfilePagePropsT) {
  const params = useParams();

  const [
    ownMoveLists: Array<MoveListT>,
    setOwnMoveLists: Function,
  ] = React.useState([]);
  async function _loadOwnMoveLists() {
    const moveLists = await apiFindMoveLists({
      ownerUsername: params.username,
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

// $FlowFixMe
ProfilePage = Ctr.connect(state => ({
  moveLists: Ctr.fromStore.getMoveLists(state),
}))(ProfilePage);

export default ProfilePage;

// @flow

import * as React from "react";
import Ctr from "screens/containers/index";

import Widgets from "screens/presentation/index";
import { getObjectValues } from "utils/utils";

import { apiFindMoveLists } from "screens/api";

import type { UUID } from "kernel/types";
import type { UserProfileT } from "profiles/types";
import type { TagT } from "tags/types";
import type { MoveListT } from "move_lists/types";

type ProfilePagePropsT = {
  userProfile: UserProfileT,
  moveListTags: Array<TagT>,
  moveLists: Array<MoveListT>,
  ownerUsernamePrm: string,
};

export function ProfilePage(props: ProfilePagePropsT) {
  const [
    ownMoveLists: Array<MoveListT>,
    setOwnMoveLists: Function,
  ] = React.useState([]);
  async function _loadOwnMoveLists() {
    const moveLists = await apiFindMoveLists({
      ownerUsername: props.ownerUsernamePrm,
    });
    setOwnMoveLists(getObjectValues(moveLists.entities.moveLists));
  }

  React.useEffect(() => {
    if (props.ownerUsernamePrm) {
      _loadOwnMoveLists();
    }
  }, [props.ownerUsernamePrm]);

  return (
    <div>
      <h1>{props.ownerUsernamePrm}</h1>
      <h2>Move lists</h2>
      <Widgets.MoveListTable moveLists={ownMoveLists} />
    </div>
  );
}

// $FlowFixMe
ProfilePage = Ctr.connect(state => ({
  userProfile: Ctr.fromStore.getUserProfile(state),
  moveLists: Ctr.fromStore.getMoveLists(state),
}))(ProfilePage);

export default ProfilePage;

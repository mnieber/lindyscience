// @flow

import * as React from "react";
import Ctr from "screens/containers/index";

import Widgets from "screens/presentation/index";
import { getObjectValues } from "utils/utils";

import type { UUID } from "kernel/types";
import type { UserProfileT } from "profiles/types";
import type { TagT } from "tags/types";
import type { MoveListT } from "move_lists/types";
import type { MoveListCrudBvrsT } from "screens/types";

type ProfilePagePropsT = {
  userProfile: UserProfileT,
  moveListTags: Array<TagT>,
  moveLists: Array<MoveListT>,
  // receive any actions as well
};

export function ProfilePage(props: ProfilePagePropsT) {
  const [
    ownMoveLists: Array<MoveListT>,
    setOwnMoveLists: Function,
  ] = React.useState([]);
  const username = props.userProfile ? props.userProfile.username : "";

  async function _loadOwnMoveLists() {
    const moveLists = await Ctr.api.findMoveLists(username);
    setOwnMoveLists(getObjectValues(moveLists.entities.moveLists));
  }

  React.useEffect(() => {
    if (username) {
      _loadOwnMoveLists();
    }
  }, [username]);

  return (
    <div>
      <h1>{username}</h1>
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

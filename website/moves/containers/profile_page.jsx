// @flow

import * as React from "react";
import MovesCtr from "moves/containers/index";
import AppCtr from "app/containers/index";

import Widgets from "moves/presentation/index";
import { isOwner } from "app/utils";
import { getObjectValues } from "utils/utils";

import type { UserProfileT, TagT, UUID } from "app/types";
import type { MoveListT, MoveListCrudBvrsT } from "moves/types";

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
    const moveLists = await MovesCtr.api.findMoveLists(username);
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
ProfilePage = MovesCtr.connect(
  state => ({
    userProfile: AppCtr.fromStore.getUserProfile(state),
    moveLists: MovesCtr.fromStore.getMoveLists(state),
  }),
  {
    ...AppCtr.actions,
    ...MovesCtr.actions,
  }
)(ProfilePage);

export default ProfilePage;

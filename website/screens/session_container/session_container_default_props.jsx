// @flow

import { SessionContainer } from "screens/session_container/session_container";
import type { OwnedT } from "kernel/types";
import { isOwner } from "app/utils";

export function getSessionCtrDefaultProps(sessionCtr: SessionContainer) {
  return {
    userProfile: () => sessionCtr.inputs.userProfile,
    navigation: () => sessionCtr.navigation,
    display: () => sessionCtr.display,
    profiling: () => sessionCtr.profiling,
    sessionCtr: () => sessionCtr,
    isOwner: () => (x: OwnedT) => {
      const userProfile = sessionCtr.inputs.userProfile;
      return userProfile && isOwner(userProfile, x.ownerId);
    },
  };
}

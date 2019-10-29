// @flow

import { MoveListsContainer } from "screens/movelists_container/movelists_container";
import { Inputs } from "screens/session_container/facets/inputs";
import { SessionContainer } from "screens/session_container/session_container";
import { reaction } from "facet-mobx";

export const updateMoveListsCtrInputs = (ctr: SessionContainer) => {
  const inputs = Inputs.get(ctr);
  const moveListsCtr = MoveListsContainer.get(ctr);

  reaction(
    () => {
      const moveLists = inputs.moveLists;
      const userProfile = inputs.userProfile;
      return { moveLists, userProfile };
    },
    ({ moveLists, userProfile }) => {
      moveListsCtr.setInputs(moveLists, userProfile);
    }
  );
};

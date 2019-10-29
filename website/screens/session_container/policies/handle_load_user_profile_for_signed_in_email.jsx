// @flow

import { Inputs } from "screens/session_container/facets/inputs";
import { Profiling } from "screens/session_container/facets/profiling";
import { reaction } from "facet-mobx";
import { actSetUserProfile } from "profiles/actions";
import { actSetVotes } from "votes/actions";
import { actSetMovePrivateDatas } from "moves/actions";
import { apiLoadUserProfile } from "profiles/api";
import { apiLoadUserVotes } from "votes/api";
import { apiLoadUserTags } from "tags/api";
import { apiLoadMovePrivateDatas } from "moves/api";
import { apiFindMoveLists } from "screens/api";
import { actAddMoveLists } from "move_lists/actions";

export const handleLoadUserProfileForSignedInEmail = (ctr: any) => {
  const profiling = Profiling.get(ctr);
  const inputs = Inputs.get(ctr);
  const dispatch = inputs.dispatch;

  reaction(
    () => profiling.signedInEmail,
    async signedInEmail => {
      if (signedInEmail === "anonymous") {
        dispatch(actSetUserProfile(undefined));
        dispatch(actSetVotes({}));
        dispatch(actSetMovePrivateDatas({}));
      } else {
        const [profile, votes, tags, movePrivateDatas] = await Promise.all([
          apiLoadUserProfile(),
          apiLoadUserVotes(),
          apiLoadUserTags(),
          apiLoadMovePrivateDatas(),
        ]);

        dispatch(actSetUserProfile(profile));
        dispatch(actSetVotes(votes));
        dispatch(
          actSetMovePrivateDatas(
            movePrivateDatas.entities.movePrivateDatas || {}
          )
        );

        const moveLists = await apiFindMoveLists({
          followedByUsername: profile.username,
        });
        dispatch(actAddMoveLists(moveLists.entities.moveLists || {}));
      }
    },
    { name: "handleLoadUserProfileForSignedInEmail" }
  );
};

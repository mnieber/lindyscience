// @flow

import { Data } from 'src/session/facets/Data';
import { Inputs } from 'src/session/facets/Inputs';
import { Profiling } from 'src/session/facets/Profiling';
import { reaction } from 'src/utils/mobx_wrapper';
import { apiLoadUserProfile } from 'src/profiles/api';
import { apiLoadUserVotes } from 'src/votes/api';
import { apiLoadUserTags } from 'src/tags/api';
import { apiLoadMovePrivateDatas } from 'src/moves/api';
import { apiFindMoveLists } from 'src/search/api';

export const handleLoadUserProfileForSignedInEmail = (ctr: any) => {
  const profiling = Profiling.get(ctr);
  const inputs = Inputs.get(ctr);
  const data = Data.get(ctr);

  reaction(
    () => profiling.signedInEmail,
    async (signedInEmail) => {
      if (signedInEmail === 'anonymous') {
        profiling.setUserProfile(undefined);
        data.votesStore.setVotes({});
        data.movesStore.setMovePrivateDatas({});
      } else {
        const [profile, votes, tags, movePrivateDatas] = await Promise.all([
          apiLoadUserProfile(),
          apiLoadUserVotes(),
          apiLoadUserTags(),
          apiLoadMovePrivateDatas(),
        ]);

        profiling.setUserProfile(profile);
        data.votesStore.setVotes(votes);
        data.movesStore.setMovePrivateDatas(
          movePrivateDatas.entities.movePrivateDatas || {}
        );

        const moveLists = await apiFindMoveLists({
          followedByUsername: profile.username,
        });
        data.moveListsStore.addMoveLists(moveLists.entities.moveLists || {});
      }
    },
    { name: 'handleLoadUserProfileForSignedInEmail' }
  );
};

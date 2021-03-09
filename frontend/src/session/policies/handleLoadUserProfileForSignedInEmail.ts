import * as _ from 'lodash/fp';

import { updatedRS } from 'src/utils/RST';
import { Profiling } from 'src/session/facets/Profiling';
import { Authentication } from 'src/session/facets/Authentication';
import { apiLoadUserProfile } from 'src/profiles/api';
import { apiLoadUserVotes } from 'src/votes/api';
import { apiLoadMovePrivateDatas } from 'src/moves/api';
import { apiFindMoveLists } from 'src/search/api';
import { declareReaction } from 'facility-mobx';

export const handleLoadUserProfileForSignedInEmail = (ctr: any) => {
  const profiling = Profiling.get(ctr);
  const authentication = Authentication.get(ctr);

  declareReaction(
    ctr,
    () => authentication.signedInUserId,
    async (signedInUserId) => {
      if (signedInUserId === 'anonymous') {
        profiling.setUserProfile(undefined, updatedRS());
        ctr.votesStore.setVotes({});
        ctr.movesStore.setPrivateDataByMoveId({});
      } else {
        const [
          profile,
          votes,
          // tags,
          movePrivateDatas,
        ]: any = await Promise.all([
          apiLoadUserProfile(),
          apiLoadUserVotes(),
          // apiLoadUserTags(),
          apiLoadMovePrivateDatas(),
        ]);

        profiling.setUserProfile(profile, updatedRS());
        ctr.votesStore.setVotes(votes);
        ctr.movesStore.setPrivateDataByMoveId(
          _.flow(
            _.always(movePrivateDatas.entities.movePrivateDatas || {}),
            _.values,
            _.keyBy(_.property('moveId'))
          )()
        );

        const moveLists = await apiFindMoveLists({
          followedByUsername: profile.username,
        });
        ctr.moveListsStore.addMoveLists(moveLists.entities.moveLists || {});
      }
    },
    { name: 'handleLoadUserProfileForSignedInUserId' }
  );
};

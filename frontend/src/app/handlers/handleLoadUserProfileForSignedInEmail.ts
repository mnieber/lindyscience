import * as _ from 'lodash/fp';

import { AppStore } from 'src/app/AppStore';
import { updatedRS } from 'src/utils/RST';
import { apiLoadUserProfile } from 'src/profiles/api';
import { apiLoadUserVotes } from 'src/votes/api';
import { apiLoadMovePrivateDatas } from 'src/moves/api';
import { apiFindMoveLists } from 'src/search/api';

export const handleSignOut = (appStore: AppStore) => {
  appStore.profilingStore.setUserProfile(undefined, updatedRS());
  appStore.votesStore.setVotes({});
  appStore.movesStore.setPrivateDataByMoveId({});
};

export const handleLoadUserProfileForSignedInEmail = async (
  appStore: AppStore
) => {
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

  appStore.profilingStore.setUserProfile(profile, updatedRS());
  appStore.votesStore.setVotes(votes);
  appStore.movesStore.setPrivateDataByMoveId(
    _.flow(
      _.always(movePrivateDatas.entities.movePrivateDatas || {}),
      _.values,
      _.keyBy(_.property('moveId'))
    )()
  );

  const moveLists = await apiFindMoveLists({
    followedByUsername: profile.username,
  });
  appStore.moveListsStore.addMoveLists(moveLists.entities.moveLists || {});
};

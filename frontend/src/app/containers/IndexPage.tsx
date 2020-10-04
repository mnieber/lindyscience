import { compose } from 'lodash/fp';
import React from 'react';
import { observer } from 'mobx-react';

import { mergeDefaultProps, withDefaultProps } from 'src/npm/mergeDefaultProps';
import { UserProfileT } from 'src/profiles/types';
import { Navigation } from 'src/session/facets/Navigation';
import { helpUrl } from 'src/moves/utils';
import { browseToMoveUrl } from 'src/app/containers';

type PropsT = {};

type DefaultPropsT = {
  userProfile: UserProfileT;
  navigation: Navigation;
};

export const IndexPage = compose(
  withDefaultProps,
  observer
)((p: PropsT) => {
  const props: PropsT & DefaultPropsT = mergeDefaultProps(p);

  const { userProfile, navigation } = props;

  React.useEffect(() => {
    function _loadRecentMove() {
      const url =
        userProfile && userProfile.recentMoveUrl
          ? userProfile.recentMoveUrl
          : helpUrl.substr('/lists/'.length);
      if (navigation?.history) {
        browseToMoveUrl(navigation.history.push, [url], false);
      }
    }
    _loadRecentMove();
  }, [userProfile, navigation]);

  return <div className="h-full" />;
});

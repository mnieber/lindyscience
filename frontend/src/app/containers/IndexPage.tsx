import { compose } from 'lodash/fp';
import React from 'react';
import { observer } from 'mobx-react';

import { useDefaultProps, FC } from 'react-default-props-context';
import { UserProfileT } from 'src/profiles/types';
import { Navigation } from 'src/session/facets/Navigation';
import { helpUrl } from 'src/moves/utils';
import { browseToMoveUrl } from 'src/app/containers';

type PropsT = {};

type DefaultPropsT = {
  userProfile: UserProfileT;
  navigation: Navigation;
};

export const IndexPage: FC<PropsT, DefaultPropsT> = compose(observer)(
  (p: PropsT) => {
    const props = useDefaultProps<PropsT, DefaultPropsT>(p);

    const { userProfile, navigation } = props;

    React.useEffect(() => {
      function _loadRecentMove() {
        const url =
          userProfile && userProfile.recentMoveUrl
            ? userProfile.recentMoveUrl
            : helpUrl.substr('/lists/'.length);
        if (navigation.history) {
          browseToMoveUrl(navigation.history.push, [url], false);
        }
      }
      _loadRecentMove();
    }, [userProfile, navigation]);

    return <div className="h-full" />;
  }
);

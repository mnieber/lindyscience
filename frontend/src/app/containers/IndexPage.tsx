import React from 'react';
import { observer } from 'mobx-react';

import { helpUrl } from 'src/moves/utils';
import { browseToMoveUrl } from 'src/app/containers';
import { useStore } from 'src/app/components/StoreProvider';

export const IndexPage: React.FC = observer(() => {
  const { profilingStore, navigationStore } = useStore();

  React.useEffect(() => {
    function _loadRecentMove() {
      const url =
        profilingStore.userProfile && profilingStore.userProfile.recentMoveUrl
          ? profilingStore.userProfile.recentMoveUrl
          : helpUrl.substr('/lists/'.length);
      if (navigationStore.history) {
        browseToMoveUrl(navigationStore.history.push, [url], false);
      }
    }
    _loadRecentMove();
  }, [profilingStore.userProfile, navigationStore]);

  return <div className="h-full" />;
});

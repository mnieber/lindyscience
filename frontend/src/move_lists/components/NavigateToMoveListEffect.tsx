import React from 'react';

import { Effect } from 'src/app/containers/Effect';
import { useStore } from 'src/app/components/StoreProvider';

type ArgsT = {
  ownerUsername: string;
  moveListSlug: string;
};

export const NavigateToMoveListEffect: React.FC = () => {
  const { navigationStore } = useStore();

  return (
    <Effect
      f={(args: ArgsT) => {
        navigationStore.requestData({
          moveListUrl: args.ownerUsername + '/' + args.moveListSlug,
        });
      }}
      getArgs={(params): ArgsT => {
        return {
          ownerUsername: params.ownerUsername,
          moveListSlug: params.moveListSlug,
        };
      }}
    />
  );
};

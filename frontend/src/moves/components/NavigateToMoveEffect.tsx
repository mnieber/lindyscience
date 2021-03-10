import React from 'react';

import { Effect } from 'src/app/containers/Effect';
import { makeSlugid } from 'src/app/utils';
import { useStore } from 'src/app/components/StoreProvider';

type ArgsT = {
  ownerUsername: string;
  moveListSlug: string;
  moveSlug: string;
  moveSlugid: string;
  moveId: string;
};

export const NavigateToMoveEffect: React.FC = () => {
  const { navigationStore } = useStore();

  return (
    <Effect
      f={(args: ArgsT) => {
        navigationStore.requestData({
          moveSlugid: makeSlugid(args.moveSlug, args.moveId),
          moveListUrl: args.ownerUsername + '/' + args.moveListSlug,
        });
      }}
      getArgs={(params): ArgsT => {
        return {
          ownerUsername: params.ownerUsername,
          moveListSlug: params.moveListSlug,
          moveSlug: params.moveSlug,
          moveSlugid: params.moveSlugid,
          moveId: params.moveId,
        };
      }}
    />
  );
};

import React from 'react';

import { Navigation } from 'src/session/facets/Navigation';
import { Effect } from 'src/app/containers/Effect';
import { makeSlugid } from 'src/app/utils';
import { useDefaultProps, FC } from 'react-default-props-context';
import { SessionContainer } from 'src/session/SessionCtr';

type PropsT = {};

type DefaultPropsT = {
  sessionCtr: SessionContainer;
};

type ArgsT = {
  ownerUsername: string;
  moveListSlug: string;
  moveSlug: string;
  moveSlugid: string;
  moveId: string;
};

export const NavigateToMoveEffect: FC<PropsT, DefaultPropsT> = (p: PropsT) => {
  const props = useDefaultProps<PropsT, DefaultPropsT>(p);

  return (
    <Effect
      f={(args: ArgsT) => {
        const navigation = Navigation.get(props.sessionCtr);
        navigation.requestData({
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

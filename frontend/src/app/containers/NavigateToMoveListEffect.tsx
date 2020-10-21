import React from 'react';

import { SessionContainer } from 'src/session/SessionCtr';
import { Navigation } from 'src/session/facets/Navigation';
import { Effect } from 'src/app/containers/Effect';
import { useDefaultProps, FC } from 'react-default-props-context';

type PropsT = {};

type DefaultPropsT = {
  sessionCtr: SessionContainer;
};

type ArgsT = {
  ownerUsername: string;
  moveListSlug: string;
};

export const NavigateToMoveListEffect: FC<PropsT, DefaultPropsT> = (
  p: PropsT
) => {
  const props = useDefaultProps<PropsT, DefaultPropsT>(p);

  return (
    <Effect
      f={(args: ArgsT) => {
        const navigation = Navigation.get(props.sessionCtr);
        navigation.requestData({
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

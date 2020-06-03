// @flow

import React from 'react';
import { useHistory, useParams } from 'src/utils/react_router_dom_wrapper';

type PropsT = {
  to: string,
  children: any,
};

export const Link = (props: PropsT) => {
  const history = useHistory();
  return (
    <a href="#" onClick={() => history.push(props.to)}>
      {props.children}
    </a>
  );
};

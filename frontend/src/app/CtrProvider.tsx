import * as React from 'react';

import { NestedDefaultPropsProvider } from 'react-default-props-context';

export const CtrProvider: React.FC<any> = (props: any) => {
  const [ctr] = React.useState(props.createCtr);

  React.useEffect(() => {
    if (props.updateCtr) {
      props.updateCtr(ctr);
    }
  });

  return (
    <NestedDefaultPropsProvider value={props.getDefaultProps(ctr)}>
      {props.children}
    </NestedDefaultPropsProvider>
  );
};

import * as React from 'react';
import { observer } from 'mobx-react';

import { NestedDefaultPropsProvider } from 'src/mergeDefaultProps';

export const CtrProvider = observer((props) => {
  const [ctr, setCtr] = React.useState(props.createCtr);

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
});

import * as React from 'react';
import { observer } from 'mobx-react';

import { NestedDefaultPropsProvider } from 'src/npm/mergeDefaultProps';

export const CtrProvider: React.FC<any> = observer((props: any) => {
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
});

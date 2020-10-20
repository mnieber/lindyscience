import { compose } from 'lodash/fp';
import * as React from 'react';
import { observer } from 'mobx-react';

import { TipsStore } from 'src/tips/TipsStore';
import { MoveT } from 'src/moves/types';
import { TipsCtr } from 'src/tips/TipsCtr';
import { reaction } from 'src/utils/mobx_wrapper';
import { CtrProvider } from 'src/app/CtrProvider';
import {
  mergeDefaultProps,
  withDefaultProps,
} from 'react-default-props-context';

type PropsT = {
  children: any;
  defaultProps?: any;
};

type DefaultPropsT = {
  move: MoveT;
  tipsStore: TipsStore;
};

export const TipsCtrProvider: React.FC<PropsT> = compose(
  withDefaultProps,
  observer
)((p: PropsT) => {
  const props: PropsT & DefaultPropsT = mergeDefaultProps(p);
  const createCtr = () => {
    return new TipsCtr({ tipsStore: props.tipsStore });
  };

  const updateCtr = (ctr: TipsCtr) => {
    reaction(
      () => ({
        move: props.move,
      }),
      ({ move }) => {
        ctr.inputs.move = move;
      }
    );
  };

  const getDefaultProps = (ctr: TipsCtr) => {
    return {
      tips: () => ctr.outputs.display,
      tipsPreview: () => ctr.outputs.preview,
      tipsEditing: () => ctr.editing,
      tipsAddition: () => ctr.addition,
      tipsHighlight: () => ctr.highlight,
      tipsSelection: () => ctr.selection,
      tipsDeletion: () => ctr.deletion,
    };
  };

  return (
    <CtrProvider
      createCtr={createCtr}
      updateCtr={updateCtr}
      getDefaultProps={getDefaultProps}
      children={props.children}
    />
  );
});

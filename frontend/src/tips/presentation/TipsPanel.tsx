import * as React from 'react';
import classnames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusSquare } from '@fortawesome/free-regular-svg-icons';
import { Addition } from 'facility-mobx/facets/Addition';

import { useDefaultProps, FC } from 'react-default-props-context';
import { TipList } from 'src/tips/presentation/TipList';
import { useStore } from 'src/app/components/StoreProvider';

type PropsT = {};

type DefaultPropsT = {
  tipsAddition: Addition;
};

export const TipsPanel: FC<PropsT, DefaultPropsT> = (p: PropsT) => {
  const props = useDefaultProps<PropsT, DefaultPropsT>(p);
  const { profilingStore } = useStore();

  const addTipBtn = (
    <FontAwesomeIcon
      key={'edit'}
      className={classnames('ml-2', {
        'opacity-50': !profilingStore.userProfile,
      })}
      icon={faPlusSquare}
      onClick={() => props.tipsAddition.add({})}
    />
  );

  return (
    <div className={'TipsPanel panel'}>
      <div className={'TipsPanel__header mb-4'}>
        <h2 className="text-xl font-semibold">Tips</h2>
        {addTipBtn}
      </div>
      <TipList />
    </div>
  );
};

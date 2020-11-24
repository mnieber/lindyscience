import * as React from 'react';
import classnames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusSquare } from '@fortawesome/free-regular-svg-icons';
import { Addition } from 'facility-mobx/facets/Addition';

import { UserProfileT } from 'src/profiles/types';
import { useDefaultProps, FC } from 'react-default-props-context';
import { TipList } from 'src/tips/presentation/TipList';

type PropsT = {};

type DefaultPropsT = {
  userProfile?: UserProfileT;
  tipsAddition: Addition;
};

export const TipsPanel: FC<PropsT, DefaultPropsT> = (p: PropsT) => {
  const props = useDefaultProps<PropsT, DefaultPropsT>(p);

  const addTipBtn = (
    <FontAwesomeIcon
      key={'edit'}
      className={classnames('ml-2', { 'opacity-50': !props.userProfile })}
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

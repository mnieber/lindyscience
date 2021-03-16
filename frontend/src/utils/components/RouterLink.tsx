import React from 'react';
import classnames from 'classnames';
import { Link } from 'react-router-dom';

type PropsT = {
  to: string;
  className?: any;
};

export const RouterLink: React.FC<PropsT> = ({ children, to, className }) => {
  return (
    <Link className={classnames('ml-2', className)} to={to}>
      {children}
    </Link>
  );
};

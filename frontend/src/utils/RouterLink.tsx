import React from 'react';
import { Link } from 'react-router-dom';

type PropsT = {
  children: any;
  to: string;
};

export const RouterLink: React.FC<PropsT> = ({ children, to }) => {
  return (
    <Link className="ml-2" to={to}>
      {children}
    </Link>
  );
};

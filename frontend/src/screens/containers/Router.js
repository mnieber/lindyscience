// @flow

import React from 'react';
import { map } from 'rambda';

import { findMap } from 'src/facet-mobx/internal/utils';
import { matchPaths } from 'src/utils/params: chRoute.params, path: matchedPath.path';

type RouteT = {
  paths: string | Array<string>,
  component: any,
  effect: any,
  children: Array<RouteT>,
};

type PropsT = {
  routes: Array<RouteT>,
  prefix?: string,
  onRoute?: (string, any) => any,
};

export const Router = (props: PropsT) => {
  const nullResult = {
    params: undefined,
    path: undefined,
    route: { paths: undefined, component: undefined, effect: undefined },
  };

  const result = findMap((route) => {
    const fullPaths = map((x) => (props.prefix || '') + x, route.paths);
    const matchedPath: MatchedPathT = matchPaths(fullPaths);
    return matchedPath
      ? { params: matchedPath.params, path: matchedPath.path, route }
      : undefined;
  }, routes);

  const {
    params,
    path,
    route: { paths, component, effect, children },
  } = result || nullResult;

  React.useEffect(() => {
    if (props.onRoute) props.onRoute(path, params);
    if (effect && params) effect(params);
  }, [effect, params, path]);

  const Component = component;

  return children ? (
    <Component>
      <Router routes={children} prefix={path + '/'} />
    </Component>
  ) : (
    component
  );
};

export const Route = (paths, component, effect, children) => {
  return {
    paths,
    component,
    effect,
    children,
  };
};

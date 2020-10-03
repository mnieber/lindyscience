import {
  comparer, // $FlowFixMe
} from 'mobx';

export {
  observable,
  autorun,
  decorate,
  computed,
  extendObservable,
  action,
  set,
  runInAction,
  spy,
  intercept,
  reaction,
  toJS, // $FlowFixMe
} from 'mobx';

export const compareIfNotNull = (lhs: any, rhs: any) => {
  return rhs === null || comparer.structural(lhs, rhs);
};

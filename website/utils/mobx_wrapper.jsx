// @flow

import {
  observable as _observable,
  autorun as _autorun,
  decorate as _decorate,
  computed as _computed,
  extendObservable as _extendObservable,
  action as _action,
  set as _set,
  runInAction as _runInAction,
  spy as _spy,
  intercept as _intercept,
  reaction as _reaction,
  comparer as _comparer,
  toJS as _toJS,
  // $FlowFixMe
} from "mobx";

export const observable = _observable;
export const autorun = _autorun;
export const decorate = _decorate;
export const computed = _computed;
export const extendObservable = _extendObservable;
export const set = _set;
export const action = _action;
export const runInAction = _runInAction;
export const intercept = _intercept;
export const reaction = _reaction;
export const spy = _spy;
export const comparer = _comparer;
export const toJS = _toJS;

export const compareIfNotNull = (lhs: any, rhs: any) => {
  return rhs === null || comparer.structural(lhs, rhs);
};

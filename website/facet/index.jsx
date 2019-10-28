// @flow

import { Signal } from "micro-signals";

import { reaction } from "utils/mobx_wrapper";
import * as Internal from "facet/internal";
import { zip } from "utils/utils";

export type GetFacet<T> = (ctr: any) => T;
export type ClassT = any;
export type MemberNameT = string;
export type ClassMemberT = [ClassT, MemberNameT];
export type AdapterT = {
  [MemberNameT]: ClassMemberT,
};

export function facet(Inf: any) {
  return function(target: any, name: string, descriptor: any) {
    if (target[Inf[Internal.symbol]]) {
      console.warn(`Overwriting facet ${name} on ${target}`);
    }
    target[Inf[Internal.symbol]] = name;
    return descriptor;
  };
}

export function facetClass(target: any) {
  target[Internal.symbol] = Symbol(target.name);

  target.get = (ctr: any) => {
    const memberName = ctr[target[Internal.symbol]];
    if (!memberName) {
      console.error(`No interface ${target.name} in container`);
    }
    return ctr[memberName];
  };
  return target;
}

export function listen(target: any, memberName: string, callback: Function) {
  if (!target[memberName]) {
    console.error(`No member function ${memberName} in ${target}`);
  }
  if (!target[Internal.signals]) {
    target[Internal.signals] = {};
  }
  if (!target[Internal.signals][memberName]) {
    target[Internal.signals][memberName] = new Signal();
  }
  target[Internal.signals][memberName].add(callback);
}

export function operation(target: any, name: string, descriptor: any) {
  const f = descriptor.value;
  if (typeof f === "function") {
    descriptor.value = function(args) {
      f(this, args);
      if (this[Internal.signals] && this[Internal.signals][name]) {
        this[Internal.signals][name].dispatch(args);
      }
    };
  }
  return descriptor;
}

export function data(target: any, name: string, descriptor: any) {
  if (!target.constructor[Internal.datas]) {
    target.constructor[Internal.datas] = {};
  }
  target.constructor[Internal.datas][name] = true;
  return descriptor;
}

export const mapData = (
  [fromPolicy, fromMember]: ClassMemberT,
  [toPolicy, toMember]: ClassMemberT,
  transform: ?Function
) =>
  createPatch(toPolicy, [fromPolicy], (fromInstance: any) => ({
    // $FlowFixMe
    get [toMember]() {
      // TODO: check that fromMember is found
      const data = fromInstance[fromMember];
      return transform ? transform(data) : data;
    },
  }));

export const mapDatas = (
  fromPolicies: Array<ClassMemberT>,
  [toPolicy, toMember]: ClassMemberT,
  transform: Function
) => {
  const policies = fromPolicies.map(x => x[0]);
  const members = fromPolicies.map(x => x[1]);

  return createPatch(toPolicy, policies, (...fromInstances: Array<any>) => ({
    // $FlowFixMe
    get [toMember]() {
      const datas = zip(fromInstances, members).map(([instance, member]) => {
        // TODO: check that fromMember is found
        return instance[member];
      });
      return transform(...datas);
    },
  }));
};

export const relayData = (
  [fromPolicy, fromMember]: ClassMemberT,
  [toPolicy, toMember]: ClassMemberT,
  transform: ?Function,
  setter: ?Function
) => (ctr: any) =>
  reaction(
    () => fromPolicy.get(ctr)[fromMember],
    data => {
      const result = transform ? transform(data) : data;
      if (setter) {
        setter(result, toPolicy.get(ctr)[toMember]);
      } else {
        toPolicy.get(ctr)[toMember] = result;
      }
    },
    {
      name: `relayData from ${facetClassName(
        fromPolicy
      )}.${fromMember} to ${facetClassName(toPolicy)}.${toMember}`,
    }
  );

export const createPatch = Internal.createPatch;
export const facetClassName = Internal.facetClassName;
export const extendInterface = Internal.extendInterface;

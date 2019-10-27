// @flow

import { Signal } from "micro-signals";

import { extendObservable, reaction } from "utils/mobx_wrapper";
import { zip } from "utils/utils";

export type ClassT = any;
export type MemberNameT = string;
export type ClassMemberT = [ClassT, MemberNameT];
export type AdapterT = {
  [MemberNameT]: ClassMemberT,
};

const signals = Symbol("behaviourSignals");
const datas = Symbol("behaviourDatas");
const symbol = Symbol("behaviourSymbol");

export function behaviour(Inf: any) {
  return function(target: any, name: string, descriptor: any) {
    if (target[Inf[symbol]]) {
      console.warn(`Overwriting behaviour ${name} on ${target}`);
    }
    target[Inf[symbol]] = name;
    return descriptor;
  };
}

export function behaviour_impl(target: any, name: string) {
  target[symbol] = Symbol(name);

  target.get = (ctr: any) => {
    const memberName = ctr[target[symbol]];
    if (!memberName) {
      console.error(`No interface ${name} in container`);
    }
    return ctr[memberName];
  };
  return target;
}

export type GetBvrT<T> = (ctr: any) => T;

function _symbolName(symbol) {
  const prefix = "Symbol(";
  const chop = x =>
    x.startsWith(prefix) ? x.substring(prefix.length, x.length - 1) : x;
  return chop(symbol.toString());
}

export function behaviourClassName(Inf: any) {
  return _symbolName(Inf[symbol]);
}

export function behaviourInstanceName(inf: any) {
  return _symbolName(inf.constructor[symbol]);
}

export function extendInterface(intrface: any, members: any) {
  const behaviourName = behaviourInstanceName(intrface);
  const behaviourDatas = intrface.constructor[datas];

  for (const prop in members) {
    if (!prop.startsWith("_")) {
      if (!intrface.hasOwnProperty(prop)) {
        console.warn(
          `Patching a property ${prop} that doesn't exist in ${behaviourName}`
        );
      } else if (!(behaviourDatas && behaviourDatas[prop])) {
        console.error(
          `Patching a property ${prop} that wasn't decorated with @data in ${behaviourName}`
        );
      }
    }

    delete intrface[prop];
  }
  extendObservable(intrface, members);
}

export function createPatch(
  patchedInterfaceClass: ?any,
  otherInterfaceClasses: Array<any>,
  callback: (...any) => any
) {
  return (container: any) => {
    const otherInterfaces = otherInterfaceClasses.map(Inf =>
      Inf ? Inf.get(container) : container
    );
    const patch = callback.bind(this)(...otherInterfaces);

    if (patch && patchedInterfaceClass) {
      extendInterface(patchedInterfaceClass.get(container), patch);
    }
  };
}

export function createPatches(
  patchedInterfaceClasses: Array<any>,
  otherInterfaceClasses: Array<any>,
  callback: (...any) => Array<any>
) {
  return (container: any) => {
    const patchedInterfaces = patchedInterfaceClasses.map(Inf =>
      Inf.get(container)
    );
    const otherInterfaces = otherInterfaceClasses.map(Inf =>
      Inf ? Inf.get(container) : container
    );
    const patches = callback(...otherInterfaces);

    console.assert(patchedInterfaces.length == patches.length);

    zip(patchedInterfaces, patches).forEach(([intrface, patch]) => {
      extendInterface(intrface, patch);
    });
  };
}

export function listen(target: any, memberName: string, callback: Function) {
  if (!target[memberName]) {
    console.error(`No member function ${memberName} in ${target}`);
  }
  if (!target[signals]) {
    target[signals] = {};
  }
  if (!target[signals][memberName]) {
    target[signals][memberName] = new Signal();
  }
  target[signals][memberName].add(callback);
}

export function operation(target: any, name: string, descriptor: any) {
  const f = descriptor.value;
  if (typeof f === "function") {
    descriptor.value = function(args) {
      f(this, args);
      if (this[signals] && this[signals][name]) {
        this[signals][name].dispatch(args);
      }
    };
  }
  return descriptor;
}

export function data(target: any, name: string, descriptor: any) {
  if (!target.constructor[datas]) {
    target.constructor[datas] = {};
  }
  target.constructor[datas][name] = true;
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
      name: `relayData from ${behaviourClassName(
        fromPolicy
      )}.${fromMember} to ${behaviourClassName(toPolicy)}.${toMember}`,
    }
  );

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
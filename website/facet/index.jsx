// @flow

import { Signal } from "micro-signals";

import {
  options as _options,
  clearContext,
  getContext as _getContext,
  setContext,
} from "facet/internal/options";
import {
  log,
  opName,
  popCrumb,
  pushCrumb,
  facetName as _facetName,
  facetClassName as _facetClassName,
  withCrumb as _withCrumb,
} from "facet/internal/logging";
import { getOrCreate } from "facet/internal/utils";
import { symbols } from "facet/internal/symbols";

export type GetFacet<T> = (ctr: any) => T;
export type ClassT = any;
export type MemberNameT = string;
export type ClassMemberT = [ClassT, MemberNameT];
export type AdapterT = {
  [MemberNameT]: ClassMemberT,
};

export const options = _options;
export const getContext = _getContext;
export const withCrumb = _withCrumb;
export const facetName = _facetName;
export const facetClassName = _facetClassName;

export function facet(facetClass: any) {
  const facetSymbol = facetClass[symbols.symbol];

  return function(facetHost: any, facetMember: string, descriptor: any) {
    // Register the facet under the facet symbol
    if (facetHost[facetSymbol]) {
      console.warn(`Overwriting facet ${facetMember} on ${facetHost}`);
    }
    facetHost[facetSymbol] = facetMember;

    // Add the facetMember to the list of facetNembers
    const facetMembers = getOrCreate(
      facetHost.constructor,
      symbols.facetMembers,
      () => []
    );
    facetMembers.push(facetMember);

    return descriptor;
  };
}

export function facetClass(facetClass: any) {
  // Add a symbol member
  const symbol = Symbol(facetClass.name);
  facetClass[symbols.symbol] = symbol;

  // Add a get member function
  facetClass.get = (ctr: any) => {
    const facetMember = ctr[symbol];
    if (!facetMember) {
      console.error(`No interface ${facetClass.name} in container`);
    }
    return ctr[facetMember];
  };
  return facetClass;
}

export function listen(
  operationHost: any,
  operationMember: string,
  callback: Function
) {
  if (!operationHost[operationMember]) {
    console.error(`No member function ${operationMember} in ${operationHost}`);
  }
  const signals = getOrCreate(
    operationHost,
    symbols.operationSignals,
    () => ({})
  );
  const signal = getOrCreate(signals, operationMember, () => new Signal());

  const contextName = getContext().name;
  const ctr = getContext().ctr;

  signal.add(withCrumb(args => callback(...args)));
}

export function handle(
  operationHost: any,
  operationMember: string,
  callback: Function
) {
  if (!operationHost[operationMember]) {
    console.error(`No member function ${operationMember} in ${operationHost}`);
  }
  const handlers = getOrCreate(
    operationHost,
    symbols.operationHandlers,
    () => ({})
  );
  if (operationMember in handlers) {
    console.error(
      `Operation ${operationMember} in facet ${_facetName(
        operationHost
      )} already has a handler`
    );
  }
  handlers[operationMember] = callback;
}

export function operation(
  operationHost: any,
  operationMember: string,
  descriptor: any
) {
  const f = descriptor.value;
  if (typeof descriptor.value === "function") {
    descriptor.value = function(...args) {
      const facet = this;

      const altArgs = f.bind(this)(...args);
      if (altArgs != undefined) {
        args = altArgs;
      }

      if (options.logging) {
        const ctr = facet[symbols.parentContainer];
        log(ctr, operationMember, facet, args, true);
        pushCrumb(ctr, opName(operationMember));
      }

      const handlers = facet[symbols.operationHandlers];
      if (handlers && handlers[operationMember]) {
        return handlers[operationMember](...args);
      }

      const signals = facet[symbols.operationSignals];
      if (signals && signals[operationMember]) {
        signals[operationMember].dispatch(args);
      }

      if (options.logging) {
        const ctr = facet[symbols.parentContainer];
        popCrumb(ctr);
        log(ctr, operationMember, facet, args, false);
      }
    };
  }

  // Do some magic to ensure that the member function
  // is bound to it's host.
  // Copied from the bind-decorator npm package.
  return {
    configurable: true,
    get() {
      const bound = descriptor.value.bind(this);
      Object.defineProperty(this, operationMember, {
        value: bound,
        configurable: true,
        writable: true,
      });
      return bound;
    },
  };
}

export function data(dataHost: any, dataMember: string, descriptor: any) {
  const facetClass = dataHost.constructor;
  const datas = getOrCreate(facetClass, symbols.dataMembers, () => ({}));
  datas[dataMember] = true;
  return descriptor;
}

export const input = data;
export const output = data;

export function registerFacets(ctr: any) {
  const facetMembers = ctr.constructor[symbols.facetMembers];
  (facetMembers || []).forEach(
    member => (ctr[member][symbols.parentContainer] = ctr)
  );
}

export function installPolicies(policies: Array<Function>, ctr: any) {
  policies.forEach(policy => {
    setContext({
      name: policy.name,
      ctr: ctr,
    });
    policy(ctr);
    clearContext();
  });
}

export function installHandlers(handlers: Array<Function>, facet: any) {
  handlers.forEach(handler => {
    handler(facet);
  });
}

export function isDataMember(facetClass: any, prop: string) {
  const facetDatas = facetClass[symbols.dataMembers];
  return facetDatas && facetDatas[prop];
}

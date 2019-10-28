// @flow

import { extendObservable } from "utils/mobx_wrapper";
import { zip } from "utils/utils";

export const signals = Symbol("facetSignals");
export const datas = Symbol("facetDatas");
export const symbol = Symbol("facetSymbol");

function _symbolName(symbol) {
  const prefix = "Symbol(";
  const chop = x =>
    x.startsWith(prefix) ? x.substring(prefix.length, x.length - 1) : x;
  return chop(symbol.toString());
}

export function facetClassName(Inf: any) {
  return _symbolName(Inf[symbol]);
}

export function facetInstanceName(inf: any) {
  return _symbolName(inf.constructor[symbol]);
}

export function extendInterface(intrface: any, members: any) {
  const facetName = facetInstanceName(intrface);
  const facetDatas = intrface.constructor[datas];

  for (const prop in members) {
    if (!prop.startsWith("_")) {
      if (!intrface.hasOwnProperty(prop)) {
        console.warn(
          `Patching a property ${prop} that doesn't exist in ${facetName}`
        );
      } else if (!(facetDatas && facetDatas[prop])) {
        console.error(
          `Patching a property ${prop} that wasn't decorated with @data in ${facetName}`
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

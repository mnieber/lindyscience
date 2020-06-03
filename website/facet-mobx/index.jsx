// @flow

// $FlowFixMe
import { reaction as mobxReaction, extendObservable } from "mobx";

import {
  type ClassMemberT,
  facetClassName,
  facetName,
  isDataMember,
} from "facet";

const zip = (arr, ...arrs) => {
  return arr.map((val, i) => arrs.reduce((a, arr) => [...a, arr[i]], [val]));
};

export const relayData = (
  [fromFacetClass, fromMember]: ClassMemberT,
  [toFacetClass, toMember]: ClassMemberT,
  transform: ?Function,
  setter: ?Function
) => (ctr: any) =>
  mobxReaction(
    () => fromFacetClass.get(ctr)[fromMember],
    data => {
      const result = transform ? transform(data) : data;
      if (setter) {
        setter(result, toFacetClass.get(ctr)[toMember]);
      } else {
        toFacetClass.get(ctr)[toMember] = result;
      }
    },
    {
      name: `relayData from ${facetClassName(
        fromFacetClass
      )}.${fromMember} to ${facetClassName(toFacetClass)}.${toMember}`,
    }
  );

export function reaction(dataFn: Function, effectFn: Function, options: any) {
  return mobxReaction(dataFn, effectFn, options);
}

export function patchFacet(facet: any, members: any) {
  const facetClass = facet.constructor;

  for (const prop in members) {
    if (!prop.startsWith("_")) {
      if (!facet.hasOwnProperty(prop)) {
        console.warn(
          `Patching a property ${prop} that doesn't exist in ${facetName(
            facet
          )}`
        );
      } else if (!isDataMember(facetClass, prop)) {
        console.error(
          `Patching a property ${prop} that wasn't decorated with ` +
            `@data, @input or @output in ${facetName(facet)}`
        );
      }
    }

    delete facet[prop];
  }
  extendObservable(facet, members);
}

export function createPatch(
  patchedFacetClass: ?any,
  otherFacetClasses: Array<any>,
  callback: (...any) => any
) {
  return (ctr: any) => {
    const otherFacets = otherFacetClasses.map(facetClass =>
      facetClass ? facetClass.get(ctr) : ctr
    );
    const patch = callback.bind(this)(...otherFacets);

    if (patch && patchedFacetClass) {
      patchFacet(patchedFacetClass.get(ctr), patch);
    }
  };
}

export function createPatches(
  patchedFacetClasses: Array<any>,
  otherFacetClasses: Array<any>,
  callback: (...any) => Array<any>
) {
  return (ctr: any) => {
    const patchedFacets = patchedFacetClasses.map(facetClass =>
      facetClass.get(ctr)
    );
    const otherFacets = otherFacetClasses.map(facetClass =>
      facetClass ? facetClass.get(ctr) : ctr
    );
    const patches = callback(...otherFacets);

    console.assert(patchedFacets.length == patches.length);

    zip(patchedFacets, patches).forEach(([facet, patch]) => {
      patchFacet(facet, patch);
    });
  };
}

export const mapData = (
  [fromFacetClass, fromMember]: ClassMemberT,
  [toFacetClass, toMember]: ClassMemberT,
  transform: ?Function
) =>
  createPatch(toFacetClass, [fromFacetClass], (fromFacet: any) => ({
    // $FlowFixMe
    get [toMember]() {
      // TODO: check that fromMember is found
      const data = fromFacet[fromMember];
      return transform ? transform(data) : data;
    },
  }));

export const mapDatas = (
  sources: Array<ClassMemberT>,
  [toFacetClass, toMember]: ClassMemberT,
  transform: Function
) => {
  const fromFacetClasses = sources.map(x => x[0]);
  const fromMembers = sources.map(x => x[1]);

  return createPatch(
    toFacetClass,
    fromFacetClasses,
    (...fromFacets: Array<any>) => ({
      // $FlowFixMe
      get [toMember]() {
        const datas = zip(fromFacets, fromMembers).map(([facet, member]) => {
          // TODO: check that fromMember is found
          return facet[member];
        });
        return transform(...datas);
      },
    })
  );
};

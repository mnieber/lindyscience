// @flow

import { getOrCreate } from "facet/internal/utils";
import { options, getContext } from "facet/internal/options";
import { symbols, symbolName } from "facet/internal/symbols";

export function facetClassName(facetClass: any) {
  return symbolName(facetClass[symbols.symbol]);
}

export function facetName(facet: any) {
  return symbolName(facet.constructor[symbols.symbol]);
}

function camelToSnake(string) {
  return string
    .replace(/[\w]([A-Z])/g, function(m) {
      return m[0] + "_" + m[1];
    })
    .toLowerCase();
}

export const opName = (operationMember: string) =>
  camelToSnake(operationMember).toUpperCase();

export function log(
  ctr: any,
  operationMember: string,
  facet: any,
  args: any,
  start: boolean
) {
  const ctrName = ctr.constructor.name;
  const operationName = opName(operationMember);

  (console: any).log(
    "%c " +
      (start ? "Start " : "Finish") +
      " %c" +
      ctrName +
      "/" +
      facetName(facet) +
      ".%c" +
      operationName,
    "color: gray",
    "font-weight:bold; color: black",
    "color: blue"
  );
  (console: any).log("%c           args: ", "color: gray", args);
  const breadCrumb = ctr[symbols.breadcrumb];
  if (breadCrumb && breadCrumb.length) {
    (console: any).log("%c     breadcrumb: ", "color: gray", breadCrumb);
  }
  (console: any).log(
    "%c     " + (start ? "prev" : "next") + " state: ",
    "color: gray",
    containerState(ctr)
  );
}

export function containerState(ctr: any) {
  if (ctr) {
    return ctr.constructor[symbols.facetMembers].reduce((acc, facetMember) => {
      const facet = ctr[facetMember];
      const facetClass = facet.constructor;
      const facetDatas = facetClass[symbols.dataMembers];
      const facetState = facetDatas
        ? Object.keys(facetDatas).reduce((acc, dataMember) => {
            return {
              ...acc,
              [dataMember]: options.formatObject(facet[dataMember]),
            };
          }, {})
        : {};

      return { ...acc, [facetMember]: facetState };
    }, {});
  }
}

export function pushCrumb(ctr: any, name: string) {
  const breadCrumb = getOrCreate(ctr, symbols.breadcrumb, () => []);
  breadCrumb.push(name);
}

export function popCrumb(ctr: any) {
  ctr[symbols.breadcrumb].pop();
}

export function withCrumb(f: Function) {
  const contextName = getContext().name;
  const ctr = getContext().ctr;

  return options.logging && contextName && ctr
    ? (...args: any) => {
        pushCrumb(ctr, contextName);
        f(...args);
        popCrumb(ctr);
      }
    : f;
}

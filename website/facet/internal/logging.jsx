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
  const label =
    ("%c" + ctrName + "/" + facetName(facet) + ".%c" + operationName,
    "font-weight:bold; color: black",
    "color: blue");
  const labelAlt = ctrName + "/" + facetName(facet) + "." + operationName;

  if (start) {
    (console: any).groupCollapsed(labelAlt);
    (console: any).log("%c           args: ", "color: gray", args);
  }

  (console: any).log(
    "%c     " + (start ? "state" : "next"),
    "color: gray",
    containerState(ctr)
  );

  if (!start) {
    (console: any).groupEnd(labelAlt);
  }
}

export function containerState(ctr: any) {
  if (ctr) {
    return ctr.constructor[symbols.facetMembers].reduce((acc, facetMember) => {
      const facet = ctr[facetMember];
      const facetClass = facet.constructor;
      const facetDatas = facetClass[symbols.dataMembers];
      const facetState = facetDatas
        ? Object.keys(facetDatas).reduce((acc, dataMember) => {
            try {
              const data = options.formatObject(facet[dataMember]);
              return {
                ...acc,
                [dataMember]: data,
              };
            } catch {
              return acc;
            }
          }, {})
        : {};

      return { ...acc, [facetMember]: facetState };
    }, {});
  }
}

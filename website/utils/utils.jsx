// @flow

import React from "react";
import recase from "recase";

export function toCamelCase(obj: {}) {
  const r = recase.create({});
  return r.camelCopy(obj);
}

export function toSnakeCase(obj: {}) {
  const r = recase.create({});
  return r.snakeCopy(obj);
}

export function querySetListToDict(qsList: Array<any>, key: string = "id") {
  const result = {};
  qsList.forEach(item => {
    result[item[key]] = item;
  });
  return result;
}

export function toTitleCase(str: string) {
  return str.charAt(0).toUpperCase() + str.substr(1).toLowerCase();
}

export function isNone(x: any) {
  return typeof x == "undefined" || x === null;
}

export function stripTags(html: string) {
  var tmp = document.createElement("DIV");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
}

export function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
}

export function stripQuotes(value: string) {
  if (value.startsWith('"')) {
    value = value.substring(1);
  }
  if (value.endsWith('"')) {
    value = value.substring(0, value.length - 1);
  }
  return value;
}

export function deepCopy(obj: {} | Array<any>) {
  return JSON.parse(JSON.stringify(obj));
}

export function reduceMapToMap<T>(obj: {}, f: Function): T {
  return Object.entries(obj).reduce(
    (acc, [k, v]) => {
      f(acc, k, v);
      return acc;
    },
    // $FlowFixMe
    ({}: T)
  );
}

export function getObjectValues(obj: {}): any {
  return Object.keys(obj).map(x => obj[x]);
}

export function addToSet(array: Array<any>, item: any) {
  if (!array.includes(item)) {
    array.push(item);
  }
}

// Given a path ('/moveList/moves/*/tips/*/move') replaces
// the leaf (move) with move{Key} for each {Key} in the leaf.
export function flatten(
  obj: any,
  paths: Array<string>,
  maybeComposeKeys: ?Function
) {
  const composeKeys = maybeComposeKeys
    ? maybeComposeKeys
    : (pk, ck) => pk + toTitleCase(ck);

  function _flatObj(obj, key) {
    return Object.entries(obj[key]).reduce((acc, [k, v]) => {
      acc[composeKeys(key, k)] = v;
      return acc;
    }, {});
  }

  paths.forEach(path => {
    const xpath = path.split("/");
    function _flatten(obj, xpath) {
      const key = xpath.shift();
      // TODO(mnr): use /foo/?bar if bar might not be present
      if (key != "*" && !(key in obj)) {
        return;
      }

      if (xpath.length == 0) {
        const flatObj = _flatObj(obj, key);
        delete obj[key];
        Object.entries(flatObj).forEach(([k, v]) => {
          obj[k] = v;
        });
      } else {
        const childKeys = key == "*" ? Object.keys(obj) : [key];
        childKeys.forEach(childKey => _flatten(obj[childKey], [...xpath]));
      }
    }

    _flatten(obj, path.split("/").filter(x => !!x));
  });

  return obj;
}

export function urlParam(name: string) {
  var results = new RegExp("[?&]" + name + "=([^&#]*)").exec(
    window.location.href
  );
  return (results && results[1]) || undefined;
}

export function insertIdsIntoList(
  ids: Array<any>,
  idList: Array<any>,
  targetId: any
) {
  return idList.reduce(
    (acc: Array<any>, id: any) => {
      if (!ids.includes(id)) {
        acc.push(id);
        if (id == targetId) {
          acc.push(...ids);
        }
      }
      return acc;
    },
    !targetId ? [...ids] : []
  );
}

export function splitIntoKeywords(x: string) {
  // $FlowFixMe
  return x
    .toLowerCase()
    .replace(",", " ")
    .split(" ")
    .filter(x => !!x);
}

export function range(start: number, stop: number) {
  var ans = [];
  for (let i = start; i < stop; i++) {
    ans.push(i);
  }
  return ans;
}

export function isNonEmptyString(x: string) {
  return (x || "").trim() !== "";
}

export function truncDecimals(x: number, k: number) {
  const factor = Math.pow(10, k);
  return Math.trunc(x * factor) / factor;
}

export function roundDecimals(x: number, k: number) {
  const factor = Math.pow(10, k);
  return Math.round(x * factor) / factor;
}

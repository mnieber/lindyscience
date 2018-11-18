// @flow

import React from 'react'
import ReduxToastr, { toastr } from 'react-redux-toastr'
import recase from 'recase';
// $FlowFixMe
import 'react-redux-toastr/lib/css/react-redux-toastr.min.css'
import scrollIntoViewIfNeeded from 'scroll-into-view-if-needed'
import type { TagT } from 'moves/types'
import type { UUID } from 'app/types';


export function toCamelCase(obj: {}) {
  const r = recase.create({});
  return r.camelCopy(obj);
}

export function toSnakeCase(obj: {}) {
  const r = recase.create({});
  return r.snakeCopy(obj);
}

export function createToastr() {
  return <ReduxToastr
    timeOut={4000}
    newestOnTop={false}
    preventDuplicates
    transitionIn="fadeIn"
    transitionOut="fadeOut"
    progressBar={false}
  />
}

export function querySetListToDict(qsList: Array<any>, key: string='id') {
  const result = {};
  qsList.forEach(item => {
    result[item[key]] = item;
  })
  return result;
}

export function toTitleCase(str: string)
{
  return str.charAt(0).toUpperCase() + str.substr(1).toLowerCase();
}

export function isNone(x: any) {
  return typeof x == 'undefined' || x === null
}

export function stripTags(html: string)
{
   var tmp = document.createElement("DIV");
   tmp.innerHTML = html;
   return tmp.textContent || tmp.innerText || "";
}

export function slugify(text: string)
{
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

export function stripQuotes(value: string) {
  if (value.startsWith('"')) {
    value = value.substring(1)
  }
  if (value.endsWith('"')) {
    value = value.substring(0, value.length - 1);
  }
  return value;
}

export function deepCopy(obj: {})
{
  return JSON.parse(JSON.stringify(obj))
}

export function reduceMapToMap<T>(obj: {}, f: Function): T {
  return Object.entries(obj).reduce(
    (acc, [k, v]) => {
      f(acc, k, v);
      return acc;
    },
    // $FlowFixMe
    ({} : T)
  );
}

export function getObjectValues(obj: {}) : any {
  return Object.keys(obj).map(x => obj[x]);
}

export function pickNeighbour(
  allItems: Array<any>,
  pickedItemId: UUID,
  isForward: boolean,
  pickItemById: Function
) {
    const idx = allItems.findIndex(
      (c) => c.id === pickedItemId
    );

    if (isForward && idx + 1 < allItems.length) {
      pickItemById(allItems[idx+1].id);
      return true;
    }
    if (!isForward && idx - 1 >= 0) {
      pickItemById(allItems[idx-1].id);
      return true;
    }
    return false;
}

export function handleSelectionKeys(
  e: any,
  targetId: UUID,
  allItems: Array<any>,
  selectedItemId: UUID,
  selectItemById: Function
)
{
  if (targetId && e.target.id !== targetId) {
    return false;
  }

  const up = 38;
  const down = 40;
  if([up, down].indexOf(e.keyCode) > -1) {
    e.stopPropagation();
    if (pickNeighbour(
      allItems, selectedItemId, e.keyCode == down, selectItemById
    )) {
      e.preventDefault();
    }
    return true;
  }

  const pageUp = 33;
  const pageDown = 34;
  if([pageUp, pageDown].indexOf(e.keyCode) > -1) {
    e.preventDefault();
    e.stopPropagation();
    return true;
  }

  return false;
}

export function scrollIntoView(elm: any, boundary: any) {
  if (elm) {
    return scrollIntoViewIfNeeded(elm, { block: 'nearest', boundary: boundary })
  }
}

export function tagStringToTags(tagString: string): Array<TagT> {
  return tagString
    .split(',')
    .map(x => stripQuotes(x.trim()))
    .filter(x => !!x);
}

export function createErrorHandler(msg: string) {
  return function(e: any) {
    console .log(msg, e);
    toastr.error("Oops!", msg);
  }
}

export function addToSet(array: Array<any>, item: any) {
  if (!array.includes(item)) {
    array.push(item);
  }
}

// Given a path ('/moveList/moves/*/videoLinks/*/move') replaces
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
    return Object.entries(obj[key]).reduce(
      (acc, [k, v]) => {
        acc[composeKeys(key, k)] = v;
        return acc;
      },
      {}
    )
  }

  paths.forEach(path => {
    const xpath = path.split('/');
    function _flatten(obj, xpath) {
      const key = xpath.shift();
      // TODO(mnr): use /foo/?bar if bar might not be present
      if (key != '*' && !(key in obj)) {
        return;
      }

      if (xpath.length == 0) {
        const flatObj = _flatObj(obj, key);
        delete obj[key];
        Object.entries(flatObj).forEach(([k, v]) => {obj[k] = v;});
      }
      else {
        const childKeys = (key == '*') ? Object.keys(obj) : [key];
        childKeys.forEach(
          childKey => _flatten(obj[childKey], [...xpath])
        );
      }
    }

    _flatten(obj, path.split('/').filter(x => !!x));
  })

  return obj;
}

export function urlParam(name: string) {
    var results = new RegExp('[\?&]' + name + '=([^&#]*)')
                      .exec(window.location.href);
    return (results && results[1]) || undefined;
}

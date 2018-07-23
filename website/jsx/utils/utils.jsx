import React from 'react'
import ReduxToastr from 'react-redux-toastr'
import recase from 'recase';
import 'react-redux-toastr/lib/css/react-redux-toastr.min.css'


export function toCamelCase(obj) {
  const r = recase.create({});
  return r.camelCopy(obj);
}

export function toSnakeCase(obj) {
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

export function querySetListToDict(qsList) {
  const result = {};
  qsList.forEach(item => {
    result[item.id] = item;
  })
  return result;
}

export function toTitleCase(str)
{
  return str.charAt(0).toUpperCase() + str.substr(1).toLowerCase();
}

export function isNone(x) {
  return typeof x == 'undefined' || x === null
}

export function stripTags(html)
{
   var tmp = document.createElement("DIV");
   tmp.innerHTML = html;
   return tmp.textContent || tmp.innerText || "";
}

export function slugify(text)
{
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

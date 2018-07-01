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
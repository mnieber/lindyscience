import { map } from 'lodash/fp';
import { toJS } from 'mobx';

const is_logging = process.env.NODE_ENV === 'development';

export function log(...args: any[]) {
  if (is_logging) {
    console.log(...args);
  }
}

export function logJS(...args: any[]) {
  if (is_logging) {
    console.log(...map(toJS, args));
  }
}

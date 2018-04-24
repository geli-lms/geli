import {IProperties} from '../../../shared/models/IProperties';

function only(keys: Array<string>, from: IProperties, to: IProperties = {}) {
  for (const key of keys) {
    to[key] = from[key];
  }
  return to;
}

function asEmpty(keys: Array<string>, from: IProperties, to: IProperties = {}) {
  for (const key of keys) {
    const value = from[key];
    if (Array.isArray(value)) {
      to[key] = [];
    } else if (value instanceof Object) {
      to[key] = {};
    }
  }
  return to;
}

export default {only, asEmpty};

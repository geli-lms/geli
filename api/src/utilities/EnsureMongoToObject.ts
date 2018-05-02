import {DocumentToObjectOptions, Document} from 'mongoose';

type Model<T> = T & Document;

/**
 * Either calls the mongoose toObject function and returns the result, or simply returns the input.
 *
 * @param from A mongoose object with toObject function or any other object already returned by toObject (or similar).
 * @param options Optional mongoose toObject options.
 */
export function ensureMongoToObject<T extends Object>(from: T | Model<T>, options?: DocumentToObjectOptions): T {
  if ('toObject' in from && typeof from.toObject === 'function') {
    return from.toObject(options);
  } else {
    return from;
  }
}

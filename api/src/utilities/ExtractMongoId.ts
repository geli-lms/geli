type implReturn<T> = T | string | undefined;

/**
 * Tries to extract the id as string from any mongoose object.
 * This could be a node-mongodb-native ObjectID (i.e. mongoose.Types.ObjectId), via toHexString,
 * or anything that contains an 'id' property, which is directly returned.
 *
 * Any string input is assumed to be an ID and will be returned as string.
 *
 * @param from A mongoose object or id string.
 * @param fallback Return this if no id is found.
 */
function extractMongoIdImpl<T>(from: any, fallback?: T): implReturn<T> {
  if (typeof from === 'string' || from instanceof String) {
    return from.toString();
  } else if (from instanceof Object) {
    if (from._bsontype === 'ObjectID') {
      return from.toString();
    } else if ('id' in from) {
      return from.id;
    }
  }
  return fallback;
}

/**
 * Tries to extract the id as string from any mongoose object or array of such.
 * This could be a node-mongodb-native ObjectID (i.e. mongoose.Types.ObjectId), via toHexString,
 * or anything that contains an 'id' property, which is directly returned.
 * For arrays, anything === undefined won't be pushed.
 *
 * Any string input (or string array content) is assumed to be an ID.
 *
 * @param from A mongoose object, id string, or (possibly mixed) array of such.
 * @param fallback Return this if no id is found.
 */
export function extractMongoId<T>(from: any | any[], fallback?: T): implReturn<T> | (T | string)[] {
  if (Array.isArray(from)) {
    const results: any[] = [];
    for (const value of from) {
      const result = extractMongoIdImpl(value, fallback);
      if (result !== undefined) {
        results.push(result);
      }
    }
    return results;
  } else {
    return extractMongoIdImpl(from, fallback);
  }
}

/**
 * Tries to extract the id as string from any mongoose object.
 * This could be a node-mongodb-native ObjectID (i.e. mongoose.Types.ObjectId), via toHexString,
 * or anything that contains an 'id' property, which is directly returned.
 *
 * @param from A mongoose object or id string.
 */
export function extractSingleMongoId(from: any): string | undefined {
  return extractMongoIdImpl(from);
}

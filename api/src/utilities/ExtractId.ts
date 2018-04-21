/**
 * Tries to extract the id from a mongoose object.
 * This could be a node-mongodb-native ObjectID (i.e. mongoose.Types.ObjectId), via toHexString,
 * or anything that contains an 'id' property, which is directly returned.
 *
 * @param from A mongoose object.
 * @param fallback Return this if no id is found.
 */
function extractIdImpl(from: any, fallback?: any) {
  if (from instanceof Object) {
    if (from._bsontype === 'ObjectID') {
      return from.toString();
    } else if ('id' in from) {
      return from.id;
    }
  }
  return fallback;
}

/**
 * Tries to extract the id from a mongoose object or array of such.
 * This could be a node-mongodb-native ObjectID (i.e. mongoose.Types.ObjectId), via toHexString,
 * or anything that contains an 'id' property, which is directly returned.
 * For arrays, anything === undefined won't be pushed.
 *
 * @param from A mongoose object or array of such.
 * @param fallback Return this if no id is found.
 */
export function extractId(from: any | any[], fallback?: any) {
  if (Array.isArray(from)) {
    const results: any[] = [];
    for (const value of from) {
      const result = extractIdImpl(value, fallback);
      if (result !== undefined) {
        results.push(result);
      }
    }
    return results;
  } else {
    return extractIdImpl(from, fallback);
  }
}

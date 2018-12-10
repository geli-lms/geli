import config from '../config/main';
const fs = require('fs');

const cache = require('node-file-cache').create({life: config.timeToLiveCacheValue});


class CacheService {

  constructor() {
    setInterval(this.cleanupCache, config.timeToLiveCacheValue * 60);
  }

  public getCacheEntry(hash: any) {
    return cache.get(hash);
  }

  public setCacheEntry(key: any, value: any) {
    cache.set(key, value);
  }


  cleanupCache() {
    cache.expire((record: any) => {
      return new Promise((resolve, reject) => {
        fs.unlink( config.tmpFileCacheFolder + record.key + '.zip', (err: Error) => {
          if (err) {
            reject(false);
          } else {
            resolve(true);
          }
        });
      });
    });
  }
}

export default new CacheService();

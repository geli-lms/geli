// tslint:disable:no-console

import * as mongoose from 'mongoose';
import {MigrationHandler} from './migrations/MigrationHandler';

if (process.argv.length === 3) {
  console.log('Print help');
  process.exit(0);
} else if (process.argv.length > 3) {
  const args = process.argv;
  const upIndex = args.indexOf('--up');

  const upScripts = [];
  let i = upIndex + 1;
  while (i < args.length) {
    upScripts.push(args[i]);
    i++;
  }
  const migrationHandler = new MigrationHandler();
  migrationHandler.up(upScripts)
    .then((res) => {
      console.log(res);
      console.log('Disconnect');
      mongoose.disconnect();
    });
}


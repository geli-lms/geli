// tslint:disable:no-console
import config from '../config/main';
import * as mongoose from 'mongoose';

const fs = require('fs');

export class MigrationHandler {

  private databaseConnection: any;
  private scripts: any = {};

  constructor() {
    (<any>mongoose).Promise = global.Promise;

    if (!mongoose.connection.readyState) {
      this.databaseConnection = mongoose.connect(config.database);
    }

    fs.readdirSync(__dirname + '/scripts').forEach((file: string) => {
      try {
        const requiredFile = require('./scripts/' + file);
        const filename = file.split('.')[0];
        this.scripts[filename] = new requiredFile();
      } catch (error) {
        console.log('The file ' + file + ' is missing a class definition.');
        console.log(error);
        return false;
      }
    });
  }

  public async up(scripts: string[]) {
    const upPromises: Promise<any>[] = [];
    scripts.forEach((script) => {
      if (this.scripts.hasOwnProperty(script)) {
        upPromises.push(this.scripts[script].up());
      } else {
        console.log('No migration script ' + script + ' was found!');
      }
    });

    return await Promise.all(upPromises);
  }

  public down(scriptName: string) {
  }

  private handleNotFound(script: string): boolean {
    console.log('The file ' + script + '.js does not exist.');
    return false;
  }

  private requireForce(path: string) {
    try {
      return require(path);
    } catch (e) {
      console.log('The file ' + path + '.js does not exist.');
      return false;
    }
  }
}

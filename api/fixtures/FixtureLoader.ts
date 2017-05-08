import * as mongoose from 'mongoose';
import config from '../src/config/main';

import {userFixtures} from './userFixtures';
import {courseFixtures} from './courseFixtures';
import {IFixture} from './IFixture';


export class FixtureLoader {

  private fixtures: Array<IFixture> = [
    userFixtures,
    courseFixtures
  ];

  constructor() {
    (<any>mongoose).Promise = global.Promise;

    if (!mongoose.connection.readyState) {
      mongoose.connect(config.database);
    }
  }

  load() {
    return mongoose.connection.dropDatabase()
      .then(() =>
        Promise.all(
          this.fixtures.map((modelFixtures) =>
            Promise.all(
              modelFixtures.data.map((element) =>
                new modelFixtures.Model(element).save()
              )
            )
          )
        ));
  }
}

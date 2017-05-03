import {FixtureLoader} from './FixtureLoader';
import * as mongoose from 'mongoose';

new FixtureLoader()
  .load()
  .then(() => mongoose.disconnect())
  .then(() => console.log('Fixtures loaded'))
  .catch((error) => console.error('Error loading fixtures', error))
;

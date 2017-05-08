import * as mongoose from 'mongoose';

export interface IFixture {
  Model: mongoose.Model<mongoose.Document>;
  data: Array<any>;
}

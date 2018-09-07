import {IPage} from '../../../shared/models/IPage';
import * as mongoose from 'mongoose';

interface IPageModel extends IPage, mongoose.Document {
}

const pageSchema = new mongoose.Schema({
    path: {
      type: String,
      unique: true,
      required: true
    },
    title: {
      type: String
    },
    content: {
      type: String
    },
    accessLevel: {
      type: String,
      required: true
    },
    language: {
      type: String
    }
  },
  {
    timestamps: true,
    toObject: {
      transform: function (doc: IPageModel, ret: any) {
        ret._id = ret._id.toString();
      }
    }
  }
);

const Page = mongoose.model<IPageModel>('Page', pageSchema);

export {Page, IPageModel};

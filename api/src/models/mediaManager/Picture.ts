import * as mongoose from 'mongoose';
import {IPicture} from '../../../../shared/models/mediaManager/IPicture';
import {IFileModel} from './File';


interface IPictureModel extends IPicture, IFileModel {
}

const pictureSchema = new mongoose.Schema({
  breakpoints: [ {
    type: mongoose.Schema.Types.Mixed
  } ],
  mimeType: {
    type: String,
  }
});


export {pictureSchema, IPictureModel};

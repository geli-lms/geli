import * as mongoose from 'mongoose';
import {Unit} from './Unit';
import {IFreeTextUnit} from '../../../../shared/models/units/IFreeTextUnit';
import {NativeError} from 'mongoose';
import markdownService from '../../services/MarkdownService';

interface IFreeTextUnitModel extends IFreeTextUnit, mongoose.Document {
}

const freeTextUnitSchema = new mongoose.Schema({
  markdown: {
    type: String,
  }
});

const FreeTextUnit = Unit.discriminator('freeText', freeTextUnitSchema);

function convertMarkdown(doc: IFreeTextUnitModel, next: (err?: NativeError) => void) {
  // TODO
  console.log(markdownService.mdToHtml(doc.markdown));
  next();
}

freeTextUnitSchema.post('find', convertMarkdown);

export {FreeTextUnit, IFreeTextUnitModel}

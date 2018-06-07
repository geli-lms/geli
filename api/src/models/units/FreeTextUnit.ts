import * as mongoose from 'mongoose';
import {IUnitModel} from './Unit';
import {IFreeTextUnit} from '../../../../shared/models/units/IFreeTextUnit';
const MarkdownIt = require('markdown-it');

interface IFreeTextUnitModel extends IFreeTextUnit, IUnitModel {
  exportJSON: () => Promise<IFreeTextUnit>;
  toFile: () => String;
}

const freeTextUnitSchema = new mongoose.Schema({
  markdown: {
    type: String,
  }
});

freeTextUnitSchema.methods.toFile = function (): String {
  return this.name + '\n' + this.description + '\n' + this.markdown;
};

freeTextUnitSchema.methods.toHtmlForPdf = function (): String {
  const md = new MarkdownIt();
  const header = '<div id="pageHeader" style="text-align: center;border-bottom: 1px solid">'
    + md.render(this.name) + md.render(this.description) + '</div>';
  const content = md.render(this.markdown);
  return header + content;
};

export {freeTextUnitSchema, IFreeTextUnitModel};

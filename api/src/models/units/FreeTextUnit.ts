import * as mongoose from 'mongoose';
import {IUnitModel} from './Unit';
import {IFreeTextUnit} from '../../../../shared/models/units/IFreeTextUnit';
const MarkdownIt = require('markdown-it');

interface IFreeTextUnitModel extends IFreeTextUnit, IUnitModel {
  exportJSON: () => Promise<IFreeTextUnit>;
}

const freeTextUnitSchema = new mongoose.Schema({
  markdown: {
    type: String,
  }
});

freeTextUnitSchema.methods.toHtmlForIndividualPDF = function (): String {
  const md = new MarkdownIt();
  let html = '<div id="pageHeader" style="text-align: center;border-bottom: 1px solid">'
    + md.render(this.name ?  this.name : '') + md.render(this.description ? this.description : '') + '</div>';
  html += md.render(this.markdown ? this.markdown : '');
  return html;
};

freeTextUnitSchema.methods.toHtmlForSinglePDF = function (): String {
  const md = new MarkdownIt();
  let html = '';
  html += '<div><h4>' + md.render(this.name ? 'Unit: ' + this.name : '') + '</h4>'
    + '<span>' + md.render(this.description ? 'Description: ' + this.description : '') + '</span></div>';
  html += md.render(this.markdown ? this.markdown : '');
  return html;
};

freeTextUnitSchema.methods.toHtmlForSinglePDFSolutions = function (): String {
  return '';
};



export {freeTextUnitSchema, IFreeTextUnitModel};

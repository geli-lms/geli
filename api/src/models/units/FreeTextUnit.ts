import * as mongoose from 'mongoose';
import {IUnitModel} from './Unit';
import {IFreeTextUnit} from '../../../../shared/models/units/IFreeTextUnit';
import * as MarkdownIt from 'markdown-it';

const markdownItEmoji = require('markdown-it-emoji');
const MarkdownItDeflist = require('markdown-it-deflist');
const MarkdownItContainer = require('markdown-it-container');
const MarkdownItMark = require('markdown-it-mark');
const MarkdownItAbbr = require('markdown-it-abbr');
const hljs = require('highlight.js');

const md = new MarkdownIt({
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(lang, str).value;
      } catch (__) {
      }
    }

    return ''; // use external default escaping
  }
});

// load MD plugins
md.use(markdownItEmoji);
md.use(MarkdownItDeflist);

// register warning, info, error, success as custom containers
md.use(MarkdownItContainer, 'warning');
md.use(MarkdownItContainer, 'info');
md.use(MarkdownItContainer, 'error');
md.use(MarkdownItContainer, 'success');
md.use(MarkdownItContainer, 'learning-objectives');
md.use(MarkdownItContainer, 'hints');
md.use(MarkdownItContainer, 'assignment');
md.use(MarkdownItContainer, 'question');
md.use(MarkdownItContainer, 'example');
md.use(MarkdownItContainer, 'todo');

md.use(MarkdownItMark);
md.use(MarkdownItAbbr);

interface IFreeTextUnitModel extends IFreeTextUnit, IUnitModel {
  exportJSON: () => Promise<IFreeTextUnit>;
}

const freeTextUnitSchema = new mongoose.Schema({
  markdown: {
    type: String,
  }
});

freeTextUnitSchema.methods.getTheme = async function () {
  await (<IFreeTextUnitModel>this).populate('_course', 'freeTextStyle').execPopulate();
  return this._course.freeTextStyle;
};

freeTextUnitSchema.methods.toHtmlForIndividualPDF = async function () {
  const theme = await this.getTheme();
  let html = '<div id="pageHeader" style="text-align: center;border-bottom: 1px solid">'
    + md.render(this.name ? this.name : '') + md.render(this.description ? this.description : '') + '</div>';
  html += '<div class="markdown-wrapper ' + theme + '">' + md.render(this.markdown ? this.markdown : '') + '</div>';
  return html;
};

freeTextUnitSchema.methods.toHtmlForSinglePDF = async function () {
  const theme = await this.getTheme();
  let html = '';
  html += '<div><h4>' + md.render(this.name ? 'Unit: ' + this.name : '') + '</h4>'
    + '<span>' + md.render(this.description ? 'Description: ' + this.description : '') + '</span></div>';
  html += '<div class="markdown-wrapper ' + theme + '">' + md.render(this.markdown ? this.markdown : '') + '</div>';
  return html;
};

freeTextUnitSchema.methods.toHtmlForSinglePDFSolutions = function (): String {
  return '';
};


export {freeTextUnitSchema, IFreeTextUnitModel};

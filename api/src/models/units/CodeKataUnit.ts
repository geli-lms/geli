import * as mongoose from 'mongoose';
import {IUnitModel} from './Unit';
import {ICodeKataUnit} from '../../../../shared/models/units/ICodeKataUnit';
import {NativeError} from 'mongoose';
import {BadRequestError} from 'routing-controllers';
import {IUser} from '../../../../shared/models/IUser';
const MarkdownIt = require('markdown-it');

interface ICodeKataModel extends ICodeKataUnit, IUnitModel {
  exportJSON: () => Promise<ICodeKataUnit>;
  calculateProgress: () => Promise<ICodeKataUnit>;
  secureData: (user: IUser) => Promise<ICodeKataModel>;
}

const codeKataSchema = new mongoose.Schema({
  definition: {
    type: String,
    required: [true, 'A Kata must contain a definition area']
  },
  code: {
    type: String,
    required: [true, 'A Kata must contain a code area']
  },
  test: {
    type: String,
    required: [true, 'A Kata must contain a test area']
  },
  deadline: {
    type: String
  },
});

codeKataSchema.methods.secureData = async function (user: IUser): Promise<ICodeKataModel> {
  if (user.role === 'student') {
    this.code = null;
  }

  return this;
};

function splitCodeAreas(next: (err?: NativeError) => void) {
  const codeKataUnit: ICodeKataModel = this;

  if (codeKataUnit.definition !== undefined || codeKataUnit.test !== undefined || codeKataUnit.code === undefined) {
    return next();
  }

  const separator = '\/\/#+';
  const firstSeparator: number = findFirstIndexOf(codeKataUnit.code, separator);
  const lastSeparator: number = findLastIndexOf(codeKataUnit.code, separator);

  codeKataUnit.definition = codeKataUnit.code.substring(0, firstSeparator).trim();
  codeKataUnit.test = codeKataUnit.code.substring(lastSeparator, codeKataUnit.code.length).trim();
  codeKataUnit.code = codeKataUnit.code.substring(firstSeparator, lastSeparator).trim();

  codeKataUnit.code = codeKataUnit.code.slice(codeKataUnit.code.search('\n')).trim();
  codeKataUnit.test = codeKataUnit.test.slice(codeKataUnit.test.search('\n')).trim();
  next();
}

function findFirstIndexOf(source: string, value: string): number {
  return source.search(value);
}

function findLastIndexOf(source: string, value: string): number {
  const regex = new RegExp(value, '');
  let i = -1;

  // limit execution time (prevent deadlocks)
  let j = 10;
  while (j > 0) {
    j--;
    const result = regex.exec(source.slice(++i));
    if (result != null) {
      i += result.index;
    } else {
      i--;
      break;
    }
  }
  return i;
}

function validateTestArea(testArea: any) {
  if (!testArea.match(new RegExp('function(.|\t)*validate\\(\\)(.|\n|\t)*{(.|\n|\t)*}', 'gmi'))) {
    throw new BadRequestError('The test section must contain a validate function');
  }
  if (!testArea.match(new RegExp('function(.|\t)*validate\\(\\)(.|\n|\t)*{(.|\n|\t)*return(.|\n|\t)*}', 'gmi'))) {
    throw new BadRequestError('The validate function must return something');
  }
  if (!testArea.match(new RegExp('validate\\(\\);', 'gmi'))) {
    throw new BadRequestError('The test section must call the validate function');
  }

  return true;
}

codeKataSchema.pre('validate', splitCodeAreas);
codeKataSchema.path('test').validate(validateTestArea);

codeKataSchema.methods.toHtmlForIndividualPDF = function (): String {
  const md = new MarkdownIt({html: true});
  let html = '<div id="pageHeader">'
    + md.render(this.name ? this.name : '') + md.render(this.description ? this.description : '') + '</div>';


  html += '<div id="firstPage" class="bottomBoxWrapper">';
  html += '<h5>Task</h5>';
  html += '<div>' +  md.render('<div class="codeBox">' + md.render(this.definition ? this.definition : '') + '</div>') + '</div>';
  html += '<h5>Code</h5>';
  html += '<div class="bottomBox"><h3>Validation</h3>';
  html += '<div>' +  md.render('<div class="codeBox">' + md.render(this.test ? this.test : '') + '</div>') + '</div>';
  html += '</div>';

  html += '</div ><div><h2>Solution</h2></div>';
  html += '<h5>Task</h5>';
  html += '<div>' +  md.render('<div class="codeBox">' +  md.render(this.definition ? this.definition : '') + '</div>') + '</div>';
  html += '<h5>Code</h5>';
  html += '<div>' +  md.render('<div class="codeBox">' + md.render(this.code ? this.code : '') + '</div>') + '</div>';
  html += '<h5>Validation</h5>';
  html += '<div>' +  md.render('<div class="codeBox">' +  md.render(this.test ? this.test : '') + '</div>') + '</div>';
  return html;
};

codeKataSchema.methods.toHtmlForSinglePDF = function (): String {
  const md = new MarkdownIt({html: true});


  let html = '<div class="bottomBoxWrapper">';
  html += '<div><h4>' + md.render(this.name ? 'Unit: ' + this.name : '') + '</h4>'
    + '<span>' + md.render(this.description ? 'Description: ' + this.description : '') + '</span></div>';
  html += '<h5>Task</h5>';
  html += '<div>' +  md.render('<div class="codeBox">' + md.render(this.definition ? this.definition : '') + '</div>') + '</div>';
  html += '<h5>Code</h5>';
  html += '<div class="bottomBox"><h5>Validation</h5>';
  html += '<div>' +  md.render('<div class="codeBox">' + md.render(this.test ? this.test : '') + '</div>') + '</div>';
  html += '</div></div>';
  return html;
};

codeKataSchema.methods.toHtmlForSinglePDFSolutions = function (): String {
  const md = new MarkdownIt({html: true});

  let html = '';
  html += '<div><h4>' + md.render(this.name ? this.name : '') + '</h4></div>';
  html += '<h5>Task</h5>';
  html += '<div>' +  md.render('<div class="codeBox">' +  md.render(this.definition ? this.definition : '') + '</div>') + '</div>';
  html += '<h5>Code</h5>';
  html += '<div>' +  md.render('<div class="codeBox">' + md.render(this.code ? this.code : '') + '</div>') + '</div>';
  html += '<h5>Validation</h5>';
  html += '<div>' +  md.render('<div class="codeBox">' + md.render(this.test ? this.test : '') + '</div>') + '</div>';
  return html;
};

export {codeKataSchema, ICodeKataModel};

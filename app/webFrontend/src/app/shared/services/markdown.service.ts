import {Injectable} from '@angular/core';
import * as MarkdownIt from 'markdown-it';
import * as markdownItEmoji from 'markdown-it-emoji';

const emojis = require('../../../../node_modules/markdown-it-emoji/lib/data/full.json');


@Injectable()
export class MarkdownService {
  markdown: any;
  emojis: any[];


  constructor() {
    this.markdown = new MarkdownIt();
    this.markdown.use(markdownItEmoji);
    this.emojis = emojis;
  }

  render(text: string): string {
   return  this.markdown.render(text);
  }
}

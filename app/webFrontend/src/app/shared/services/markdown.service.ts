import {Injectable} from '@angular/core';
import * as MarkdownIt from 'markdown-it';
import * as markdownItEmoji from 'markdown-it-emoji';
import twemoji from 'twemoji';
import * as MarkdownItDeflist from 'markdown-it-deflist';
import * as MarkdownItFootnote from 'markdown-it-footnote';
import * as MarkdownItContainer from 'markdown-it-container';
import * as MarkdownItMark from 'markdown-it-mark';
import * as MarkdownItAbbr from 'markdown-it-abbr';

@Injectable()
export class MarkdownService {
  markdown: any;


  constructor() {
    this.markdown = new MarkdownIt();

    // load plugins
    this.markdown.use(markdownItEmoji);
    this.markdown.use(MarkdownItDeflist);
    this.markdown.use(MarkdownItFootnote);
    this.markdown.use(MarkdownItContainer);
    this.markdown.use(MarkdownItMark);
    this.markdown.use(MarkdownItAbbr);

    this.markdown.renderer.rules.emoji = function (token, idx) {
      return twemoji.parse(token[idx].content);
    };
  }

  render(text: string): string {
    return this.markdown.render(text);
  }
}

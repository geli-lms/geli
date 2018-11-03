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

    this.overwriteCustomFootnoteRenderer();
    this.markdown.renderer.rules.emoji = function (token, idx) {
      return twemoji.parse(token[idx].content);
    };
  }

  render(text: string): string {
    return this.markdown.render(text);
  }

  overwriteCustomFootnoteRenderer() {
    this.markdown.renderer.rules.footnote_ref = function (tokens, idx) {
      var n = Number(tokens[idx].meta.id + 1).toString();
      var id = 'fnref' + n;
      var uri = window.location.pathname;
      if (tokens[idx].meta.subId > 0) {
        id += ':' + tokens[idx].meta.subId;
      }
      //return '<sup class="footnote-ref"><a href="' + uri + '#fn' + n + '" id="' + id + '">[' + n + ']</a></sup>';
      return '<sup class="footnote-ref">[' + n + ']</sup>';
    };

    this.markdown.renderer.rules.footnote_anchor = function (tokens, idx) {
      var n = Number(tokens[idx].meta.id + 1).toString();
      var id = 'fnref' + n;
      var uri = window.location.pathname;
      if (tokens[idx].meta.subId > 0) {
        id += ':' + tokens[idx].meta.subId;
      }
      //return ' <a href="' + uri + '#' + id + '" class="footnote-backref">\u21a9</a>';
      return '<span class="footnote-backref></span>'
      /* ↩ */
    };
  }
}

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

    // register warning, info, error, success as custom containers
    this.markdown.use(MarkdownItContainer, 'warning');
    this.markdown.use(MarkdownItContainer, 'info');
    this.markdown.use(MarkdownItContainer, 'error');
    this.markdown.use(MarkdownItContainer, 'success');

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

  /*
  * Ugly workaround. Otherwise scroll to id anchors used by markdown-it-footnote will not work.
  * Feel welcome to rewrite
  *
  * Original implementation: https://github.com/markdown-it/markdown-it-footnote/blob/master/index.js
  * */
  overwriteCustomFootnoteRenderer() {
    this.markdown.renderer.rules.footnote_ref = (tokens, idx, options, env, slf) => {
      const id = slf.rules.footnote_anchor_name(tokens, idx, options, env, slf);
      const caption = slf.rules.footnote_caption(tokens, idx, options, env, slf);
      let refid = id;
      const uri = window.location.pathname;

      if (tokens[idx].meta.subId > 0) {
        refid += ':' + tokens[idx].meta.subId;
      }

      return '<sup class="footnote-ref"><a href="' + uri + '#fn' + id + '" id="fnref' + refid + '">' + caption + '</a></sup>';
    };

    this.markdown.renderer.rules.footnote_anchor = (tokens, idx, options, env, slf) => {
      let id = slf.rules.footnote_anchor_name(tokens, idx, options, env, slf);

      if (tokens[idx].meta.subId > 0) {
        id += ':' + tokens[idx].meta.subId;
      }

      const uri = window.location.pathname;
      /* ↩ with escape code to prevent display as Apple Emoji on iOS */
      return ' <a href="' + uri + '#fnref' + id + '" class="footnote-backref">\u21a9\uFE0E</a>';
    };
  }
}

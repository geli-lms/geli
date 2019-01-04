import {Injectable} from '@angular/core';
import * as MarkdownIt from 'markdown-it';
import * as markdownItEmoji from 'markdown-it-emoji';
import twemoji from 'twemoji';
import * as MarkdownItDeflist from 'markdown-it-deflist';
import * as MarkdownItContainer from 'markdown-it-container';
import * as MarkdownItMark from 'markdown-it-mark';
import * as MarkdownItAbbr from 'markdown-it-abbr';
import * as hljs from 'highlight.js';

@Injectable()
export class MarkdownService {
  markdown: any;

  // tslint:disable:max-line-length
  /*
  * FOOTNOTES:
  *
  * markdown-it-footnote useses hash-ids to jump on the page.
  * This is NOT working in geli.
  *
  * A workaround exists, but is removed because of multiple reasons.
  * See:
  * https://github.com/geli-lms/geli/blob/34a3ab12bb64246015d10b0b6d5ae4ceb49467c8/app/webFrontend/src/app/shared/services/markdown.service.ts#L51
  * and
  * https://github.com/geli-lms/geli/commit/34a3ab12bb64246015d10b0b6d5ae4ceb49467c8#diff-d066343acc1ce14385a25371993e95da
  *
  * Original implementation can be found here: https://github.com/markdown-it/markdown-it-footnote/blob/master/index.js
  *
  * */
  // tslint:enable:max-line-length


  constructor() {
    this.markdown = new MarkdownIt({
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

    // load plugins
    this.markdown.use(markdownItEmoji);
    this.markdown.use(MarkdownItDeflist);

    // register warning, info, error, success as custom containers
    this.markdown.use(MarkdownItContainer, 'warning');
    this.markdown.use(MarkdownItContainer, 'info');
    this.markdown.use(MarkdownItContainer, 'error');
    this.markdown.use(MarkdownItContainer, 'success');
    this.markdown.use(MarkdownItContainer, 'learning-objectives');
    this.markdown.use(MarkdownItContainer, 'hints');
    this.markdown.use(MarkdownItContainer, 'assignment');
    this.markdown.use(MarkdownItContainer, 'question');
    this.markdown.use(MarkdownItContainer, 'example');
    this.markdown.use(MarkdownItContainer, 'todo');

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

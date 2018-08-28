import {Injectable} from '@angular/core';
import * as MarkdownIt from 'markdown-it';
import * as markdownItEmoji from 'markdown-it-emoji';
import twemoji from 'twemoji';

@Injectable()
export class MarkdownService {
  markdown: any;


  constructor() {
    this.markdown = new MarkdownIt();
    this.markdown.use(markdownItEmoji);
    this.markdown.renderer.rules.emoji = function (token, idx) {
      return twemoji.parse(token[idx].content);
    };
  }

  render(text: string): string {
    return this.markdown.render(text);
  }
}

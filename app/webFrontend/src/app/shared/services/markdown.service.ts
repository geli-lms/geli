import {Injectable} from '@angular/core';
import * as MarkdownIt from 'markdown-it';
import * as emoji from 'markdown-it-emoji';


@Injectable()
export class MarkdownService {
  markdown: any;

  constructor() {
    this.markdown = new MarkdownIt();
    this.markdown.use(emoji);
    console.log('emoji',JSON.stringify(emoji));
  }

  render(text: string): string {
   return  this.markdown.render(text);
  }
}

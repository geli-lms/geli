import {Injectable} from '@angular/core';
import * as MarkdownIt from 'markdown-it';

@Injectable()
export class MarkdownService {

  constructor() {
  }

  render(markdown: string): string {

    return new MarkdownIt({
      // MarkdownIt Options
      // TODO
    })
    .render(markdown);
  }
}

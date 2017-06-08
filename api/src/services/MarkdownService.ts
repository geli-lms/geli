import * as MarkdownIt from 'markdown-it';

class MarkdownService {
  constructor() {

  };

  mdToHtml(markdown: string) {
    if (!markdown) {
      throw new Error('markdown not defined');
    }
    if (markdown.length === 0) {
      return '';
    }

    // Setup MarkdownIt instance
    const mdInstance = new MarkdownIt({
      // MarkdownIt Options
    });

    // Convert
    return mdInstance.render(markdown);
  }
}

export default new MarkdownService();

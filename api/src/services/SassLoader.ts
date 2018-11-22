import {renderSync, Options} from 'node-sass';
import { resolve } from 'path';

// Defaults
const options: Options = {
  sourceMap: false,
  sourceMapEmbed: false,
  sourceMapContents: false,
  outputStyle: 'compressed'
};

export class SassLoader {

  private options: Options = {};
  private defaultOptions: Options = {
    sourceMap: false,
    sourceMapEmbed: false,
    sourceMapContents: false,
    outputStyle: 'compressed'
  };

  constructor(sassOptions: Options = {}) {
    // merge with default
    this.options = {...this.defaultOptions, ...sassOptions};
  }

  public load(filepath: string) {
    const renderOptions = this.defaultOptions;
    renderOptions.file = resolve(module.parent.filename, filepath);
    try {
      return renderSync(renderOptions).css.toString();
    } catch (e) {
      console.error(e);
      return null;
    }
  }
}

export default new SassLoader();

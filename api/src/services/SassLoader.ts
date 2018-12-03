import {renderSync, Options} from 'node-sass';
import {resolve} from 'path';

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

  constructor(sassOptions: Options = {}, exts: Array<string> = null) {
    // merge with default
    this.options = {...this.defaultOptions, ...sassOptions};

    const extensions = exts || ['.scss', '.sass'];
    for (let i = 0; i < extensions.length; i++) {
      require.extensions[extensions[i]] = (mod, file) => this.requireSass(mod, file);
    }
  }

  public requireSass(mod: any, file: string) {
    const renderOptions = this.defaultOptions;
    renderOptions.file = file;
    mod.exports = this.load(file);
  }

  public load(filepath: string) {
    const renderOptions = this.defaultOptions;
    renderOptions.file = filepath; // resolve(module.parent.filename, filepath);
    try {
      return renderSync(renderOptions).css.toString();
    } catch (e) {
      console.error(e);
      return null;
    }
  }
}

export default SassLoader;

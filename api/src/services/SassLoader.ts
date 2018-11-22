import {renderSync, Options} from 'node-sass';

// Defaults
let options: Options = {
  sourceMap: false,
  sourceMapEmbed: false,
  sourceMapContents: false,
  outputStyle: "compressed",
  includePaths: ['node_modules','../../node_modules']
};


// Main export
module.exports = function(opts: Options, exts: Array<string>) {
  options = {...options, ...opts};

  var extensions = exts || ['.scss', '.sass'];
  for (var i = 0; i < extensions.length; i++) {
    require.extensions[extensions[i]] = requireSass;
  }

  return {
    options: options,
    exts: extensions
  }
}

// Helper functions
function requireSass(mod:any, file:string) {
  var data = sassImport(file);
  var sassOptions = {...options, ...{data: data}};

  console.log(sassOptions);
  var result = renderSync(sassOptions);

  mod.exports = result.css.toString();
};


function sassImport(path:string) {
  return "@import '" + path + "';";
}

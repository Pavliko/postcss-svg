(function() {
  var SVGCache, _, postcss,
    slice = [].slice;

  postcss = require('postcss');

  SVGCache = require('./lib/svg_cache');

  _ = require('lodash');

  module.exports = postcss.plugin("postcss-svg", function(options) {
    var SVGRegExp, funcName, silent;
    if (options == null) {
      options = {};
    }
    funcName = options.func || 'svg';
    SVGRegExp = new RegExp(funcName + "\\(\"([^\"]+)\"(,\\s*\"([^\"]+)\")?\\)");
    silent = _.isBoolean(options.silent) ? options.silent : true;
    if (options.debug) {
      silent = false;
    }
    return function(style) {
      SVGCache.init(options);
      return style.eachDecl(/^background|^filter|^content|image$/, function(decl) {
        var args, error, matches, name, params, replace, svg;
        if (!decl.value) {
          return;
        }
        if (matches = SVGRegExp.exec(decl.value.replace(/'/g, '"'))) {
          replace = matches[0], args = 2 <= matches.length ? slice.call(matches, 1) : [];
          name = args[0], params = 2 <= args.length ? slice.call(args, 1) : [];
          if (options.debug) {
            console.time("Render svg " + name);
          }
          try {
            svg = SVGCache.get(name);
          } catch (_error) {
            error = _error;
            if (!silent) {
              throw decl.error(error);
            }
          }
          if (!svg) {
            return;
          }
          decl.value = decl.value.replace(replace, svg.dataUrl(params[1]));
          if (options.debug) {
            console.timeEnd("Render svg " + name);
          }
        }
      });
    };
  });

}).call(this);

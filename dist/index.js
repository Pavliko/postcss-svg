(function() {
  var SVGCache, _, postcss;

  postcss = require('postcss');

  SVGCache = require('./lib/svg_cache');

  _ = require('lodash');

  module.exports = postcss.plugin("postcss-svg", function(options) {
    var SVGRegExp, funcName, replaceRegExp, silent;
    if (options == null) {
      options = {};
    }
    funcName = options.func || 'svg';
    SVGRegExp = new RegExp(funcName + "\\(\"([^\"]+)\"(,\\s*\"([^\"]+)\")?\\)");
    replaceRegExp = new RegExp(funcName + "\\((\"[^\"]+\"|\'[^\']+\')(,\\s*(\"[^\"]+\"|\'[^\']+\'))?\\)");
    silent = _.isBoolean(options.silent) ? options.silent : true;
    if (options.debug) {
      silent = false;
    }
    return function(style, result) {
      SVGCache.init(options);
      return style.walkDecls(/^background|^filter|^content|image$/, function(decl) {
        var ___, error, error1, matches, name, params, replace, svg;
        if (!decl.value) {
          return;
        }
        while (matches = SVGRegExp.exec(decl.value.replace(/'/g, '"'))) {
          ___ = matches[0], name = matches[1], ___ = matches[2], params = matches[3];
          if (options.debug) {
            console.time("Render svg " + name);
          }
          try {
            svg = SVGCache.get(name);
          } catch (error1) {
            error = error1;
            if (silent) {
              decl.warn(result, "postcss-svg: " + error);
            } else {
              throw decl.error(error);
            }
          }
          if (!svg) {
            return;
          }
          replace = replaceRegExp.exec(decl.value)[0];
          decl.value = decl.value.replace(replace, svg.toBase64DataUri(params));
          if (options.debug) {
            console.timeEnd("Render svg " + name);
          }
        }
      });
    };
  });

}).call(this);

(function() {
  var SVGImage, _, fs, path,
    slice = [].slice;

  SVGImage = require('./svg_image');

  _ = require('lodash');

  path = require('path');

  fs = require('fs');

  module.exports = {
    defaultPaths: ['svg'],
    init: function(options) {
      var debug;
      debug = _.isBoolean(options.debug) && options.debug;
      options.svgo || (options.svgo = false);
      this.filesIndex = {};
      return this.svgOptions = _.pick(options, 'defaults', 'svgo');
    },
    addToIndex: function(filePath, options) {
      if (options == null) {
        options = {};
      }
      if (path.extname(filePath) === '.svg') {
        return this.filesIndex[filePath] = new SVGImage(filePath, options);
      }
    },
    getRelative: function(sourcePath, filename) {
      var absPath, ids, link, ref, svg;
      ref = filename.split('#'), link = ref[0], ids = 2 <= ref.length ? slice.call(ref, 1) : [];
      absPath = path.join(path.dirname(sourcePath), link);
      if (svg = this.filesIndex[absPath]) {
        return svg.svgFor(ids);
      } else {
        this.addToIndex(absPath, this.svgOptions);
        return this.filesIndex[absPath].svgFor(ids);
      }
    }
  };

}).call(this);

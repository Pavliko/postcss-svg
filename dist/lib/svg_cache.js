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
      var debug, filename, i, j, len, len1, myPath, ref, ref1, stat;
      debug = _.isBoolean(options.debug) && options.debug;
      options.svgo || (options.svgo = false);
      this.templates = {};
      this.filesIndex = {};
      if (debug) {
        console.time('Index generation');
      }
      if (!_.isBoolean(options.ei) || options.ei) {
        this.addToIndex('ei.svg', {
          content: require('evil-icons').sprite,
          defaults: (options.ei && options.ei.defaults) || options.defaults,
          svgo: options.svgo,
          sprite: {
            postfix: '-icon',
            prefix: 'ei-'
          }
        });
      }
      this.svgOptions = _.pick(options, 'defaults', 'svgo');
      this.paths = options.paths || this.defaultPaths;
      ref = this.paths;
      for (i = 0, len = ref.length; i < len; i++) {
        myPath = ref[i];
        if (fs.existsSync(myPath)) {
          stat = fs.statSync(myPath);
          if (stat.isDirectory()) {
            ref1 = fs.readdirSync(myPath);
            for (j = 0, len1 = ref1.length; j < len1; j++) {
              filename = ref1[j];
              this.addToIndex("" + myPath + path.sep + filename, this.svgOptions);
            }
          } else {
            if (stat.isFile()) {
              this.addToIndex(myPath, this.svgOptions);
            }
          }
        }
      }
      if (debug) {
        return console.timeEnd('Index generation');
      }
    },
    addToIndex: function(filePath, options) {
      var base, basename, basenameWithExt, svg;
      if (options == null) {
        options = {};
      }
      if (path.extname(filePath) === '.svg') {
        svg = new SVGImage(filePath, options);
        basename = path.basename(filePath, '.svg');
        basenameWithExt = basename + ".svg";
        if (this.filesIndex[basename]) {
          this.filesIndex[basenameWithExt] = this.filesIndex[basename] = this.filesIndex[basename].error ? ((base = this.filesIndex[basename]).paths || (base.paths = []), this.filesIndex[basename].paths.push(svg.path)) : {
            error: true,
            livel: 'Warning',
            getMessage: function() {
              return "You have some files with this basename: " + (this.filesIndex[basename].paths.join(', '));
            },
            paths: [this.filesIndex[basename].path, svg.path]
          };
        } else {
          this.filesIndex[basename] = this.filesIndex[basenameWithExt] = svg;
        }
        return this.filesIndex[filePath] = this.filesIndex[filePath.slice(0, -4)] = svg;
      }
    },
    get: function(identifier, second) {
      var ids, link, ref, svg;
      if (second == null) {
        second = false;
      }
      ref = identifier.split('#'), link = ref[0], ids = 2 <= ref.length ? slice.call(ref, 1) : [];
      if (svg = this.filesIndex[link]) {
        if (svg.error) {
          throw svg.getMessage();
        } else {
          return svg.svgFor(ids);
        }
      } else {
        if (second) {
          throw "'" + link + "' not found in SVG csche (paths: " + (this.paths.join(', ')) + ")";
        } else {
          identifier = (identifier.indexOf('.svg') === -1 ? identifier + ".svg" : identifier);
          this.addToIndex(identifier, this.svgOptions);
          return this.get(identifier, true);
        }
      }
    }
  };

}).call(this);

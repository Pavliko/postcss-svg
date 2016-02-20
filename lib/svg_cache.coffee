SVGImage = require('./svg_image')
_ = require('lodash')
path = require('path')
fs = require('fs')

module.exports =
  defaultPaths: ['svg']

  init: (options) ->
    debug = _.isBoolean(options.debug) && options.debug
    options.svgo ||= false
    @filesIndex = {}

    @svgOptions = _.pick options, 'defaults', 'svgo'


  addToIndex: (filePath, options = {}) ->
    if path.extname(filePath) == '.svg'
      @filesIndex[filePath] = new SVGImage(filePath, options)

  getRelative: (sourcePath, filename)->
    [link, ids...] = filename.split '#'
    absPath = path.join(path.dirname(sourcePath), link)

    if svg = @filesIndex[absPath]
      svg.svgFor(ids)
    else
      @addToIndex absPath, @svgOptions
      @filesIndex[absPath].svgFor(ids)

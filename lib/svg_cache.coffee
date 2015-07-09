SVGImage = require('./svg_image')
_ = require('lodash')
path = require('path')
fs = require('fs')

module.exports =
  defaultPaths: ['svg']
  
  init: (options) ->
    debug = _.isBoolean(options.debug) && options.debug
    options.svgo ||= false
    @templates = {}
    @filesIndex = {}
    console.time('Index generation') if debug
    if !_.isBoolean(options.ei) || options.ei
      @addToIndex 'ei.svg',
        content: require('evil-icons').sprite
        defaults: (options.ei && options.ei.defaults) || options.defaults
        svgo: options.svgo
        sprite:
          postfix: '-icon'
          prefix: 'ei-'

    svgOptions = _.pick options, 'defaults', 'svgo'

    for myPath in (options.paths || @defaultPaths)
      if fs.existsSync(myPath)
        stat = fs.statSync(myPath)
        if stat.isDirectory()
          @addToIndex("#{myPath}#{path.sep}#{filename}", svgOptions) for filename in fs.readdirSync(myPath)
        else
          @addToIndex(myPath, svgOptions) if stat.isFile()
    console.timeEnd('Index generation') if debug

  addToIndex: (filePath, options = {}) ->
    if path.extname(filePath) == '.svg'
      svg = new SVGImage(filePath, options)
      basename = path.basename(filePath, '.svg')
      basenameWithExt = "#{basename}.svg"

      if @filesIndex[basename]
        @filesIndex[basenameWithExt] = @filesIndex[basename] = if @filesIndex[basename].error
          @filesIndex[basename].paths ||= []
          @filesIndex[basename].paths.push svg.path
        else
          error: true
          livel: 'Warning'
          getMessage: -> "You have some files with this basename: #{@paths.join(', ')}"
          paths: [@filesIndex[basename].path, svg.path]
      else
        @filesIndex[basename] = @filesIndex[basenameWithExt] = svg

      @filesIndex[filePath] = @filesIndex[filePath[0..-5]] = svg

  get: (identifier)->
    [link, ids...] = identifier.split('#')
    # console.log Object.keys(@filesIndex), "#{link}", ids, @filesIndex[link]
    if svg = @filesIndex[link]
      if svg.error
        throw svg.getMessage()
      else
        svg.svgFor(ids)
    else
      throw "'#{link}' not found in SVG csche"

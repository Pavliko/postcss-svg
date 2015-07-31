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

    @svgOptions = _.pick options, 'defaults', 'svgo'
    @paths = options.paths || @defaultPaths

    for myPath in @paths
      if fs.existsSync(myPath)
        stat = fs.statSync(myPath)
        if stat.isDirectory()
          @addToIndex("#{myPath}#{path.sep}#{filename}", @svgOptions) for filename in fs.readdirSync(myPath)
        else
          @addToIndex(myPath, @svgOptions) if stat.isFile()
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
          getMessage: -> "You have some files with this basename: #{@filesIndex[basename].paths.join(', ')}"
          paths: [@filesIndex[basename].path, svg.path]
      else
        @filesIndex[basename] = @filesIndex[basenameWithExt] = svg

      @filesIndex[filePath] = @filesIndex[filePath[0..-5]] = svg

  get: (identifier, second = false)->
    [link, ids...] = identifier.split('#')

    if svg = @filesIndex[link]
      if svg.error
        throw svg.getMessage()
      else
        svg.svgFor(ids)
    else
      if second
        throw "'#{link}' not found in SVG csche (paths: #{@paths.join(', ')})"
      else
        identifier = (if identifier.indexOf('.svg') == -1 then "#{identifier}.svg" else identifier)
        @addToIndex identifier, @svgOptions
        @get(identifier, true)

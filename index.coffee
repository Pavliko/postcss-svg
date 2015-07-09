postcss = require 'postcss'
SVGCache = require('./lib/svg_cache')
_ = require('lodash')

module.exports = postcss.plugin "postcss-svg", (options = {}) ->
  funcName = options.func || 'svg'
  SVGRegExp = new RegExp("#{funcName}\\(\"([^\"]+)\"(,\\s*\"([^\"]+)\")?\\)")
  silent = if _.isBoolean(options.silent) then options.silent else true
  silent = false if options.debug
  
  (style) ->
    SVGCache.init(options)

    style.eachDecl /^background|^filter|^content|image$/, (decl) ->
      return unless decl.value
      if matches = SVGRegExp.exec(decl.value.replace(/'/g, '"'))
        [replace, args...] = matches
        [name, params...] = args
        console.time ("Render svg #{name}") if options.debug
        try
          svg = SVGCache.get(name)
        catch error
          throw decl.error(error) unless silent
        return unless svg
        decl.value = decl.value.replace replace, svg.dataUrl(params[1])
        console.timeEnd ("Render svg #{name}") if options.debug
        return

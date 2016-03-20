postcss = require 'postcss'
SVGCache = require('./lib/svg_cache')
_ = require('lodash')

module.exports = postcss.plugin "postcss-svg", (options = {}) ->
  funcName = options.func || 'svg'
  SVGRegExp = new RegExp("#{funcName}\\(\"([^\"]+)\"(,\\s*\"([^\"]+)\")?\\)")
  replaceRegExp = new RegExp("#{funcName}\\((\"[^\"]+\"|\'[^\']+\')(,\\s*(\"[^\"]+\"|\'[^\']+\'))?\\)")
  silent = if _.isBoolean(options.silent) then options.silent else true
  silent = false if options.debug

  SVGCache.init(options)

  (style, result) ->
    style.walkDecls /^background|^filter|^content|image$/, (decl) ->
      return unless decl.value
      while matches = SVGRegExp.exec(decl.value.replace(/'/g, '"'))
        [___, name, params...] = matches
        console.time ("Render svg #{name}") if options.debug
        try
          svg = SVGCache.get(name)
        catch error
          if silent
            decl.warn result, "postcss-svg: #{error}"
          else
            throw decl.error(error)
        return unless svg
        replace = replaceRegExp.exec(decl.value)[0]
        decl.value = decl.value.replace replace, svg.dataUrl(params[1])
        console.timeEnd ("Render svg #{name}") if options.debug
      return

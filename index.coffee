postcss = require 'postcss'

cacheSVGFiles = (dirs) ->
  fs = require('fs')
  doT = require('dot')
  result = {}
  multiplePaths = dirs.length > 1
  for path in dirs
    files = fs.readdirSync path
    for filename in files
      if filename.substr(-4) == '.svg'
        data = fs.readFileSync "#{path}/#{filename}"
        name = filename[0..-5]
        template = doT.template(data.toString())
        result["#{path}/#{name}"] = template if multiplePaths
        result[name] ||= template
  return result

parseParams = (string) ->
  result = {}
  return result if !string || string.indexOf(':') == -1

  for rule in string.replace(/[\s"]/g, '').split(';')
    unless rule.indexOf(':') == -1
      [key, value] = rule.split(':')
      result[key] = value
      
  result

module.exports = postcss.plugin "postcss-svg", (options = {}) ->
  SVGRegExp = /svg\(([^\)]+)\)/

  (style) ->
    SVGTempates = cacheSVGFiles(options.paths || ['svg'])
    style.eachDecl /^background|filter/, (decl) ->
      return unless decl.value
      if matches = SVGRegExp.exec(decl.value)
        [replace, argString] = matches
        argString = argString.replace(/'/g, '"')
        [name, params] =  argString.split(',')
        name = name[1..-2]
        return unless template = SVGTempates[name]
        params = parseParams(params)
        svg = encodeURIComponent(template(params))
        svg = "url(\"data:image/svg+xml,#{svg}\")"
        decl.value = decl.value.replace replace, svg
        return

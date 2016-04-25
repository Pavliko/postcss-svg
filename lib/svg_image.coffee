Color = require('color')
xmldom = require('xmldom')
doT = require 'dot'
fs = require('fs')
_ = require('lodash')
SVGO = require('svgo')


class SVGImage
  constructor: (filePath, options = {}) ->
    @path = filePath
    @options = options
    @xml = options.content
    @sprite = options.sprite || {}
    @defaults = if _.isString(options.defaults) then @_parseStyle(options.defaults) else {}
    @colors = {}
    @sprites = {}
    @colorCount = 0
    @svgo = if options.svgo then svgo = new SVGO(if _.isObject(options.svgo) then options.svgo else {}) else false
    @_parseSvg()

  svgFor: (ids) ->
    return this if !ids || _.isEmpty(ids)
    id = "#{@sprite.prefix || ''}#{ids[0]}#{@sprite.postfix || ''}"
    if sprite = @sprites[id]
      sprite.svgFor ids.slice(1)
    else
      throw new Error "Can\'t find sprite with id #{id}"

  dataUrl: (params = {}) ->
    params = @_parseStyle(params) if _.isString(params)
    params = _.extend({}, @defaults, params)
    svg = @template(params)
    svg = @_svgoSync(svg) if @svgo
    "url(\"data:image/svg+xml;charset=utf-8,#{encodeURIComponent(svg)}\")"

  _svgoSync: (svgString) ->
    result = false

    @svgo.optimize(svgString, (str) -> result = str.data)
    loop
      return result if result

  _parseStyle: (string) ->
    result = {}
    return result if !string || string.indexOf(':') == -1
    for rule in string.replace(/[\s"]/g, '').split(';')
      unless rule.indexOf(':') == -1
        [key, value] = rule.split(':')
        result[key] = value

    result

  _parseSvg: ->
    result = {}
    xml = @xml || fs.readFileSync(@path).toString()
    doc = new xmldom.DOMParser().parseFromString(xml, "image/svg+xml")
    @svgAttributes = @_parseAttributes(doc.childNodes[0].attributes)

    doc = @_parseNode(doc, result, (node, attributes) => @_readColors(node, attributes))
    @_checkSVG(doc)
    doc = new xmldom.XMLSerializer().serializeToString(doc)

    @template =  doT.template(doc, _.extend(doT.templateSettings, { strip: false }))

  _checkSVG: (doc) ->
    if !(Object.keys(@colors).length > 0)
      transform = (key) -> "(it['[#{key}]'] ? '#{key}:'+it['[#{key}]']+';' : '')"
      doc.setAttribute('style', "{{= #{_.map(['fill', 'stroke'], transform).join('+')} }}")

    unless @svgAttributes.height || @svgAttributes.width
      doc.setAttribute('height', "{{= it['[height]'] || it['[size]'] || '100%' }}")
      doc.setAttribute('width', "{{= it['[width]'] || it['[size]'] || '100%' }}")

  _parseNode: (node, result, callback, path='') ->
    if node.childNodes
      for node in node.childNodes
        nodePath = path
        if node.tagName
          attributes = @_parseAttributes(node.attributes) || {}

          nodePath += "#{if path == '' then '' else '>'}#{node.tagName}"
          nodePath += "##{attributes.id.value}" if attributes.id && node.tagName != 'svg'
          nodePath += ".#{attributes.class.value}" if attributes.class

          @_addSprite(node) if node.tagName == 'symbol'
          attributes.path = nodePath

          callback(node, attributes)
        @_parseNode(node, result, callback, nodePath)
    node

  _readColors: (node, attributes) ->
    @_addColor('fill', attributes, node) if attributes.fill
    @_addColor('stroke', attributes, node) if attributes.stroke

  _parseAttributes: (attributes) ->
    result = {}
    if attributes
      for index, attribute of attributes
        if parseInt(index, 10) > 0 || index == '0'
          result[attribute.name] =
            index: index
            value: attribute.value
    result

  _addSprite: (node) ->
    return unless node.tagName == 'symbol'
    node = node.cloneNode(true)
    attributes = @_parseAttributes(node.attributes)
    node.tagName = 'svg'
    id = attributes.id && attributes.id.value || "sprite#{Object.keys(@sprites).length}"
    for key, value of _.assign({}, @svgAttributes, attributes)
      value.value = value.value.replace(/display:\s*none[^;]*/, '') if key == 'style'
      if !_.isEmpty(key) && key != 'undefined' && value && !_.isEmpty(value.value) && value != 'undefined'
        node.setAttribute(key, value.value)

    svg = new xmldom.XMLSerializer().serializeToString(node)
    sprite = new SVGImage null,
      content: svg
      defaults: @options.defaults
    @sprites[id] = sprite


  _addColor: (type, attributes, node) ->
    try
      color = if attributes[type].value == 'none'
        Color('rgba(255, 255, 255, 0)')
      else
        Color(attributes[type].value)

      typeSelector = "[#{type}]"
      key = color.rgbaString()

      @colors[key] ||=
        color: color
        count: 0
        index: Object.keys(@colors).length
        selectors: []

      @colors[key].count++
      @colors[key].selectors.push "#{attributes.path}#{typeSelector}"
      selectors = ["color#{@colorCount++ || '0'}"]
      selectors.push "##{attributes.id.value}#{typeSelector}" if attributes.id
      selectors.push "colorGroup#{@colors[key].index || '0'}"
      selectors.push ".#{attributes.class.value}#{typeSelector}" if attributes.class
      selectors.push "#{node.tagName}[#{type}]"
      selectors.push typeSelector
      selectors.push "[color]"
      selectors = _.map selectors, (selector) -> "it[\'#{selector}\']"
      node.attributes[attributes[type].index].value =
        "{{= #{selectors.join(' || ')} || \'#{attributes[type].value}\'}}"
    catch

module.exports = SVGImage

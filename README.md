# postcss-svg
[PostCSS](https://github.com/postcss/postcss) plugin that insert inline SVG.

## Install
```bash
npm install postcss-svg --save-dev
```
## Usage
```javascript
//...
var postcss = require('postcss');
var postcssSVG = require('postcss-svg');
var processors = [
  //... ,
  postcssSVG({paths: ['pathToSVGDir1', 'pathToSVGDir2']})
]

postcss(processors)
  .process(css, { from: './src/app.css', to: './dist/app.css' })
  .then(function (result) {
    fs.writeFileSync('./dist/app.css', result.css);
  });
```
##Options
###paths
Type: `Array` Default: `['svg']` Example: `['pathToSVGDir1', 'pathToSVGDir2']` Required: `false`

Can define relative path to folders with SVG files.
## Example
###For live example run

```bash
npm install postcss-svg && cd $(npm root)/postcss-svg/ && node example/script.js
```
###Example source code
*example/script.js:*

```javascript
var postcss = require('postcss');
var postcssSVG = require('postcss-svg');
var open = require("open");
var fs = require('fs');
var css = fs.readFileSync('./example/style.css').toString();

css = postcss([ postcssSVG({paths: ['./example']}) ]).process(css).css
fs.writeFileSync('./example/output.css', css)
open("./example/index.html");
```

*example/style.css:*

```css
body {
  height: 100%;
  width: 100%;
  background-image: svg("loupe");
  background-size: 20px;
}

body:before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 50vh;
  height: 50vh;
  background: svg("loupe", "frameColor: #7D7779; handleColor: #9E4200;") no-repeat;
  margin-left: -25vh;
  margin-top: -25vh;
}

```

*example/loupe.svg:*

You can use features from [doT](http://olado.github.io/doT/) template engine.

```xml
<svg viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 12L8 8" stroke-linecap="square" stroke-width="2" stroke="{{=it.handleColor || '#000000'}}"/>
  <circle cx="5" cy="5" fill="rgba(15, 100, 250, .15)" r="4" stroke-width="2" stroke="{{=it.frameColor || '#000000'}}"/>
</svg>


```

***example/output.css:***

```css
body {
  height: 100%;
  width: 100%;
  background-image: url("data:image/svg+xml,%3Csvg%20viewBox%3D%220%200%2014%2014%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%20%3Cpath%20d%3D%22M12%2012L8%208%22%20stroke-linecap%3D%22square%22%20stroke-width%3D%222%22%20stroke%3D%22%23000000%22%2F%3E%20%3Ccircle%20cx%3D%225%22%20cy%3D%225%22%20fill%3D%22rgba(15%2C%20100%2C%20250%2C%20.15)%22%20r%3D%224%22%20stroke-width%3D%222%22%20stroke%3D%22%23000000%22%2F%3E%3C%2Fsvg%3E");
  background-size: 20px;
}

body:before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 50vh;
  height: 50vh;
  background: url("data:image/svg+xml,%3Csvg%20viewBox%3D%220%200%2014%2014%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%20%3Cpath%20d%3D%22M12%2012L8%208%22%20stroke-linecap%3D%22square%22%20stroke-width%3D%222%22%20stroke%3D%22%239E4200%22%2F%3E%20%3Ccircle%20cx%3D%225%22%20cy%3D%225%22%20fill%3D%22rgba(15%2C%20100%2C%20250%2C%20.15)%22%20r%3D%224%22%20stroke-width%3D%222%22%20stroke%3D%22%237D7779%22%2F%3E%3C%2Fsvg%3E") no-repeat;
  margin-left: -25vh;
  margin-top: -25vh;
}

```

*example/index.html*

```html
<!doctype html>
<html>
  <head>
    <title>postcss-svg test</title>
    <link href="output.css" rel="stylesheet">
  </head>
  <body></body>
</html>
```

##Contributing
Pull requests are welcome.

##License
MIT
# [postcss-svg](http://pavliko.github.io/postcss-svg/)
[PostCSS](https://github.com/postcss/postcss) plug-in which to insert inline SVG to CSS and allows you to manage it colors.
Examples [here](http://pavliko.github.io/postcss-svg/#examples)

**Features:**

* Easy insert inline SVG to CSS
* Manage colors of your SVG image without editinig it
* Symbols sprites support
* Compression with svgo
* Support Evil Icons from box

## Installation

```bash
npm install postcss-svg --save-dev
```

## Usage
PostCSS:

```javascript
//...
var postcss = require('postcss');
var postcssSVG = require('postcss-svg');
var processors = [
  //... ,
  postcssSVG({
    paths: ['pathToSVGDir1', 'pathToSVGDir2'],
    defaults: "[fill]: #000000",
    //more options...
  });
];

postcss(processors)
  .process(css, { from: './src/app.css', to: './dist/app.css' })
  .then(function (result) {
    fs.writeFileSync('./dist/app.css', result.css);
  });
```

Gulp:

```javascript
var gulp = require('gulp');
var postcss = require('gulp-postcss');

gulp.task('styles', function() {
  var postcssProcessors;
  postcssSVG = require.reload('postcss-svg');
  postcssProcessors = [
    postcssSVG({ defaults: '[fill]: green' })
  ];

  gulp.src('app/style.css')
    .pipe(postcss(postcssProcessors))
    .pipe(gulp.dest('.tmp'));
});
```

Using this `input.css`:

```css
body {
  background-image: svg("ei#sc-github", "[fill]: black");
}
```

you will get:

```css
body {
  background-image: url("data:image/svg+xml,%3Csvg%20id%3D%22ei-sc-github-icon%22%20viewBox%3D%220%200%2050%2050%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%20style%3D%22fill%3Ablack%3B%22%20height%3D%22100%25%22%20width%3D%22100%25%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20clip-rule%3D%22evenodd%22%20d%3D%22M25%2010c-8.3%200-15%206.7-15%2015%200%206.6%204.3%2012.2%2010.3%2014.2.8.1%201-.3%201-.7v-2.6c-4.2.9-5.1-2-5.1-2-.7-1.7-1.7-2.2-1.7-2.2-1.4-.9.1-.9.1-.9%201.5.1%202.3%201.5%202.3%201.5%201.3%202.3%203.5%201.6%204.4%201.2.1-1%20.5-1.6%201-2-3.3-.4-6.8-1.7-6.8-7.4%200-1.6.6-3%201.5-4-.2-.4-.7-1.9.1-4%200%200%201.3-.4%204.1%201.5%201.2-.3%202.5-.5%203.8-.5%201.3%200%202.6.2%203.8.5%202.9-1.9%204.1-1.5%204.1-1.5.8%202.1.3%203.6.1%204%201%201%201.5%202.4%201.5%204%200%205.8-3.5%207-6.8%207.4.5.5%201%201.4%201%202.8v4.1c0%20.4.3.9%201%20.7%206-2%2010.2-7.6%2010.2-14.2C40%2016.7%2033.3%2010%2025%2010z%22%2F%3E%3C%2Fsvg%3E");
}
```

## Options
#### paths
Type: `Array` Default: `['svg']` Example: `['pathToSVGDir1', 'pathToSVGDir2']` Required: `false`

You can define relative path to folders with SVG files.

#### func
Type: `String` Default: 'svg' Example: 'url' Required: `false`

You can set func option to 'url' to support fallback to url("*.svg") links.

#### svgo
Type: `Boolean`, `Object` Default: `false` Example: `true` Required: `false`

You can set custom config for svgo module. Recommend to set true only for production build.

#### defaults
Type: `String` Default: `''` Example: `'[fill]: #00F800; .glass[fill]: rgba(0, 0, 255, 0.1);'` Required: `false`

You can set default rules for all included SVG

#### ei
Type: `Boolean`, `Object` Default: `true` Example: `{ "dfaults": "[fill]: red" }` Required: `false`

You can set false to disable initializing Evil Icons. Or you can set different defaults only for Evil Icons.

#### debug
Type: `Boolean` Default: `false` Required: `false`

You can set false to disable initializing Evil Icons. Or you can set different defaults only for Evil Icons.

#### silent
Type: `Boolean` Default: `true` Required: `false`
Do not throw errors

## Colors API
You can replace only **existing** values of `fill` and `stroke` attributes.

To replace colors you can use simple selectors.

You can use several selectors for one SVG.

In the bottom you can see this selectors in ascending order.

For better understanding of selectors check [examples](http://pavliko.github.io/postcss-svg/#examples).

### Selectors:

#### [color]
All `fill` and `stroke` attributes
#### [fill]|[stroke]
All `fill` or `stroke` attributes
#### tagName[fill]|tagName[stroke]
`fill` or `stroke` tag attributes with name tagName
#### .className[fill]|.className[stroke]
`fill` or `stroke` tag attributes with class className
#### colorGroupN
All colors in SVG are grouped in color groups. N - group index, starts from 0 (from the top of SVG document)
#### \#identifier[fill]|\#identifier[stroke]
`fill` or `stroke` tag attributes with id identifier
#### colorN
All colors in SVG have index. N - index, starts from 0 (from the top of SVG document)

## [Examples](http://pavliko.github.io/postcss-svg/#examples)

## Contributing
Pull requests are welcome.
To run development envirement

```
git clone git@github.com:Pavliko/postcss-svg.git
cd postcss-svg
npm install
gulp watch
```

## [Changelog](CHANGELOG.md)

## [License](LCENSE)

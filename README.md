# PostCSS SVG [<img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS Logo" width="90" height="90" align="right">][postcss]

[![NPM Version][npm-img]][npm-url]
[![Linux Build Status][cli-img]][cli-url]
[![Windows Build Status][win-img]][win-url]
[![Gitter Chat][git-img]][git-url]

[PostCSS SVG] lets you inline SVGs in CSS.

```css
.icon--square {
  content: url("shared-sprites#square" param(--color blue));
}

/* after postcss-svg ↓ */

.icon--square {
  content: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Crect style='fill:blue' width='100%25' height='100%25'/%3E%3C/svg%3E");
}
```

[SVG Fragments] let you reference elements within an SVG. [SVG Parameters] let
you push compiled CSS variables into your SVGs.

```svg
<svg xmlns="http://www.w3.org/2000/svg">
  <symbol id="square">
    <rect style="fill:var(--color,black)" width="100%" height="100%"/>
  </symbol>
</svg>
```

[Modules] let you reference the `media` or `main` fields from a `package.json`:

```json
{
  "name": "shared-sprites",
  "media": "sprites.svg"
}
```

## Usage

Add [PostCSS SVG] to your build tool:

```bash
npm install postcss-svg --save-dev
```

#### Node

Use [PostCSS SVG] to process your CSS:

```js
require('postcss-svg').process(YOUR_CSS);
```

#### PostCSS

Add [PostCSS] to your build tool:

```bash
npm install postcss --save-dev
```

Use [PostCSS SVG] as a plugin:

```js
postcss([
  require('postcss-svg')()
]).process(YOUR_CSS);
```

#### Gulp

Add [Gulp PostCSS] to your build tool:

```bash
npm install gulp-postcss --save-dev
```

Use [PostCSS SVG] in your Gulpfile:

```js
var postcss = require('gulp-postcss');

gulp.task('css', function () {
  return gulp.src('./src/*.css').pipe(
    postcss([
      require('postcss-svg')()
    ])
  ).pipe(
    gulp.dest('.')
  );
});
```

#### Grunt

Add [Grunt PostCSS] to your build tool:

```bash
npm install grunt-postcss --save-dev
```

Use [PostCSS SVG] in your Gruntfile:

```js
grunt.loadNpmTasks('grunt-postcss');

grunt.initConfig({
  postcss: {
    options: {
      use: [
        require('postcss-svg')()
      ]
    },
    dist: {
      src: '*.css'
    }
  }
});
```

## Advanced Usage

Additional directories can be specified for locating SVGs.

```js
require('postcss-svg')({
  dirs: ['some-folder', 'another-folder'] /* Just a string will work, too */
})
```

UTF-8 encoding can be swapped for base64 encoding.

```js
require('postcss-svg')({
  utf8: false /* Whether to use utf-8 or base64 encoding. Default is true. */
})
```

[npm-url]: https://www.npmjs.com/package/postcss-svg
[npm-img]: https://img.shields.io/npm/v/postcss-svg.svg
[cli-url]: https://travis-ci.org/jonathantneal/postcss-svg
[cli-img]: https://img.shields.io/travis/jonathantneal/postcss-svg.svg
[win-url]: https://ci.appveyor.com/project/jonathantneal/postcss-svg
[win-img]: https://img.shields.io/appveyor/ci/jonathantneal/postcss-svg.svg
[git-url]: https://gitter.im/postcss/postcss
[git-img]: https://img.shields.io/badge/chat-gitter-blue.svg

[PostCSS SVG]: https://github.com/jonathantneal/postcss-svg
[PostCSS]: https://github.com/postcss/postcss
[SVG Fragments]: https://css-tricks.com/svg-fragment-identifiers-work/
[SVG Parameters]: https://tabatkins.github.io/specs/svg-params/
[Modules]: https://nodejs.org/api/modules.html#modules_modules
[Gulp PostCSS]: https://github.com/postcss/gulp-postcss
[Grunt PostCSS]: https://github.com/nDmitry/grunt-postcss

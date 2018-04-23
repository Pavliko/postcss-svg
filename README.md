# PostCSS SVG [<img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS Logo" width="90" height="90" align="right">][postcss]

[![NPM Version][npm-img]][npm-url]
[![Linux Build Status][cli-img]][cli-url]
[![Windows Build Status][win-img]][win-url]
[![Support Chat][git-img]][git-url]

[PostCSS SVG] lets you inline SVGs in CSS.

```pcss
.icon--square {
  content: url("shared-sprites#square" param(--color blue));
}

/* becomes */

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

The location of an SVG is intelligently resolved using the
[SVG Resolve Algorithm].

## Usage

Add [PostCSS SVG] to your build tool:

```bash
npm install postcss-svg --save-dev
```

#### Node

Use [PostCSS SVG] to process your CSS:

```js
import postcssSVG from 'postcss-svg';

postcssSVG.process(YOUR_CSS);
```

#### PostCSS

Add [PostCSS] to your build tool:

```bash
npm install postcss --save-dev
```

Use [PostCSS SVG] as a plugin:

```js
import postcss from 'gulp-postcss';
import postcssSVG from 'postcss-svg';

postcss([
  postcssSVG(/* options */)
]).process(YOUR_CSS);
```

#### Webpack

Add [PostCSS Loader] to your build tool:

```bash
npm install postcss-loader --save-dev
```

Use [PostCSS SVG] in your Webpack configuration:

```js
import postcssSVG from 'postcss-svg';

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          { loader: 'css-loader', options: { importLoaders: 1 } },
          { loader: 'postcss-loader', options: {
            ident: 'postcss',
            plugins: () => [
              postcssSVG(/* options */)
            ]
          } }
        ]
      }
    ]
  }
}
```

#### Gulp

Add [Gulp PostCSS] to your build tool:

```bash
npm install gulp-postcss --save-dev
```

Use [PostCSS SVG] in your Gulpfile:

```js
import postcss from 'gulp-postcss';
import postcssSVG from 'postcss-svg';

gulp.task('css', () => gulp.src('./src/*.css').pipe(
  postcss([
    postcssSVG(/* options */)
  ])
).pipe(
  gulp.dest('.')
));
```

#### Grunt

Add [Grunt PostCSS] to your build tool:

```bash
npm install grunt-postcss --save-dev
```

Use [PostCSS SVG] in your Gruntfile:

```js
import postcssSVG from 'postcss-svg';

grunt.loadNpmTasks('grunt-postcss');

grunt.initConfig({
  postcss: {
    options: {
      use: [
       postcssSVG(/* options */)
      ]
    },
    dist: {
      src: '*.css'
    }
  }
});
```

## Options

### dirs

The `dirs` option specifies additional directories used to locate SVGs.

```js
postcssSVG({
  dirs: ['some-folder', 'another-folder'] /* Just a string will work, too */
})
```

The `utf8` option determines whether the SVG is UTF-8 encoded or base64 encoded.

```js
postcssSVG({
  utf8: false /* Whether to use utf-8 or base64 encoding. Default is true. */
})
```

The `svgo` option determines whether and how [svgo] compression is used.

```js
postcssSVG({
  svgo: { plugins: [{ cleanupAttrs: true }] } /* Whether and how to use svgo compression. Default is false. */
})
```

[cli-url]: https://travis-ci.org/jonathantneal/postcss-svg
[cli-img]: https://img.shields.io/travis/jonathantneal/postcss-svg.svg
[git-url]: https://gitter.im/postcss/postcss
[git-img]: https://img.shields.io/badge/support-chat-blue.svg
[npm-url]: https://www.npmjs.com/package/postcss-svg
[npm-img]: https://img.shields.io/npm/v/postcss-svg.svg
[win-url]: https://ci.appveyor.com/project/jonathantneal/postcss-svg
[win-img]: https://img.shields.io/appveyor/ci/jonathantneal/postcss-svg.svg

[Grunt PostCSS]: https://github.com/nDmitry/grunt-postcss
[Gulp PostCSS]: https://github.com/postcss/gulp-postcss
[Modules]: https://nodejs.org/api/modules.html#modules_modules
[PostCSS]: https://github.com/postcss/postcss
[PostCSS Loader]: https://github.com/postcss/postcss-loader
[PostCSS SVG]: https://github.com/jonathantneal/postcss-svg
[SVG Fragments]: https://css-tricks.com/svg-fragment-identifiers-work/
[SVG Parameters]: https://tabatkins.github.io/specs/svg-params/
[SVG Resolve Algorithm]: lib/read-closest-svg.md
[svgo]: https://github.com/svg/svgo

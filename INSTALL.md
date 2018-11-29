# Installing PostCSS SVG

[PostCSS SVG] runs in all Node environments, with special instructions for:

| [Node](#node) | [PostCSS CLI](#postcss-cli) | [Webpack](#webpack) | [Create React App](#create-react-app) | [Gulp](#gulp) | [Grunt](#grunt) |
| --- | --- | --- | --- | --- | --- |

## Node

Add [PostCSS SVG] to your project:

```bash
npm install postcss-svg --save-dev
```

Use [PostCSS SVG] to process your CSS:

```js
const postcssSVG = require('postcss-svg');

postcssSVG.process(YOUR_CSS /*, processOptions, pluginOptions */);
```

Or use it as a [PostCSS] plugin:

```js
const postcss = require('postcss');
const postcssSVG = require('postcss-svg');

postcss([
  postcssSVG(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

## PostCSS CLI

Add [PostCSS CLI] to your project:

```bash
npm install postcss-cli --save-dev
```

Use [PostCSS SVG] in your `postcss.config.js` configuration file:

```js
const postcssSVG = require('postcss-svg');

module.exports = {
  plugins: [
    postcssSVG(/* pluginOptions */)
  ]
}
```

## Webpack

Add [PostCSS Loader] to your project:

```bash
npm install postcss-loader --save-dev
```

Use [PostCSS SVG] in your Webpack configuration:

```js
const postcssSVG = require('postcss-svg');

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
              postcssSVG(/* pluginOptions */)
            ]
          } }
        ]
      }
    ]
  }
}
```

## Create React App

Add [React App Rewired] and [React App Rewire PostCSS] to your project:

```bash
npm install react-app-rewired react-app-rewire-postcss --save-dev
```

Use [React App Rewire PostCSS] and [PostCSS SVG] in your
`config-overrides.js` file:

```js
const reactAppRewirePostcss = require('react-app-rewire-postcss');
const postcssSVG = require('postcss-svg');

module.exports = config => reactAppRewirePostcss(config, {
  plugins: () => [
    postcssSVG(/* pluginOptions */)
  ]
});
```

## Gulp

Add [Gulp PostCSS] to your project:

```bash
npm install gulp-postcss --save-dev
```

Use [PostCSS SVG] in your Gulpfile:

```js
const postcss = require('gulp-postcss');
const postcssSVG = require('postcss-svg');

gulp.task('css', () => gulp.src('./src/*.css').pipe(
  postcss([
    postcssSVG(/* pluginOptions */)
  ])
).pipe(
  gulp.dest('.')
));
```

## Grunt

Add [Grunt PostCSS] to your project:

```bash
npm install grunt-postcss --save-dev
```

Use [PostCSS SVG] in your Gruntfile:

```js
const postcssSVG = require('postcss-svg');

grunt.loadNpmTasks('grunt-postcss');

grunt.initConfig({
  postcss: {
    options: {
      use: [
       postcssSVG(/* pluginOptions */)
      ]
    },
    dist: {
      src: '*.css'
    }
  }
});
```

[Gulp PostCSS]: https://github.com/postcss/gulp-postcss
[Grunt PostCSS]: https://github.com/nDmitry/grunt-postcss
[PostCSS]: https://github.com/postcss/postcss
[PostCSS CLI]: https://github.com/postcss/postcss-cli
[PostCSS Loader]: https://github.com/postcss/postcss-loader
[PostCSS SVG]: https://github.com/jonathantneal/postcss-svg
[React App Rewire PostCSS]: https://github.com/csstools/react-app-rewire-postcss
[React App Rewired]: https://github.com/timarney/react-app-rewired

# PostCSS SVG [<img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS" width="90" height="90" align="right">][postcss]

[![NPM Version][npm-img]][npm-url]
[![Build Status][cli-img]][cli-url]
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

[PostCSS SVG] runs in all Node environments, with special instructions for:

| [Node](INSTALL.md#node) | [PostCSS CLI](INSTALL.md#postcss-cli) | [Webpack](INSTALL.md#webpack) | [Create React App](INSTALL.md#create-react-app) | [Gulp](INSTALL.md#gulp) | [Grunt](INSTALL.md#grunt) |
| --- | --- | --- | --- | --- | --- |

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

[cli-img]: https://img.shields.io/travis/jonathantneal/postcss-svg.svg
[cli-url]: https://travis-ci.org/jonathantneal/postcss-svg
[git-img]: https://img.shields.io/badge/support-chat-blue.svg
[git-url]: https://gitter.im/postcss/postcss
[npm-img]: https://img.shields.io/npm/v/postcss-svg.svg
[npm-url]: https://www.npmjs.com/package/postcss-svg

[PostCSS]: https://github.com/postcss/postcss
[PostCSS SVG]: https://github.com/jonathantneal/postcss-svg
[Modules]: https://nodejs.org/api/modules.html#modules_modules
[SVG Fragments]: https://css-tricks.com/svg-fragment-identifiers-work/
[SVG Parameters]: https://tabatkins.github.io/specs/svg-params/
[SVG Resolve Algorithm]: lib/read-closest-svg.md
[svgo]: https://github.com/svg/svgo

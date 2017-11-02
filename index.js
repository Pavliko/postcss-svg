/* Tooling
/* ========================================================================== */

// native tooling
const path = require('path');

// external tooling
const postcss = require('postcss');

// internal tooling
const transpileDecl = require('./lib/transpile-decl');

/* Inline SVGs
/* ========================================================================== */

module.exports = postcss.plugin('postcss-svg-fragments', argopts => (css, result) => {
	// svg promises array
	const promises = [];

	// plugin options
	const opts = {
		// additional directories to search for SVGs
		dirs: argopts && 'dirs' in argopts ? [].concat(argopts.dirs) : [],
		// whether to encode as utf-8
		utf8: argopts && 'utf8' in argopts ? Boolean(argopts.utf8) : true,
		// whether and how to compress with svgo
		svgo: argopts && 'svgo' in argopts ? Object(argopts.svgo) : false
	};

	// path to the current working directory by stylesheet
	const cssWD = css.source && css.source.input && css.source.input.file ? path.dirname(css.source.input.file) : process.cwd();

	// cache of file content and json content promises
	const cache = {};

	// for each declaration in the stylesheet
	css.walkDecls(decl => {
		// if the declaration contains a url()
		if (containsUrlFunction(decl)) {
			// path to the current working directory by declaration
			const declWD = decl.source && decl.source.input && decl.source.input.file ? path.dirname(decl.source.input.file) : cssWD;

			// transpile declaration parts
			transpileDecl(result, promises, decl, declWD, opts, cache);
		}
	});

	// return chained svg promises array
	return Promise.all(promises);
});

/* Inline Tooling
/* ========================================================================== */

// whether the declaration contains a url()
function containsUrlFunction(decl) {
	return /(^|\s)url\(.+\)(\s|$)/.test(decl.value);
}

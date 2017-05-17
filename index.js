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

module.exports = postcss.plugin('postcss-svg-fragments', (rawopts) => (css, result) => {
	// svg promises array
	const promises = [];

	// plugin options
	const opts = {
		// additional directories to search for SVGs
		dirs: rawopts && 'dirs' in rawopts ? typeof rawopts.dirs === 'string' ? [rawopts.dirs] : Array.from(rawopts.dirs) : [],
		// whether to encode as utf-8
		utf8: rawopts && 'utf8' in rawopts ? Boolean(rawopts.utf8) : true
	};

	// path to the current working directory by stylesheet
	const cssCWD = css.source && css.source.input && css.source.input.file ? path.dirname(css.source.input.file) : process.cwd();

	// for each declaration in the stylesheet
	css.walkDecls(
		(decl) => {
			// if the declaration contains a url()
			if (containsUrlFunction(decl)) {
				// path to the current working directory by declaration
				const declCWD = decl.source && decl.source.input && decl.source.input.file ? path.dirname(decl.source.input.file) : cssCWD;

				// transpile declaration parts
				transpileDecl(result, promises, decl, declCWD, opts);
			}
		}
	);

	// return chained svg promises array
	return Promise.all(promises);
});

/* Inline Tooling
/* ========================================================================== */

// whether the declaration contains a url()
function containsUrlFunction(decl) {
	return /(^|\s)url\(.+\)(\s|$)/.test(decl.value);
}

/* Tooling
/* ========================================================================== */

// external tooling
import postcss from 'postcss';

// internal tooling
import transpileDecl from './lib/transpile-decl';

/* Inline SVGs
/* ========================================================================== */

export default postcss.plugin('postcss-svg-fragments', opts => (css, result) => {
	// svg promises array
	const promises = [];

	// plugin options
	const normalizedOpts = {
		// additional directories to search for SVGs
		dirs: 'dirs' in Object(opts) ? [].concat(opts.dirs) : [],
		// whether to encode as utf-8
		utf8: 'utf8' in Object(opts) ? Boolean(opts.utf8) : true,
		// whether and how to compress with svgo
		svgo: 'svgo' in Object(opts) ? Object(opts.svgo) : false
	};

	// cache of file content and json content promises
	const cache = {};

	// for each declaration in the stylesheet
	css.walkDecls(decl => {
		// if the declaration contains a url()
		if (containsUrlFunction(decl)) {
			// transpile declaration parts
			transpileDecl(result, promises, decl, normalizedOpts, cache);
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

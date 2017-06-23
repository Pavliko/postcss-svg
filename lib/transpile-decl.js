/* Tooling
/* ========================================================================== */

// native tooling
const path = require('path');

// external tooling
const parser = require('postcss-value-parser');

// internal tooling
const elementClone     = require('./element-clone');
const elementById      = require('./element-by-id');
const elementAsDataURI = require('./element-as-data-uri');
const readClosestSVG   = require('./read-closest-svg');
const transpileStyles  = require('./transpile-styles');

/* Transpile declarations
/* ========================================================================== */

module.exports = (result, promises, decl, cwd, opts) => {
	// walk each node of the declaration
	const declAST = parser(decl.value).walk(
		(node) => {
			// if the node is a url containing an svg fragment
			if (isExternalURLFunction(node)) {
				// <url> of url(<url>)
				const urlNode = node.nodes[0];

				// <url> split by #
				const urlParts = urlNode.value.split('#');

				// <url> src
				const src = urlParts[0];

				// url fragment identifier
				const id = urlParts.slice(1).join('#');

				// whether the <url> has a fragment identifier
				const hasID = urlParts.length > 1;

				// <url> param()s
				const params = paramsFromNodes(
					node.nodes.splice(1)
				);

				promises.push(
					readClosestSVG(cwd, src, opts.dirs).then(
						(document) => {
							// document cache
							const ids = document.ids = document.ids || {};

							// conditionally update document cache
							if (hasID && !ids[id]) {
								ids[id] = elementById(document, id);
							}

							// get the element fragment or document
							const element = hasID ? ids[id] : document;

							// if the element exists
							if (element) {
								// clone of the element
								const clone = elementClone(element);

								// update the clone styles with param
								transpileStyles(clone, params);

								// update <url>
								urlNode.value = elementAsDataURI(clone, document, opts.utf8);

								// conditionally quote <url>
								if (opts.utf8) {
									urlNode.quote = '"';
									urlNode.type = 'string';
								}

								// update declaration
								decl.value = declAST.toString();
							}
						}
					).catch(
						(error) => {
							result.warn(error, node);
						}
					)
				);
			}
		}
	);
};

/* Inline Tooling
/* ========================================================================== */

// whether the node if a function()
function isExternalURLFunction(node) {
	return node.type === 'function' && node.value === 'url' && node.nodes && node.nodes[0] && (/^(?!data:)/).test(node.nodes[0].value);
}

// params from nodes
function paramsFromNodes(nodes) {
	// valid params as an object
	const params = {};

	// for each node
	nodes.forEach(
		(node) => {
			// conditionally add the valid param
			if (isFilledParam(node)) {
				params[node.nodes[0].value] = parser.stringify( node.nodes[2] );
			}
		}
	);

	// return valid params as an object
	return params;
}

// whether the node is a filled param()
function isFilledParam(node) {
	return node.type === 'function' && node.value === 'param' && node.nodes.length === 3 && node.nodes[0].type === 'word';
}

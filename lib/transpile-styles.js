'use strict';

/* Tooling
/* ========================================================================== */

// external tooling
const parser  = require('postcss-value-parser');
const postcss = require('postcss');

/* Transpile element styles with params
/* ========================================================================== */

module.exports = (element, params) => {
	if (hasStyleAttr(element)) {
		// conditionally update the style attribute
		element.attr.style = updatedStyleAttr(element.attr.style, params);
	}

	if (element.children) {
		// conditionally walk the child elements
		let index = -1;
		let child;

		while (child = element.children[++index]) {
			module.exports(child, params);
		}
	}
};

/* Inline Tooling
/* ========================================================================== */

function hasStyleAttr(element) {
	return element.attr && element.attr.style;
}

function updatedStyleAttr(style, params) {
	// parse the style attribute
	const styleAST = postcss.parse(style);

	// walk the declarations within the style attribute
	styleAST.walkDecls(
		(decl) => {
			// update the declaration with all transpiled var()s
			decl.value = parser(decl.value).walk(
				(node) => {
					// conditionally update the var()
					if (isVarFuntion(node)) {
						transpileVar(node, params);
					}
				}
			).toString();
		}
	);

	// return the updated style attribute
	return styleAST.toString();
}

// whether the node is a var()
function isVarFuntion(node) {
	return node.type === 'function' && node.value === 'var' && node.nodes && node.nodes.length && /^--/.test(node.nodes[0].value);
}

// transpile var()
function transpileVar(node, params) {
	// css variable
	const cssvar = node.nodes[0].value;

	// css variable backup value
	const backup = node.nodes[2] && node.nodes[2].value;

	if (cssvar in params) {
		// conditionally transpile the css var() function into the matched param
		node.type = 'word';
		node.value = params[cssvar];
	} else if (backup) {
		// conditionally transpile the css var() function into the backup value
		node.type = 'word';
		node.value = backup;
	}
}

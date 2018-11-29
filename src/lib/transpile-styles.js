/* Tooling
/* ========================================================================== */

// external tooling
import parser  from 'postcss-values-parser';
import postcss from 'postcss';

/* Transpile element styles with params
/* ========================================================================== */

export default function transpileStyles(element, params) {
	if (hasStyleAttr(element)) {
		// conditionally update the style attribute
		element.attr.style = updatedStyleAttr(element.attr.style, params);
	}

	if (element.children) {
		// conditionally walk the child elements
		let index = -1;
		let child;

		while (child = element.children[++index]) {
			transpileStyles(child, params);
		}
	}
}

/* Inline Tooling
/* ========================================================================== */

function hasStyleAttr(element) {
	return element.attr && element.attr.style;
}

function updatedStyleAttr(style, params) {
	// parse the style attribute
	const styleAST = postcss.parse(style);

	// walk the declarations within the style attribute
	styleAST.walkDecls(decl => {
		const declAST = parser(decl.value).parse();

		// update the declaration with all transpiled var()s
		declAST.walk(node => {
			// conditionally update the var()
			if (isVarFuntion(node)) {
				transpileVar(node, params);
			}
		});

		decl.value = declAST.toString();
	});

	// return the updated style attribute
	return styleAST.toString();
}

// whether the node is a var()
function isVarFuntion(node) {
	return node.type === 'func' && node.value === 'var' && Object(node.nodes).length && /^--/.test(node.nodes[1].value);
}

// transpile var()
function transpileVar(node, params) {
	// css variable
	const cssvar = node.nodes[1].value;

	// css variable backup value
	const backup = node.nodes[3];

	if (cssvar in params) {
		// conditionally transpile the css var() function into the matched param
		node.replaceWith(
			parser.word({ value: params[cssvar] })
		);
	} else if (backup) {
		// conditionally transpile the css var() function into the backup value
		node.replaceWith(backup);
	}
}

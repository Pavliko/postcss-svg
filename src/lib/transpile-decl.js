/* Tooling
/* ========================================================================== */

// native tooling
import path from 'path';

// external tooling
import parser from 'postcss-values-parser';

// internal tooling
import elementClone     from './element-clone';
import elementById      from './element-by-id';
import elementAsDURISVG from './element-as-data-uri-svg';
import readClosestSVG   from './read-closest-svg';
import transpileStyles  from './transpile-styles';

/* Transpile declarations
/* ========================================================================== */

export default function transpileDecl(result, promises, decl, opts, cache) { // eslint-disable-line max-params
	// path to the current working file and directory by declaration
	const declWF = path.resolve(decl.source && decl.source.input && decl.source.input.file ? decl.source.input.file : result.root.source && result.root.source.input && result.root.source.input.file ? result.root.source.input.file : path.join(process.cwd(), 'index.css'));
	const declWD = path.dirname(declWF);

	// list of files to watch
	const files = {};

	// walk each node of the declaration
	const declAST = parser(decl.value).parse();

	declAST.walk(node => {
		// if the node is a url containing an svg fragment
		if (isExternalURLFunction(node)) {
			// <url> of url(<url>)
			const urlNode = node.nodes[1];

			// <url> split by fragment identifier symbol (#)
			const urlParts = urlNode.value.split('#');

			// <url> src
			const src = urlParts[0];

			// <url> fragment identifier
			const id = urlParts.slice(1).join('#');

			// whether the <url> has a fragment identifier
			const hasID = urlParts.length > 1;

			// <url> param()s
			const params = paramsFromNodes(
				node.nodes.slice(2, -1)
			);

			node.nodes.slice(2, -1).forEach(childNode => {
				childNode.remove();
			});

			promises.push(
				readClosestSVG(src, [declWD].concat(opts.dirs), cache).then(svgResult => {
					const file = svgResult.file;
					const document = svgResult.document;

					// conditionally watch svgs for changes
					if (!files[file]) {
						files[file] = result.messages.push({
							type: 'dependency',
							file,
							parent: declWF
						});
					}

					// document cache
					const ids = document.ids = document.ids || {};

					// conditionally update the document cache
					if (hasID && !ids[id]) {
						ids[id] = elementById(document, id);
					}

					// element fragment or document
					const element = hasID ? ids[id] : document;

					// if the element exists
					if (element) {
						// clone of the element
						const clone = elementClone(element);

						// update the clone styles using the params
						transpileStyles(clone, params);

						// promise updated <url> and declaration
						return elementAsDURISVG(clone, document, opts).then(xml => {
							// update <url>
							urlNode.value = xml;

							// conditionally quote <url>
							if (opts.utf8) {
								urlNode.replaceWith(
									parser.string({
										value: urlNode.value,
										quoted: true,
										raws: Object.assign(urlNode.raws, { quote: '"' })
									})
								);
							}

							// update declaration
							decl.value = String(declAST);
						});
					}
				}).catch(error => {
					result.warn(error, node);
				})
			);
		}
	});
}

/* Inline Tooling
/* ========================================================================== */

// whether the node if a function()
function isExternalURLFunction(node) {
	return node.type === 'func' && node.value === 'url' && Object(node.nodes).length && (/^(?!data:)/).test(node.nodes[1].value);
}

// params from nodes
function paramsFromNodes(nodes) {
	// valid params as an object
	const params = {};

	// for each node
	nodes.forEach(node => {
		// conditionally add the valid param
		if (isFilledParam(node)) {
			params[node.nodes[1].value] = String(node.nodes[2]).trim();
		}
	});

	// return valid params as an object
	return params;
}

// whether the node is a filled param()
function isFilledParam(node) {
	return node.type === 'func' && node.value === 'param' && node.nodes.length === 4 && node.nodes[1].type === 'word';
}

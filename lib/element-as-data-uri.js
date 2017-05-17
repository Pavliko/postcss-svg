/* Element as a data URI
/* ========================================================================== */

module.exports = (element, document, utf8) => {
	// rebuild element as <svg>
	element.name = 'svg';

	delete element.attr.id;

	element.attr.viewBox = element.attr.viewBox || document.attr.viewBox;

	element.attr.xmlns = 'http://www.w3.org/2000/svg';

	const xml = element.toString({
		compressed: true
	});

	// return data URI
	return `data:image/svg+xml;${ utf8 ? `charset=utf-8,${ encodeUTF8(xml) }` : `base64,${ new Buffer(xml).toString('base64') }` }`;
};

/* Inline Tooling
/* ========================================================================== */

// return a UTF-8-encoded string
function encodeUTF8(string) {
	// encode as UTF-8
	return encodeURIComponent(
		string.replace(
			// collapse whitespace
			/[\n\r\s\t]+/g, ' '
		).replace(
			// remove comments
			/<\!--([\W\w]*(?=-->))-->/g, ''
		).replace(
			// pre-encode ampersands
			/&/g, '%26'
		)
	).replace(
		// escape commas
		/'/g, '\\\''
	).replace(
		// un-encode compatible characters
		/%20/g, ' '
	).replace(
		/%22/g, '\''
	).replace(
		/%2F/g, '/'
	).replace(
		/%3A/g, ':'
	).replace(
		/%3D/g, '='
	).replace(
		// encode additional incompatible characters
		/\(/g, '%28'
	).replace(
		/\)/g, '%29'
	);
}

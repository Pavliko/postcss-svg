/* Tooling
/* ========================================================================== */

// external tooling
import Svgo from 'svgo';

/* Element as a data URI SVG
/* ========================================================================== */

export default function elementAsDataURISvg(element, document, opts) {
	// rebuild element as <svg>
	element.name = 'svg';

	delete element.attr.id;

	element.attr.viewBox = element.attr.viewBox || document.attr.viewBox;

	element.attr.xmlns = 'http://www.w3.org/2000/svg';

	const xml = element.toString({
		compressed: true
	});

	// promise data URI
	return (opts.svgo
		? new Svgo(opts.svgo).optimize(xml)
	: Promise.resolve({ data: xml }))
	.then(result => `data:image/svg+xml;${opts.utf8 ? `charset=utf-8,${encodeUTF8(result.data)}` : `base64,${Buffer.from(result.data).toString('base64')}`}`);
}

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

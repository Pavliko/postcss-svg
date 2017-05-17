'use strict';

/* Clone from element
/* ========================================================================== */

module.exports = (element) => {
	// element clone
	const clone = {};

	// for each key in the element
	for (let key in element) {
		if (element[key] instanceof Array) {
			// conditionally clone the child array
			clone[key] = element[key].map(module.exports);
		} else if (typeof element[key] === 'object') {
			// otherwise, conditionally clone the child object
			clone[key] = module.exports(element[key]);
		} else {
			// otherwise, copy the child
			clone[key] = element[key];
		}
	}

	// return the element clone
	return clone;
};

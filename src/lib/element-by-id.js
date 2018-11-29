/* Element by ID
/* ========================================================================== */

export default function elementById(element, id) {
	// conditionally return the matching element
	if (element.attr && element.attr.id === id) {
		return element;
	} else if (element.children) {
		// otherwise, return matching child elements
		let index = -1;
		let child;

		while (child = element.children[++index]) {
			child = elementById(child, id);

			if (child) {
				return child;
			}
		}
	}

	// return undefined if no matching elements are find
	return undefined;
}

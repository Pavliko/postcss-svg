/* Tooling
/* ========================================================================== */

// native tooling
const fs   = require('fs');
const path = require('path');

// external tooling
const XmlDocument = require('xmldoc').XmlDocument;

/* Promise the XML tree of the closest direct or directory/module-relative svg
/* ========================================================================== */

module.exports = (cwd, src, dirs) => {
	// unique id from the current working directory and the src
	const uuid = [cwd, src].join();

	// segmented paths (the src always uses slash segmentation)
	const cwds = cwd.split(path.sep);
	const srcs = src.split('/');

	// cached promise for the closest svg
	cache[uuid] = cache[uuid] || [
		// direct relative directory
		cwds.concat(srcs).join(path.sep)
	].concat(
		// closest module directories
		cwds.map(
			(segment, index) => [].concat(
				cwds.slice(0, index + 1),
				'node_modules',
				srcs[0],
				srcs.slice(1)
			).join(path.sep)
		).reverse()
	).reduce(
		// promise the closest module-relative file
		(promise, modulePath) => promise.catch(
			// promise whether the module-relative package.json can be accessed
			() => access(
				path.join(modulePath, 'package.json')
			).then(
				// if the package.json can be accessed;
				// promise the json contents of the package.json
				() => readJSON(
					path.join(modulePath, 'package.json')
				).then(
					// promise whether the module-specified file can be accessed
					(pkg) => accessFile(
						path.join(
							modulePath,
							pkg.media || pkg.main
						)
					)
				),
				// if the package.json cannot be accessed;
				// promise whether the module-relative file can be accessed
				() => srcs.slice(1).length ? accessFile(
					path.join(modulePath)
				) : Promise.reject()
			)
		),
		dirs.map(
			(dir) => path.resolve(cwd, dir).split(path.sep).concat(srcs).join(path.sep)
		).reduce(
			// promise the first directory-relative file
			(promise, dir) => promise.catch(
				// promise the directory-relative file
				() => accessFile(dir)
			),
			// promise the direct file
			accessFile(
				cwds.concat(srcs).join(path.sep)
			)
		)
	).then(
		// promise the contents of the file
		readFile
	).then(
		// promise the xml tree of the contents
		(contents) => new XmlDocument(contents)
	);

	// return the promise for the closest file
	return cache[uuid];
}

/* Promise Cache
/* ========================================================================== */

const cache = {};

/* Inline Tooling
/* ========================================================================== */

// promise the file path if the file can be accessed
function access(pathname) {
	return new Promise(
		(resolve, reject) => fs.access(
			pathname,
			(error) => error ? reject(error) : resolve(pathname)
		)
	);
}

// promise the file path if the file is a file
function accessFile(pathname) {
	return new Promise(
		(resolvePromise, rejectPromise) => fs.lstat(
			pathname,
			(error, stats) => error ? rejectPromise(error) : stats.isFile() ? resolvePromise(pathname) : rejectPromise(`${pathname} is not a file`)
		)
	);
}

// promise the file contents
function readFile(pathname) {
	return new Promise(
		(resolvePromise, rejectPromise) => fs.readFile(
			pathname,
			'utf8',
			(error, contents) => error ? rejectPromise(error) : resolvePromise(contents)
		)
	);
}

// promise the json contents
function readJSON(pathname) {
	return readFile(pathname).then(
		(contents) => JSON.parse(contents)
	);
}

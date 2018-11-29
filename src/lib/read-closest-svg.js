/* Tooling
/* ========================================================================== */

// native tooling
import fs from 'fs';
import path from 'path';

// external tooling
import { XmlDocument } from 'xmldoc';

/* Promise the XML tree of the closest svg
/* ========================================================================== */

export default function readClosestSVG(id, wds, cache) {
	return wds.reduce(
		// for each working directory
		(promise, wd) => promise.catch(() => {
			// set cwd as the current working directory
			let cwd = wd;

			// if id starts with root
			if (starts_with_root(id)) {
				// set cwd as the root
				cwd = '';
			}

			// resolve as a file using cwd/id as file
			return resolveAsFile(path.join(cwd, id), cache)
			// otherwise, resolve as a directory using cwd/id as dir
			.catch(() => resolve_as_directory(path.join(cwd, id), cache))
			// otherwise, if id does not start with root or relative
			.catch(() => !starts_with_root_or_relative(id)
				// resolve as a module using cwd and id
				? resolve_as_module(cwd, id, cache)
				: Promise.reject()
			)
			// otherwise, reject as id not found
			.catch(() => Promise.reject(`${id} not found`));
		}),
		Promise.reject()
	).then(
		// resolve xml contents
		(result) => ({
			file: result.file,
			document: new XmlDocument(result.contents)
		})
	);
}

function resolveAsFile(file, cache) {
	// if file is a file, resolve the contents of file
	return file_contents(file, cache)
	// otherwise, if file.svg is a file, resolve the contents of file.svg
	.catch(() => file_contents(`${file}.svg`, cache));
}

function resolve_as_directory(dir, cache) {
	// if dir/package.json is a file, set pkg as the JSON contents of dir/package.json
	return json_contents(dir, cache).then(
		// if pkg contains a media field
		pkg => 'media' in pkg
			// resolve the contents of dir/pkg.media
			? file_contents(path.join(dir, pkg.media), cache)
		// otherwise, if pkg contains a main field
		: 'main' in pkg
			// resolve the contents of dir/pkg.main
			? file_contents(path.join(dir, pkg.main), cache)
		// otherwise, if dir/index.svg is a file, resolve the contents of dir/index.svg
		: file_contents(path.join(dir, 'index.svg'), cache)
	);
}

function resolve_as_module(cwd, id, cache) {
	return node_modules_dirs(cwd).reduce(
		// for each dir in module dirs using cwd:
		(promise, dir) => promise.catch(
			// resolve as a file using dir/id as file
			() => resolveAsFile(path.join(dir, id), cache)
				// otherwise, resolve as a directory using dir/id as dir
				.catch(() => resolve_as_directory(path.join(dir, id), cache))
		),
		Promise.reject()
	);
}

function node_modules_dirs(cwd) {
	// set segments as cwd split by the separator
	const segments = cwd.split(path.sep);

	// set count as the length of segments
	let count = segments.length;

	// set dirs as an empty array
	const dirs = [];

	// while count is greater than 0:
	while (count > 0) {
		// if segments[count] is not node_modules
		if (segments[count] !== 'node_modules') {
			// push a new item to dirs as the separator-joined segments[0 - count] and node_modules
			dirs.push(
				path.join(segments.slice(0, count).join('/') || '/', 'node_modules')
			);
		}

		// set count as count minus 1
		--count;
	}

	return dirs;
}

function file_contents(file, cache) {
	// if file is a file, resolve the contents of file
	cache[file] = cache[file] || new Promise(
		(resolvePromise, rejectPromise) => fs.readFile(
			file,
			'utf8',
			(error, contents) => error ? rejectPromise(error) : resolvePromise({
				file,
				contents
			})
		)
	);

	return cache[file];
}

function json_contents(dir, cache) {
	// path of dir/package.json
	const pkg = path.join(dir, 'package.json');

	// resolve the JSON contents of dir/package.json
	cache[pkg] = cache[pkg] || new Promise(
		(resolvePromise, rejectPromise) => fs.readFile(
			pkg,
			'utf8',
			(error, contents) => error ? rejectPromise(error) : resolvePromise(JSON.parse(contents))
		)
	);

	return cache[pkg];
}

function starts_with_root(id) {
	return /^\//.test(id);
}

function starts_with_root_or_relative(id) {
	return /^\.{0,2}\//.test(id);
}

# SVG Resolve Algorithm

The following high-level algorithm is used to resolve the location and contents
of an SVG found within `url(id)` from `cwd`:

1. if `id` starts with [root](#root), set `cwd` as the [root](#root)
2. [resolve as a file](#resolve-as-a-file) using `cwd/id` as `file`
3. otherwise, [resolve as a directory](#resolve-as-a-directory) using `cwd/id`
   as `dir`
4. otherwise, if `id` does not start with [root](#root) or
   [relative](#relative), [resolve as a module](#resolve-as-a-module) using
   `cwd` and `id`
5. otherwise, reject as `id not found`

## Resolve as a File

1. if `file` is a file, resolve the contents of `file`
2. otherwise, if `file.svg` is a file, resolve the contents of `file.svg`

## Resolve as a Directory

1. if `dir/package.json` is a file, set `pkg` as the JSON contents of
   `dir/package.json`
   1. if `pkg` contains a `media` field
      1. resolve the contents of `dir/pkg.media`
   2. otherwise, if `pkg` contains a `main` field
      1. resolve the contents of `dir/pkg.main`
   3. otherwise, if `id/index.svg` is a file
      1. resolve the contents of `dir/index.svg`

## Resolve as a Module

1. for each `dir` in [module dirs](#module-dirs) using `cwd`:
   1. [resolve as a file](#resolve-as-a-file) using `dir/id` as `file`
   2. otherwise, [resolve as a directory](#resolve-as-a-directory) using
      `dir/id` as `dir`

---

## Module Dirs

1. set `segments` as `cwd` split by the [separator](#separator)
2. set `count` as the length of `segments`
3. set `dirs` as an empty list
4. while `count` is greater than `0`:
   1. if `segments[count]` is not `node_modules`
      1. push a new item to `dirs` as the [separator](#separator)-joined
         `segments[0 - count]` and `node_modules`
   2. set `count` as `count` minus `1`
5. return `dirs`

---

## Terms

### Root

The filesystem root; like the starting `/` in `/Users/janedoe/path/to/file`

### Relative

A filesystem relative path; like the starting `./` or `../` in `../path/to/file`

### Separator

The symbol used to define hierarchy in a filesystem; like any `/`

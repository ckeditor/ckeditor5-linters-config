CKEditor 5 linters configuration
================================

TBA: badges

## Packages

This repository is a monorepo. It contains multiple npm packages.

| Package | Version | Dependencies |
|---------|---------|--------------|
| [`@ckeditor/eslint-config-ckeditor5`](/packages/eslint-config-ckeditor5) | [![npm version](https://badge.fury.io/js/eslint-config-ckeditor5.svg)](https://www.npmjs.com/package/eslint-config-ckeditor5) | ![Dependency Status](https://img.shields.io/librariesio/release/npm/eslint-config-ckeditor5) |
| [`@ckeditor/eslint-plugin-ckeditor5-rules`](/packages/eslint-plugin-ckeditor5-rules) | [![npm version](https://badge.fury.io/js/eslint-plugin-ckeditor5-rules.svg)](https://www.npmjs.com/package/eslint-plugin-ckeditor5-rules) | ![Dependency Status](https://img.shields.io/librariesio/release/npm/eslint-plugin-ckeditor5-rules) |
| [`@ckeditor/stylelint-config-ckeditor5`](/packages/stylelint-config-ckeditor5) | [![npm version](https://badge.fury.io/js/stylelint-config-ckeditor5.svg)](https://www.npmjs.com/package/stylelint-config-ckeditor5) | ![Dependency Status](https://img.shields.io/librariesio/release/npm/stylelint-config-ckeditor5) |

### Archived repositories

This repository is a result of merging few older repositories, which are now archived:
- [eslint-config-ckeditor5](https://github.com/ckeditor/eslint-config-ckeditor5)
- [eslint-plugin-ckeditor5-rules](https://github.com/ckeditor/eslint-plugin-ckeditor5-rules)
- [stylelint-config-ckeditor5](https://github.com/ckeditor/stylelint-config-ckeditor5)

## Cloning

1. Clone this repository.
2. Do `yarn install` inside (this package uses yarn workspaces).
3. You're ready to go!

## Testing

Tests:

```bash
yarn run test
```

## Releasing packages

### Changelog

1. Fetch all changes and switch to `master`!
2. Execute `npm run changelog`:
  * This task checks what changed in each package and bumps the version accordingly. If nothing changed at all, it won't create a new changelog entry. If changes were irrelevant (e.g. only depedencies) it will create an "internal changes" entry.
  * Scan the logs which are printed by the tool in search for errors (incorrect changelog entries). Incorrect entries (e.g. ones without the type) are being ignored. You may need to create entries for them manually. This is done directly in `CHANGELOG.md` (in the root directory). Make sure to verify the proposed version after you modify the changelog.
    * When unsure what has really changed in this version of a specific package, use `git diff <hash of previous release> packages/<name of the package>/`.

### Publishing

After generating the changelog, you are able to release the package.

First, you need to bump the version:

```bash
npm run release:bump-version
```

You can also use the `--dry-run` option in order to see what this task does.

After bumping the version, you can publish the changes:

```bash
npm run release:publish
```

As in the previous task, the `--dry-run` option is also available.

Your job's done. You can go now to the root of the repository, potentially update something in `package.json`, run `yarn install` and commit that as `"Internal: Updated dependencies."`.

## License

Licensed under the terms of [MIT license](https://opensource.org/licenses/MIT). For full details about the license, please check the `LICENSE.md` file.

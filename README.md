CKEditor 5 linters configuration
================================

[![CircleCI](https://circleci.com/gh/ckeditor/ckeditor5-linters-config.svg?style=shield)](https://app.circleci.com/pipelines/github/ckeditor/ckeditor5-linters-config?branch=master)

## Issue tracker

The issue tracker is located in the [`ckeditor/ckeditor5`](https://github.com/ckeditor/ckeditor5/issues/new?labels=domain:linters,squad:platform) repository.

## Packages

This repository is a monorepo. It contains multiple npm packages.

| Package | Version | Dependencies |
|---------|---------|--------------|
| [`eslint-config-ckeditor5`](/packages/eslint-config-ckeditor5) | [![npm version](https://badge.fury.io/js/eslint-config-ckeditor5.svg)](https://www.npmjs.com/package/eslint-config-ckeditor5) | ![Dependency Status](https://img.shields.io/librariesio/release/npm/eslint-config-ckeditor5) |
| [`eslint-plugin-ckeditor5-rules`](/packages/eslint-plugin-ckeditor5-rules) | [![npm version](https://badge.fury.io/js/eslint-plugin-ckeditor5-rules.svg)](https://www.npmjs.com/package/eslint-plugin-ckeditor5-rules) | ![Dependency Status](https://img.shields.io/librariesio/release/npm/eslint-plugin-ckeditor5-rules) |
| [`stylelint-config-ckeditor5`](/packages/stylelint-config-ckeditor5) | [![npm version](https://badge.fury.io/js/stylelint-config-ckeditor5.svg)](https://www.npmjs.com/package/stylelint-config-ckeditor5) | ![Dependency Status](https://img.shields.io/librariesio/release/npm/stylelint-config-ckeditor5) |
| [`stylelint-plugin-ckeditor5-rules`](/packages/stylelint-plugin-ckeditor5-rules) | [![npm version](https://badge.fury.io/js/stylelint-plugin-ckeditor5-rules.svg)](https://www.npmjs.com/package/stylelint-plugin-ckeditor5-rules) | ![Dependency Status](https://img.shields.io/librariesio/release/npm/stylelint-plugin-ckeditor5-rules) |

### Archived repositories

Some of the packages in this repository were previously separate repositories, and are now archived:
- [eslint-config-ckeditor5](https://github.com/ckeditor/eslint-config-ckeditor5)
- [eslint-plugin-ckeditor5-rules](https://github.com/ckeditor/eslint-plugin-ckeditor5-rules)
- [stylelint-config-ckeditor5](https://github.com/ckeditor/stylelint-config-ckeditor5)

## Cloning

> [!NOTE]
> This project requires **pnpm v10** or higher. You can check your version with `pnpm --version` and update if needed with `npm install -g pnpm@latest`.

1. Clone this repository.
2. Do `pnpm install` inside (this package uses workspaces).
3. You're ready to go!

## Testing

Tests:

```bash
pnpm run test
```

## Releasing packages

CircleCI automates the release process and can release both channels: stable (`X.Y.Z`) and pre-releases (`X.Y.Z-alpha.X`, etc.).

Before you start, you need to prepare the changelog entries.

1. Make sure the `#master` branch is up-to-date: `git fetch && git checkout master && git pull`.
1. Prepare a release branch: `git checkout -b release-[YYYYMMDD]` where `YYYYMMDD` is the current day.
1. Generate the changelog entries: `pnpm run release:prepare-changelog`.
	* You can specify the release date by passing the `--date` option, e.g., `--date=2025-06-11`.
	* By passing the `--dry-run` option, you can check what the script will do without actually modifying the files.
	* Read all the entries, correct poor wording and other issues, wrap code names in backticks to format them, etc.
	* Add the missing `the/a` articles, `()` to method names, "it's" -> "its", etc.
	* A newly introduced feature should have just one changelog entry – something like "The initial implementation of the FOO feature." with a description of what it does.
1. Commit all changes and prepare a new pull request targeting the `#master` branch.
1. Ping the `@ckeditor/ckeditor-5-platform` team to review the pull request and trigger the release process.

## License

Licensed under the terms of [MIT license](https://opensource.org/licenses/MIT). For full details about the license, please check the `LICENSE.md` file.

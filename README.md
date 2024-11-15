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

1. Clone this repository.
2. Do `yarn install` inside (this package uses yarn workspaces).
3. You're ready to go!

## Testing

Tests:

```bash
yarn run test
```

## Releasing packages

CircleCI automates the release process and can release both channels: stable (`X.Y.Z`) and pre-releases (`X.Y.Z-alpha.X`, etc.).

Before you start, you need to prepare the changelog entries.

1. Make sure the `#master` branch is up-to-date: `git fetch && git checkout master && git pull`.
1. Prepare a release branch: `git checkout -b release-[YYYYMMDD]` where `YYYYMMDD` is the current day.
1. Generate the changelog entries: `yarn run changelog --branch release-[YYYYMMDD] [--from [GIT_TAG]]`.
    * By default, the changelog generator uses the latest published tag as a starting point for collecting commits to process.

      The `--from` modifier option allows overriding the default behavior. It is required when preparing the changelog entries for the next stable release while the previous one was marked as a prerelease, e.g., `@alpha`.

      **Example**: Let's assume that the `v40.5.0-alpha.0` tag is our latest and that we want to release it on a stable channel. The `--from` modifier should be equal to `--from v40.4.0`.
    * This task checks what changed in each package and bumps the version accordingly. It won't create a new changelog entry if nothing changes at all. If changes were irrelevant (e.g., only dependencies), it would make an "_internal changes_" entry.
    * Scan the logs printed by the tool to search for errors (incorrect changelog entries). Incorrect entries (e.g., ones without the type) should be addressed. You may need to create entries for them manually. This is done directly in CHANGELOG.md (in the root directory). Make sure to verify the proposed version after you modify the changelog.
1. Commit all changes and prepare a new pull request targeting the `#master` branch.
1. Ping the `@ckeditor/ckeditor-5-devops` team to review the pull request and trigger the release process.

## License

Licensed under the terms of [MIT license](https://opensource.org/licenses/MIT). For full details about the license, please check the `LICENSE.md` file.

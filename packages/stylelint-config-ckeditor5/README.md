CKEditor 5 stylelint preset
========================

## Usage

```
npm i --save-dev stylelint-config-ckeditor5
```

Configure stylelint with a `.stylelintrc` file using the following contents:

```js
{
	"extends": "stylelint-config-ckeditor5"
}
```

## Changelog

See the [`CHANGELOG.md`](https://github.com/ckeditor/stylelint-config-ckeditor5/blob/master/CHANGELOG.md) file.

## Releasing package

Note: Be sure that version of dependencies in [`package.json`](https://github.com/ckeditor/stylelint-config-ckeditor5/blob/master/package.json) are defined correctly.

### Changelog

Before starting the release process, you need to generate the changelog:

```bash
npm run changelog
```

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


# ![markuplint](https://cdn.jsdelivr.net/gh/markuplint/markuplint@main/media/logo-v.svg)

[![npm version](https://img.shields.io/npm/v/markuplint.svg)](https://www.npmjs.com/package/markuplint)
[![Downloads](https://img.shields.io/npm/dm/markuplint.svg)](https://www.npmjs.com/package/markuplint)
[![Test](https://github.com/markuplint/markuplint/workflows/Test/badge.svg?branch=main)](https://github.com/markuplint/markuplint/actions?query=workflow%3ATest)
[![Coverage Status](https://coveralls.io/repos/github/markuplint/markuplint/badge.svg?branch=main)](https://coveralls.io/github/markuplint/markuplint?branch=main)
[![GitHub Stars](https://img.shields.io/github/stars/markuplint.svg)](https://github.com/markuplint/markuplint)
[![Follow us on Twitter](https://img.shields.io/twitter/follow/markuplint?label=Follow)](https://twitter.com/intent/user?screen_name=markuplint)

**Peace of mind in your markup** - An HTML linter for all markup developers.

## Features

- Conformance checking according to _HTML Standard_, _WAI-ARIA_, _ARIA in HTML_, etc.
- Supports _CSS_ and _SVG_ values.
- Supports _React_, _Vue_, _Svelte_, _Pug_, _PHP_, and more.
- Possible to specify the rule for each element if you use _CSS Selector_.
- Potential to create a custom rule.

![Screenshot: Violation Report CLI output](https://raw.githubusercontent.com/markuplint/markuplint/main/packages/markuplint/media/screenshot01.png)

## Instant using

```
$ npx markuplint target.html
```

Supported for _Node.js_ `v14.6.0` or later.

## Usage

### Initialization

Create a [configuration](https://markuplint.dev/configuration) file and install dependencies.

```
$ npx markuplint --init
# or
$ yarn run markuplint --init
```

Answer questions interactively.
By doing this, needed modules are installed, including `markuplint`.

Add a command to the `scripts` option on `package.json`:

```json
{
  "scripts": {
    "lint:html": "markuplint **/*.html"
  }
}
```

If you want to change the target path, you can change it for your project.

Execute the script:

```
$ npm run lint:html
# or
$ yarn lint:html
```

### Command line options

```
$ npx markuplint --help

Usage
	$ markuplint <HTML file paths (glob format)>
	$ <stdout> | markuplint

Options
	--config,                -c FILE_PATH  A configuration file path.
	--fix,                                 Fix HTML.
	--format,                -f FORMAT     Output format. Support "JSON", "Simple", "GitHub" and "Standard". Default: "Standard".
	--no-search-config                     No search a configure file automatically.
	--ignore-ext                           Evaluate files that are received even though the type of extension.
	--allow-warnings                       Return status code 0 even if there are warnings.
	--no-import-preset-rules               No import preset rules.
	--locale                               Locale of the message of violation. Default is an OS setting.
	--no-color,                            Output no color.
	--problem-only,          -p            Output only problems, without passeds.
	--verbose                              Output with detailed information.

	--init                                 Initialize settings interactively.
	--create-rule                          Add the scaffold of a custom rule.

	--help,                  -h            Show help.
	--version,               -v            Show version.

Examples
	$ markuplint verifyee.html --config path/to/.markuplintrc
	$ cat verifyee.html | markuplint
```

## Documentation

- [Getting Started](https://markuplint.dev/getting-started)
- [Rules](https://markuplint.dev/rules)
- [Configuration](https://markuplint.dev/configuration)
- [API](https://markuplint.dev/api-docs)

## Playground

- [Playground](https://playground.markuplint.dev/)

## Editor Extensions

- [Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=yusukehirao.vscode-markuplint)

## License

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fmarkuplint%2Fmarkuplint.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2Fmarkuplint%2Fmarkuplint?ref=badge_large)

## Sponsors

Need [Sponsors❤️‍🔥](https://github.com/sponsors/markuplint)

### Personal Supporters

[<img width="36" src="https://avatars.githubusercontent.com/u/91733847" alt="Tokitake" />](https://github.com/Tokitake)
[<img width="36" src="https://avatars.githubusercontent.com/u/1996642" alt="Okuto Oyama" />](https://github.com/yamanoku)
[<img width="36" src="https://avatars.githubusercontent.com/u/6581173" alt="miita" />](https://github.com/mikimhk)
[<img width="36" src="https://avatars.githubusercontent.com/u/111797" alt="Yasuo Fukuda" />](https://github.com/sigwyg)
[<img width="36" src="https://avatars.githubusercontent.com/u/802921" alt="Hideyuki Saito" />](https://github.com/hideyukisaito)

## Thanks

This linter is inspired by:

- [HTMLHint](http://htmlhint.com/)
- [ESLint](https://eslint.org/)
- [Stylelint](https://stylelint.io/)
- [textlint](https://textlint.github.io/)

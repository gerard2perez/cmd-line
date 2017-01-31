 # CMDLine

 [![NPM Version](http://img.shields.io/npm/v/cmd-line.svg?style=flat-square)](https://www.npmjs.org/package/koaton)[![Build Status](https://img.shields.io/travis/gerard2p/cmd-line/master.svg?style=flat-square)](https://travis-ci.org/gerard2p/cmd-line)![PRs Welcome](https://img.shields.io/badge/PRs%20🔀-Welcome-brightgreen.svg?style=flat-square)

 [![bitHound Overall Score](https://www.bithound.io/github/gerard2p/cmd-line/badges/score.svg?style=flat-square)](https://www.bithound.io/github/gerard2p/cmd-line)[![bitHound Dependencies](https://www.bithound.io/github/gerard2p/cmd-line/badges/dependencies.svg?style=flat-square)](https://www.bithound.io/github/gerard2p/cmd-line/master/dependencies/npm)[![bitHound Dev Dependencies](https://www.bithound.io/github/gerard2p/cmd-line/badges/devDependencies.svg?style=flat-square)](https://www.bithound.io/github/gerard2p/cmd-line/master/dependencies/npm)

[![Code Climate](https://codeclimate.com/github/gerard2p/cmd-line/badges/gpa.svg?style=flat-square)](https://codeclimate.com/github/gerard2p/cmd-line)[![Test Coverage](https://codeclimate.com/github/gerard2p/cmd-line/badges/coverage.svg?style=flat-square)](https://codeclimate.com/github/gerard2p/cmd-line/coverage)[![Issue Count](https://codeclimate.com/github/gerard2p/cmd-line/badges/issue_count.svg?style=flat-square)](https://codeclimate.com/github/gerard2p/cmd-line)

![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square)![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat-square)[![js-happiness-style](https://img.shields.io/badge/code%20style-happiness-brightgreen.svg?style=flat-square)](https://github.com/JedWatson/happiness)

CMDLine Allows you to define nodejs command line tools. It works by sing a folder structure and lets you call generator function (async if using babel), normal function and also function that return promises.
When runnig in the target folder it will try to load all the files under the **/target/commands/** so your final users can easily extend your cli tool.

## Installation
```sh
npm install cmd-line -S
```
## Usage
```javascript
/* /mycommand */
#!/usr/bin/env node
const CMD = require('cmd-line').default;
const cmdtest = new CMD('mycommand');
let promise = cmdtest.loadcommands(__dirname)
	.includehostcommands()
	.execute(process.argv);
```
## Definign a Command
```javascript
/* /commands/subcmd1.js */
exports.default = {
	cmd: __filename,
	args: ['arg1', '?arg2'],
	options: [
		['-f','--force', 'Override it!'],
		['--port','--port comport com4', 'Select your COMPort.']
	],
	description: 'My awsome command',
	action: (arg1, arg2, options) => {
		return 1;
	}
};
```
> mycommand subcmd1 arg1 -f

1. **cmd**[ *string* ]:  The name of the command that will be reconigzed.
1. **args**[ *array(string)* ]: Argumments that will be passed to the command, by placing "?" before a command you make it optional.
1. **options**[ *array(array(string))* ]:  The options that the program will receive.
 1. **option**[ *array(string)* ].
   1. *First value*: Is the short tag.
   1. *Second value*: Is the tag. It can have a variable receiver and a defvalue. Tag must be prepend with "--" varname and defvalue a separeted by " ".
   1. *Third value*: Is tehe description of the option.

## Automatic Help
By default a -h | --help option is added and it will generete an automatic text.
```sh
mycommand subcmd1
mycommand subcmd1 -h
```
Outputs:
```
mycommand subcmd1 arg1 ?arg2 [options]
  My awsome command
	-h  --help    Show the help for this command
	-f  --force   Override it!
	--port        comport Select your COMPort.
```

## Customizing Help
If you need it you can change the template for the help like this:
```javascript
/* /mycommand */
// ...
cmdtest.loadcommands(__dirname)
	.includehostcommands()
	.template(function (name, cmd, args, options, description) {
		return `${name} ${cmd} ${args} [ options ]\n  ${description}\n${options.join('\n')}`;
	})
	.arguments((args) => args.join(' '))
	.options((option, longest, varlen) => {
		let {shortag, tag, variable, description} = option;
		return `    ${shortag} ${tag} ${variable} ${description}`;
	})
	.execute(process.argv)
```
The argumments and the options have a serializer, you can change it this way
```javascript
/* /mycommand */
// ...
cmdtest.loadcommands(__dirname)
	.includehostcommands()
	.arguments((args) => args.join(' '))
	// longest is the space used by the tag and the shortag
	// varlen is the space used by the varname
	.options((option, longest, varlen) => {
		let {shortag, tag, variable, description} = option;
		return `    ${shortag} ${tag} ${variable} ${description}`;
	})
	.execute(process.argv)
```

### Customizing help by command
Another option is to custumaize only one command help.
```javascript
/* /commands/subcmd2.js */
const Command = require('cmd-line/lib/Commad').default;

exports.default = new Command(__filename, 'Hola Mundo')
	.Args('project', '?location')
	.Options([
		['--port', '--port portname 62626', 'Chosses a port'],
		['-d', '--dir location', 'Chosses a port'],
		['-f', '--force', 'Force'],
		['-r', '--recursive', 'Recursive'],
		['-sb', '--skip-bower', 'Chosses a port']
	])
	.Action(function* (project, location, options) {
		let timeout = new Promise(function (resolve) {
			setTimeout(() => {
				resolve('casa');
			}, 1000);
		});
		yield timeout;
    	return 100;
	}).Help((Rendered Help) => {
		console.log('My Custom Help');
	});
};
```
```sh
mycommad subcmd2 -h

Outputs:
My Custom Help
```

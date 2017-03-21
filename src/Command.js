import 'colors';
import * as configuration from './configuration';
import * as co from 'co';
import * as inflect from 'inflection';

class Option {
	constructor (option) {
		// if (option instanceof Array) {
		let shortag = option[0];
		let [tag, variable, defvalue] = option[1].split(' ');
		shortag = shortag === tag ? '' : shortag;
		variable = (variable || '');
		if (shortag === '') {
			shortag = tag;
			tag = '';
		}
		this.shortag = shortag;
		this.tag = tag;
		this.variable = variable;
		this.defvalue = defvalue;
		this.description = option[2];
	}
}
class Command {
	constructor (cmd, description) {
		this.cmd = cmd.split(/[\\/]/).pop().replace('.js', '');
		this.description = description;
		this.args = [];
		this.options = [
			new Option(['-h', '--help', 'Show the help for this command'])
		];
		this.action = /* istanbul ignore next */() => {};
		this.help = (help) => {
			print(help);
		};
	}
	Help (fn) {
		if (!fn) {
			return this;
		}
		this.help = function (...args) {
			return co.wrap(fn)(...args);
		};
		return this;
	}
	Args (...args) {
		this.args = args;
		return this;
	}
	Options (optionArray) {
		/* istanbul ignore else */
		if (optionArray instanceof Array && optionArray[0] instanceof Array) {
			for (const option of optionArray) {
				this.options.push(new Option(option));
			}
		} else if (optionArray instanceof Array) {
			this.options.push(new Option(optionArray));
		}
		return this;
	}
	Action (fn) {
		if (!fn) {
			return this;
		}
		this.action = function (...args) {
			return co.wrap(fn)(...args);
		};
		return this;
	}
	get Info () {
		let longest = 0;
		let varlen = 0;
		for (const opt of this.options) {
			if (opt.shortag.length + opt.tag.length > longest) {
				longest = opt.shortag.length + opt.tag.length;
			}
			if (opt.variable.length > varlen) {
				varlen = opt.variable.length;
			}
		}
		longest += 4;
		return configuration.template(configuration.name,
			this.cmd,
			configuration.argSerializer(this.args),
			this.options.map(o => configuration.optionSerializer(o, longest, varlen)),
			this.description
		);
	}
	static parse (/* istanbul ignore next */params = []) {
		let ARGS = params.slice();
		let arg;
		let finalargs = [];
		for (const idx in this.args) {
			const arg = this.args[idx];
			if (arg.indexOf('?') === -1) {
				finalargs[idx] = null;
			} else {
				finalargs[idx] = undefined;
			}
		}
		let argindex = 0;
		while ((arg = ARGS.shift()) && arg.search(/^\-/) === -1) {
			let idx = params.indexOf(arg);
			params.splice(idx, 1);
			finalargs[argindex] = arg;
			argindex++;
		}
		for (const arg in finalargs) {
			if (finalargs[arg] === null) {
				throw new Error(`\nParameter ${this.args[arg].red} must be specfied!\n`);
			}
		}
		let opts = params.slice();
		let options = {};
		for (const option of this.options) {
			let camelizedOption = inflect.titleize(option.tag || option.shortag).replace(/^\-+/g, '').replace(/\-/g, ' ').replace(/ /g, '');
			camelizedOption = inflect.camelize(camelizedOption, true);
			let OPTS = opts.slice();
			let arg = OPTS.shift();
			options[camelizedOption] = false;
			while (arg) {
				let index = opts.indexOf(arg);
				if (option.tag === arg || option.shortag === arg) {
					opts.splice(index, 1);
					options[camelizedOption] = true;
					if (option.variable) {
						options[camelizedOption] = ARGS.splice(index, 1)[0] || option.defvalue;
						opts.splice(index, 1);
						if (options[camelizedOption] === undefined) {
							throw new Error(`The option ${option.tag || /* istanbul ignore next */option.shortag} needs a value`);
						}
					} else {
						options[camelizedOption] = true;
					}
				} else if (option.shortag.length === 2 && arg.indexOf('-') === 0) {
					let st = option.shortag.replace('-', '');
					let len = arg.indexOf(st);
					if (arg.indexOf('--') === -1 && len > 0) {
						options[camelizedOption] = true;
						opts[index] = opts[index].replace(st, '');
					}
				}
				arg = OPTS.shift();
			}
		}
		finalargs.push(options);
		return finalargs;
	}
	static execute (args) {
		if (this.args.length > 0 && args.length === 0) {
			print(this.Info);
			return 1;
		} else if (args.length === 1 && (args[0] === '-h' || args[0] === '--help')) {
			/* istanbul ignore else */
			if (this.help) {
				return Promise.resolve(this.help(this.Info)).then((result = 0) => {
					return result === 0 ? 0 : /* istanbul ignore next */1;
				}).catch(/* istanbul ignore next */(err) => {
					print(err.stack);
					return 1;
				});
			}
		} else {
			return this.action.apply(this, Command.parse.call(this, args)).then((result = 0) => {
				return result === 0 ? 0 : 1;
			}).catch((err) => {
				print(err.stack);
				return 1;
			});
		}
	}
}

export default Command;

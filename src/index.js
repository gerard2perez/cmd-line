import {
	readdirSync,
	existsSync
} from 'fs';
import * as path from 'path';
import Command from './Command';
import * as configuration from './configuration';

const filterFolders = function (folder) {
	return readdirSync(folder).filter(f => f.indexOf('.js')).map(f => f.replace('.js', ''));
};
/* istanbul ignore next */
global.print = (...args) => {
	console.log(...args);
};
let commandOrgin = {};

function getCommand (library) {
	let CMD = require(library).default;
	if (!(CMD instanceof Command)) {
		CMD = new Command(CMD.cmd, CMD.description).Args(...CMD.args).Options(CMD.options).Help(CMD.help).Action(CMD.action);
	}
	return CMD;
}

function preRequireCommands (hostprogram) {
	let folder = path.join(hostprogram, 'commands');
	if (existsSync(folder)) {
		for (const command of filterFolders(folder)) {
			commandOrgin[command] = folder;
		}
	}
}

export default class cmd {
	constructor (name) {
		commandOrgin = {};
		configuration.name = name;
	}
	template (template) {
		configuration.template = template;
		return this;
	}
	arguments (serializer) {
		configuration.argSerializer = serializer;
		return this;
	}
	options (serializer) {
		configuration.optionSerializer = serializer;
		return this;
	}
	loadcommands (currentlocation) {
		preRequireCommands(currentlocation);
		return this;
	}
	includehostcommands () {
		preRequireCommands(process.cwd());
		return this;
	}
	execute (commandlineargs) {
		commandlineargs.splice(0, 2);
		return new Promise(function (resolve, reject) {
			let [cmd, ...args] = commandlineargs;
			if (!cmd) {
				for (const cmd of Object.keys(commandOrgin)) {
					const CMD = getCommand(path.join(commandOrgin[cmd], cmd));
					print(CMD.Info);
					print('\n');
				}
				resolve(0);
			} else if (commandOrgin[cmd]) {
				const CMD = getCommand(path.join(commandOrgin[cmd], cmd));
				resolve(Command.execute.call(CMD, args));
			} else {
				reject(`${cmd} is not a command`);
			}
		});
	}
}

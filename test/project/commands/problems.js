import Command from '../../../src/Command';

exports.default = new Command(__filename, 'CMD1 Description')
	.Args()
	.Action()
	.Help()
	.Help(() => {
		print('My custom help');
	})
	.Options([
		['--port', '--port portname 62626', 'Chosses a port'],
		['-d', '--dir location', 'Chosses a port'],
		['-f', '--force', 'Force'],
		['-r', '--recursive', 'Recursive'],
		['-sb', '--skip-bower', 'Chosses a port']
	])
	.Action(async function (options) {
		throw new Error('Handles Action Error');
	});

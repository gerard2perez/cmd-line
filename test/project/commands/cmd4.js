import Command from '../../../src/Command';

exports.default = new Command(__filename, 'CMD1 Description')
	.Options([
		['-d', '--dir location', 'Chosses a port'],
		['-f', '--force', 'Force'],
		['-r', '--recursive', 'Recursive'],
		['-sb', '--skip-bower', 'Chosses a port']
	])
	.Action(async function (options) {
		print(JSON.stringify(options));
	});

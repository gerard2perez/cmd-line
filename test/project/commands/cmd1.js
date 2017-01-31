import Command from '../../../src/Command';

exports.default = new Command(__filename, 'CMD1 Description')
	.Options(['-sb', '--skip-bower', 'Chosses a port'])
	.Action(function (options) {
		print(JSON.stringify(options));
	});

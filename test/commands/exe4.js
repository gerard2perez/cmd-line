import Command from '../../src/Command';

export default new Command(__filename, 'Required Argument (no opts)')
	.Args('project', 'location', '?value')
	.Action(function * (project, location, value, options) {
		print('from exe4', project, location, value);
	});

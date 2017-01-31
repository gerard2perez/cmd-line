import Command from '../../src/Command';

export default new Command(__filename, 'Required Argument (no opts)')
	.Args('project', '?location')
	.Action(function * (project, location, options) {
		print('from exe3', project, location);
		let timeout = new Promise(function (resolve) {
			setTimeout(() => {
				resolve('casa');
			}, 0);
		});
		return yield timeout;
	});

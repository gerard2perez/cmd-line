import Command from '../../src/Command';

export default new Command(__filename, 'Required Argument (no opts)')
	.Args('project')
	.Action(function * (project, options) {
		print('from exe2', project);
		let timeout = new Promise(function (resolve) {
			setTimeout(() => {
				resolve('casa');
			}, 0);
		});
		yield timeout;
	});

import Command from '../../src/Command';

export default new Command(__filename, 'No Argumments, No Options')
	.Args('arg1', '?arg2')
	.Options(['-d', '--dir dirname c:/', 'Directory' ])
	.Action(async function (options) {
		let timeout = new Promise(function (resolve) {
			setTimeout(() => {
				resolve('casa');
			}, 1);
		});
		await timeout;
	});

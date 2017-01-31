import Command from '../../src/Command';

export default new Command(__filename, 'No Argumments, No Options')
	.Action(async function (options) {
		let timeout = new Promise(function (resolve) {
			setTimeout(() => {
				resolve('casa');
			}, 1);
		});
		await timeout;
	});

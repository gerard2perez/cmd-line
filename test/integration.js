import * as assert from 'assert';
import CMD from '../src';

global.print = (...data) => {
	buffer += data.join(' '); // .replace(/\n/g, ' ');
};
let cmdtest;
let buffer;
describe('Argumments', function () {
	before(() => {
		process.chdir('test/project');
		cmdtest = new CMD('mycommand');
		cmdtest
			.loadcommands(__dirname)
			.includehostcommands();
	});
	after(() => {
		process.chdir('../../');
	});
	beforeEach(() => {
		buffer = '';
	});
	it('has Args[] and Opts[]', function (done) {
		cmdtest.execute('node mycommand exe1'.split(' ')).then((result) => {
			assert.equal(result, 0);
		}).then(done.bind(null, null), done).catch(done);
	});
	it('has Args[r] and Opts[]', function (done) {
		cmdtest.execute('node mycommand exe2'.split(' ')).then((result) => {
			assert.ok(buffer.indexOf('exe2') > -1, 'Must render help');
			assert.equal(result, 1, 'return false because arg[0] is required');
		}).then(done.bind(null, null), done).catch(done);
	});

	it('has Args[R] and Opts[]', function (done) {
		cmdtest.execute('node mycommand exe2 home'.split(' ')).then((result) => {
			assert.ok(buffer.indexOf('home') > -1, 'Checks argumment is passed.');
			assert.equal(result, 0, 'returns 0 because arg[0] is required.');
		}).then(done.bind(null, null), done).catch(done);
	});
	it('has Args[Ro] and Opts[]', function (done) {
		cmdtest.execute('node mycommand exe3 home'.split(' ')).then((result) => {
			assert.ok(buffer.indexOf('home') > -1, 'Checks argumment is passed.');
			assert.equal(result, 1, 'optionals argument does not fail');
		}).then(done.bind(null, null), done).catch(done);
	});
	it('has Args[RO] and Opts[]', function (done) {
		cmdtest.execute('node mycommand exe3 home switch'.split(' ')).then((result) => {
			assert.ok(buffer.indexOf('home') > -1, 'Checks argumment is passed.');
			assert.ok(buffer.indexOf('switch') > -1, 'Checks argumment is passed.');
			assert.equal(result, 1, 'optionals argument does not fail');
		}).then(done.bind(null, null), done).catch(done);
	});
	it('has Args[Rro] and Opts[]', function (done) {
		cmdtest.execute('node mycommand exe4 home'.split(' ')).then(() => {
			assert.ok(false);
		}, () => {
			assert.ok(false);
		}).catch(() => {
			assert.ok(true, 'Must throw an error because not all required parameters are specfied.');
			done(null);
		});
	});
	it('has Args[RRo] and Opts[]', function (done) {
		cmdtest.execute('node mycommand exe4 home mexico'.split(' ')).then((result) => {
			assert.ok(buffer.indexOf('home') > -1, 'Checks argumment is passed.');
			assert.ok(buffer.indexOf('mexico') > -1, 'Checks argumment is passed.');
			assert.equal(result, 0, 'optionals argument does not fail');
		}).then(done.bind(null, null), done).catch(done);
	});
	it('has Args[RRO] and Opts[]', function (done) {
		cmdtest.execute('node mycommand exe4 home mexico nintendo'.split(' ')).then((result) => {
			assert.ok(buffer.indexOf('home') > -1, 'Checks argumment is passed.');
			assert.ok(buffer.indexOf('mexico') > -1, 'Checks argumment is passed.');
			assert.ok(buffer.indexOf('nintendo') > -1, 'Checks argumment is passed.');
			assert.equal(result, 0, 'optionals argument does not fail');
		}).then(done.bind(null, null), done).catch(done);
	});
});

describe('Options', function () {
	before(() => {
		process.chdir('test/project');
		cmdtest = new CMD('mycommand');
		cmdtest
			.loadcommands(__dirname)
			.includehostcommands();
	});
	after(() => {
		process.chdir('../../');
	});
	beforeEach(() => {
		buffer = '';
	});
	it('has Args[] and Opts[]', function (done) {
		cmdtest.execute('node mycommand cmd1'.split(' ')).then((result) => {
			assert.ok(buffer.indexOf('"skipBower":false') > -1);
			assert.equal(result, 0);
		}).then(done.bind(null, null), done).catch(done);
	});
	it('has Args[] and Opts[-sb]', function (done) {
		cmdtest.execute('node mycommand cmd1 -sb'.split(' ')).then((result) => {
			assert.ok(buffer.indexOf('"skipBower":true') > -1);
			assert.equal(result, 0);
		}).then(done.bind(null, null), done).catch(done);
	});
	it('has Args[] and Opts[--skip-bower]', function (done) {
		cmdtest.execute('node mycommand cmd1 --skip-bower'.split(' ')).then((result) => {
			assert.ok(buffer.indexOf('"skipBower":true') > -1);
			assert.equal(result, 0);
		}).then(done.bind(null, null), done).catch(done);
	});
	it('has Args[] and Opts[--recursive]', function (done) {
		cmdtest.execute('node mycommand cmd2 --recursive'.split(' ')).then((result) => {
			assert.ok(buffer.indexOf('"skipBower":false') > -1);
			assert.ok(buffer.indexOf('"recursive":true') > -1);
			assert.equal(result, 0);
		}).then(done.bind(null, null), done).catch(done);
	});
	it('has Args[] and Opts[-sb -r]', function (done) {
		cmdtest.execute('node mycommand cmd2 -r -sb'.split(' ')).then((result) => {
			assert.ok(buffer.indexOf('"skipBower":true') > -1);
			assert.ok(buffer.indexOf('"recursive":true') > -1);
			assert.equal(result, 0);
		}).then(done.bind(null, null), done).catch(done);
	});
	it('has Args[] and Opts[-sb -rf]', function (done) {
		cmdtest.execute('node mycommand cmd3 -rf -sb'.split(' ')).then((result) => {
			assert.ok(buffer.indexOf('"skipBower":true') > -1);
			assert.ok(buffer.indexOf('"recursive":true') > -1);
			assert.ok(buffer.indexOf('"force":true') > -1);
			assert.equal(result, 0);
		}).then(done.bind(null, null), done).catch(done);
	});
	it('has Args[] and Opts[-sb -r --force]', function (done) {
		cmdtest.execute('node mycommand cmd3 -r -sb --force'.split(' ')).then((result) => {
			assert.ok(buffer.indexOf('"skipBower":true') > -1);
			assert.ok(buffer.indexOf('"recursive":true') > -1);
			assert.ok(buffer.indexOf('"force":true') > -1);
			assert.equal(result, 0);
		}).then(done.bind(null, null), done).catch(done);
	});
	it('has Args[] and Opts[-sb -rf -d long]', function (done) {
		cmdtest.execute('node mycommand cmd4 -rf -sb -d long'.split(' ')).then((result) => {
			assert.ok(buffer.indexOf('"skipBower":true') > -1);
			assert.ok(buffer.indexOf('"recursive":true') > -1);
			assert.ok(buffer.indexOf('"force":true') > -1);
			assert.ok(buffer.indexOf('"dir":"long"') > -1);
			assert.equal(result, 0);
		}).then(done.bind(null, null), done).catch(done);
	});
	it('has Args[] and Opts[-sb -rf --dir long]', function (done) {
		cmdtest.execute('node mycommand cmd4 -rf -sb --dir long'.split(' ')).then((result) => {
			assert.ok(buffer.indexOf('"skipBower":true') > -1);
			assert.ok(buffer.indexOf('"recursive":true') > -1);
			assert.ok(buffer.indexOf('"force":true') > -1);
			assert.ok(buffer.indexOf('"dir":"long"') > -1);
			assert.equal(result, 0);
		}).then(done.bind(null, null), done).catch(done);
	});
	it('has Args[] and Opts[-sb -rf --dir long --port]', function (done) {
		cmdtest.execute('node mycommand cmd5 -rf -sb --dir long --port'.split(' ')).then((result) => {
			assert.ok(buffer.indexOf('"skipBower":true') > -1);
			assert.ok(buffer.indexOf('"recursive":true') > -1);
			assert.ok(buffer.indexOf('"force":true') > -1);
			assert.ok(buffer.indexOf('"dir":"long"') > -1);
			assert.ok(buffer.indexOf('"port":"62626"') > -1);
			assert.equal(result, 0);
		}).then(done.bind(null, null), done).catch(done);
	});
	it('has Args[] and Opts[-sb -rf --dir long --port 8080]', function (done) {
		cmdtest.execute('node mycommand cmd5 -rf -sb --dir long --port 8080'.split(' ')).then((result) => {
			assert.ok(buffer.indexOf('"skipBower":true') > -1);
			assert.ok(buffer.indexOf('"recursive":true') > -1);
			assert.ok(buffer.indexOf('"force":true') > -1);
			assert.ok(buffer.indexOf('"dir":"long"') > -1);
			assert.ok(buffer.indexOf('"port":"8080"') > -1);
			assert.equal(result, 0);
		}).then(done.bind(null, null), done).catch(done);
	});
	it('node mycommand cmd5 -h', function (done) {
		cmdtest.execute('node mycommand cmd5 -h'.split(' ')).then((result) => {
			assert.ok(buffer.indexOf('mycommand') > -1, 'Checks argumment is passed.');
			assert.ok(buffer.indexOf('cmd5') > -1, 'Checks argumment is passed.');
			assert.ok(buffer.indexOf('port') > -1, 'Checks argumment is passed.');
			assert.equal(0, result, 'optionals argument does not fail');
		}).then(done.bind(null, null), done).catch(done);
	});
	it('node mycommand problems', function (done) {
		cmdtest.execute('node mycommand problems'.split(' ')).then((result) => {
			assert.equal(result, 1, 'Caches the error');
			done(null);
		}, done.bind(null)).catch(done);
	});
	it('node mycommand problems -h', function (done) {
		cmdtest.execute('node mycommand problems -h'.split(' ')).then((result) => {
			assert.ok(buffer.indexOf('My custom help') > -1, 'Executes the custom help function.');
		}).then(done.bind(null, null), done).catch(done);
	});
	it('node mycommand problems -d', function (done) {
		cmdtest.execute('node mycommand problems -d'.split(' ')).then(() => {
			assert.ok(false);
		}, () => {
			assert.ok(false);
		}).catch(() => {
			assert.ok(true, 'Must throw an error because not all required options are specfied.');
			done(null);
		});
	});
});

describe('Main Help', function () {
	before(() => {
		process.chdir('test/project');
		cmdtest = new CMD('mycommand');
		cmdtest
			.loadcommands(__dirname)
			.includehostcommands();
	});
	after(() => {
		process.chdir('../../');
	});
	beforeEach(() => {
		buffer = '';
	});
	it('node mycommand', function (done) {
		cmdtest.execute('node mycommand'.split(' ')).then((result) => {
			assert.equal(result, 0);
		}).then(done.bind(null, null), done).catch(done);
	});
});

describe('Chnages Templates', function () {
	before(() => {
		process.chdir('test/project');
		cmdtest = new CMD('fullhelp');
		cmdtest
			.loadcommands(__dirname)
			.loadcommands(`${__dirname}/13`)
			.template((name, cmd, args, options, description) => `${name} ${cmd} ${args} [ options ]\n  ${description}\n${options.join('\n')}`)
			.arguments((args) => args.join(' '))
			.options((option, longest, varlen) => {
				let {shortag, tag, variable, description} = option;
				return `    ${shortag} ${tag} ${variable} ${description}`;
			});
	});
	after(() => {
		process.chdir('../../');
	});
	beforeEach(() => {
		buffer = '';
	});
	it('node allone fullhelp -h', function (done) {
		let res = `fullhelp fullhelp arg1 ?arg2 [ options ]
  No Argumments, No Options
    -h --help  Show the help for this command
    -d --dir dirname Directory`;
		cmdtest.execute('node allone fullhelp -h'.split(' ')).then((result) => {
			assert.equal(buffer, res);
			assert.equal(0, result);
			done(null);
		}, done.bind(null)).catch(done);
	});
	it('node allone cmd100', function (done) {
		cmdtest.execute('node allone cmd100'.split(' ')).then(() => {
			assert.ok(false);
		}, () => {
			assert.ok(false);
		}).catch(() => {
			assert.ok(true, 'Must throw an error because not all required parameters are specfied.');
			done(null);
		});
	});
	it('node allone', function (done) {
		cmdtest.execute('node allone'.split(' ')).then((result) => {
			let compiledcommands = `fullhelp exe1  [ options ]
  No Argumments, No Options
    -h --help  Show the help for this command
fullhelp exe2 project [ options ]
  Required Argument (no opts)
    -h --help  Show the help for this command
fullhelp exe3 project ?location [ options ]
  Required Argument (no opts)
    -h --help  Show the help for this command
fullhelp exe4 project location ?value [ options ]
  Required Argument (no opts)
    -h --help  Show the help for this command
fullhelp fullhelp arg1 ?arg2 [ options ]
  No Argumments, No Options
    -h --help  Show the help for this command
    -d --dir dirname Directory
`;
			assert.equal(buffer, compiledcommands);
			assert.equal(result, 0);
		}).then(done.bind(null, null), done).catch(done);
	});
});

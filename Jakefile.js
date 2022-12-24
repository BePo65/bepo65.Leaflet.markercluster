/*
Leaflet.markercluster building, testing and linting scripts.

To check the code for errors and build Leaflet from source, run "jake lint" in
directory '/build'.
To run the tests, run "jake test".
*/

const path = require('path');

desc('Check Leaflet.markercluster source for errors with JSHint');
task('lint', {
	async: true
}, function(){
		jake.exec('jshint', {
			printStdout: true
		}, function () {
			console.log('\tCheck passed.\n');
			complete();
		});
});

desc('Combine Leaflet.markercluster source files');
task('build', ['lint'], {
	async: true
}, function(){
	jake.exec('npm run-script rollup', function() {
		console.log('Rolled up.');
		complete();
	});
});

desc('Combine Leaflet.markercluster source files for release');
task('build-release', ['lint'], {
	async: true
}, function(){
	jake.exec('npm run-script rollup:release', function() {
		console.log('Rolled up for release.');
		complete();
	});
});

desc('Compress bundled files');
task('uglify', ['build'], function(){
  jake.exec('npm run-script uglify', function() { console.log('Uglyfied.'); });
});

desc('Run ChromeHeadless tests');
task('test', ['lint'], function() {

	const karma = require('karma');
	const parseConfig = karma.config.parseConfig;
	const Server = karma.Server;

	cliOptions = {};
	cliOptions.browsers = ['ChromeHeadless'];

	function isArgv(optName) {
		 return process.argv.indexOf(optName) !== -1;
	}

	if (isArgv('--chrome')) {
		cliOptions.browsers.push('Chrome');
	}
	if (isArgv('--safari')) {
		cliOptions.browsers.push('Safari');
	}
	if (isArgv('--ff')) {
		cliOptions.browsers.push('Firefox');
	}

	if (isArgv('--cov')) {
		cliOptions.preprocessors = {
			'src/**/*.js': 'coverage'
		};
		cliOptions.coverageReporter = {
			type : 'html',
			dir : 'coverage/'
		};
		cliOptions.reporters = ['coverage'];
	}

	console.log('Running tests...');

	let server;
	parseConfig(
		path.join(__dirname, './spec/karma.conf.js'),
		cliOptions,
		{ promiseConfig: true, throwErrors: true }
	).then(
		(karmaConfig) => {
			server = new Server(karmaConfig, function doneCallback(exitCode) {
				if (!exitCode) {
					console.log('\tTests ran successfully.\n');
					complete();
				} else {
					process.exit(exitCode);
				}
			});
			server?.start();
		},
		(rejectReason) => { 
			console.log(`\tTests could not be started ('${rejectReason.toString()}').\n`);
		 }
	);
});

task('default', ['build', 'uglify']);

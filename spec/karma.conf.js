var json = require('@rollup/plugin-json');

// Karma configuration
module.exports = function (config) {

	var files = [
		"spec/sinon.js",
		"spec/expect.js",

		"node_modules/leaflet/dist/leaflet-src.js",
		"src/index.js",

		"spec/after.js",
		"node_modules/happen/happen.js",
		"spec/suites/SpecHelper.js",
		"spec/suites/**/*.js",
		"dist/*.css",
		{pattern: 'spec/images/*.png', watched: false, included: false, served: true, nocache: false}
	];

	config.set({
		// base path, that will be used to resolve files and exclude
		basePath: '../',

		plugins: [
			'karma-rollup-preprocessor',
			'karma-mocha',
			'karma-mocha-reporter',
			'karma-coverage',
			'karma-chrome-launcher',
			'karma-safari-launcher',
			'karma-firefox-launcher'
		],

		// frameworks to use
		frameworks: ['mocha'],

		// list of files / patterns to load in the browser
		files: files,
		proxies: {
			'/images/': '/base/spec/images/'
		},
		exclude: [],

		// Rollup the ES6 Leaflet.markercluster sources into just one file, before tests
		preprocessors: {
			'src/index.js': ['rollup']
		},
		rollupPreprocessor: {
			plugins: [
				json()
			],
			output: {
				format: 'umd',
				name: 'Leaflet.markercluster'
			},
		},

		// test results reporter to use
		// possible values: 'dots', 'progress', 'junit', 'growl', 'coverage', 'mocha'
		reporters: ['mocha'],

		// web server port
		port: 9876,

		// level of logging
		// possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
		logLevel: config.LOG_WARN,

		// enable / disable colors in the output (reporters and logs)
		colors: true,

		// enable / disable watching file and executing tests whenever any file changes
		autoWatch: false,

		// Start these browsers, currently available:
		// - Chrome
		// - ChromeCanary
		// - ChromeHeadless
		// - Firefox
		// - Opera
		// - Safari (only Mac)
		browsers: ['ChromeHeadless'],

		// If browser does not capture in given timeout [ms], kill it
		captureTimeout: 5000,

		// Continuous Integration mode
		// if true, it capture browsers, run tests and exit
		singleRun: true
	});
};

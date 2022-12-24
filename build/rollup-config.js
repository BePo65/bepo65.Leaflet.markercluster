
// Config file for running Rollup in "normal" mode (non-watch)

import inject from '@rollup/plugin-inject';
import rollupGitVersion from 'rollup-plugin-git-version';
import json from 'rollup-plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

import gitRev from 'git-rev-sync';
import fs from 'node:fs';
import path from 'node:path';

const packageJsonData = fs.readFileSync(path.resolve('./package.json'));
let version = JSON.parse(packageJsonData).version;

let release;

// Skip the git branch+rev in the banner when doing a release build
if (process.env.NODE_ENV === 'release') {
	release = true;
} else {
	release = false;
	const branch = gitRev.branch();
	const rev = gitRev.short();
	version += '+' + branch + '.' + rev;
}

const banner = `/*
 * Leaflet.markercluster ` + version + `,
 * Provides Beautiful Animated Marker Clustering functionality for Leaflet, a JS library for interactive maps.
 * https://github.com/BePo65/bepo65.Leaflet.markercluster
 * (c) 2012-2022, Bernhard Pottler
 */`;

export default {
	input: 'src/index.js',
	output: {
		banner,
		file: 'dist/leaflet.markercluster-src.js',
		format: 'umd',
		name: 'Leaflet.markercluster',
		sourcemap: true,
		globals: {
			"leaflet": "L"
		}
	},
	external: ['leaflet'],
	plugins: [
    resolve(),
    commonjs(),
		release ? json() : rollupGitVersion(),
		inject({
			L: "leaflet"
		})
	],
};

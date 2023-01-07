
// Config file for running Rollup in "normal" mode (non-watch)

import inject from '@rollup/plugin-inject';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

import fs from 'node:fs';
import { fileURLToPath } from "node:url";

const packageJsonPath = fileURLToPath(new URL('../package.json', import.meta.url))
let version = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8')).version;

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
		json(),
		inject({
			L: "leaflet"
		})
	],
};

import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import autoPreprocess from 'svelte-preprocess';
import typescript from "@rollup/plugin-typescript";
const path = require('path');

// SCSS
import sveltePreprocess from 'svelte-preprocess';
const preprocess = sveltePreprocess({
    scss: {
        includePaths: ['scss'],
        data: `
        @import './scss/_imports/_importMaster.scss';
        `,
    },

    postcss: {
        plugins: [require('autoprefixer')],
    },
});

const production = !process.env.ROLLUP_WATCH;

function serve() {
	let server;

	function toExit() {
		if (server) server.kill(0);
	}

	return {
		writeBundle() {
			if (server) return;
			server = require('child_process').spawn('npm', ['run', 'svelte-start', '--', '--dev'], {
				stdio: ['ignore', 'inherit', 'inherit'],
				shell: true
			});

			process.on('SIGTERM', toExit);
			process.on('exit', toExit);
		}
	};
}

export default {
	input: 'src/svelte.ts',
	output: {
		sourcemap: true,
		format: 'iife',
		name: 'app',
		file: 'public/build/bundle.js',
		globals: {
			electron: 'electron',
			child_process: 'child_process',
			path: 'path',
			url: 'url',
			module: 'module',
			os: 'os'
		}
	},
	plugins: [
		svelte({
			dev: !production,
			css: css => {
                css.write('public/build/bundle.css');
            },

            // SCSS
            preprocess: autoPreprocess(),
		}),
		typescript({
			sourceMap: !production,
		}),
		resolve({
			browser: true,
			dedupe: ['svelte'],
			preferBuiltins: false,
		}),
		commonjs(
			{include: /node_modules/,}// Default: undefined
		),

		!production && serve(),
		!production && livereload('public'),
		production && terser()
	],
	// А ему как-то срать есть эта хрень или нет, на самом деле, но пока оставляю
	external: [
		'electron',
		'child_process',
		'fs',
		'path',
		'url',
		'module',
		'os'
	],
	watch: {
		clearScreen: false
	}
};

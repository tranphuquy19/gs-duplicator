const fs = require('fs');
const path = require('path');
const webpack = require('webpack');

const rootDir = path.resolve(__dirname);
const srcDir = path.resolve(rootDir, './src');
const scriptsDir = path.resolve(srcDir, './scripts');
const manifestsDir = path.resolve(srcDir, './manifests');

const getEntries = async () => {
	const filenames = await fs.promises.readdir(scriptsDir);

	const entries = [];
	for (const filename of filenames) {
		if (!filename.endsWith('.ts')) {
			continue;
		}
		const scriptName = filename.split('.ts')[0];
		entries.push([scriptName, path.resolve(scriptsDir, filename)]);
	}

	return Object.fromEntries(entries);
};

const getUserScriptHeader = (name, headers) => {
	headers = {
		...headers,
		namespace: 'https://doracoder.netlify.app',
		author: 'tranphuquy19',
		version: `${Date.now()}`,
	};

	const getHeaderRows = () => {
		const keys = Object.keys(headers);

		const rows = [];
		for (const key of keys) {
			let values = headers[key];
			if (typeof values === 'string') {
				values = [values];
			}
			rows.push(values.map((value) => `// @${key.padEnd(12, ' ')} ${value}`).join('\n'));
		}

		return rows;
	};

	const headerRows = getHeaderRows();

	return [`// ==UserScript==`, ...headerRows, `// ==/UserScript==`].join('\n');
};

const main = async () => {
	const entries = await getEntries();

	return {
		entry: entries,
		output: {
			path: path.resolve(__dirname, 'dist'),
			filename: '[name].user.js',
		},
		module: {
			rules: [
				{
					test: /\.tsx?$/,
					use: ['ts-loader'],
				},
			],
		},
		devtool: false,
		resolve: {
			extensions: ['.ts', '.tsx', '.js', '.json'],
			alias: {
				'@': srcDir,
			}
		},
		plugins: [
			new webpack.BannerPlugin({
				banner: (info) => {
					const name = info.chunk.name;
					const file = path.resolve(manifestsDir, `${name}.json`);
					const manifest = require(file);
					return getUserScriptHeader(name, manifest);
				},
				raw: true,
				entryOnly: true,
			}),
			new webpack.DefinePlugin({
				__dev: process.env.NODE_ENV === 'development',
				__test: process.env.NODE_ENV === 'test',
				__version: Date.now(),
			}),
			new webpack.ProgressPlugin(),
		],
		mode: 'development',
	};
};

module.exports = main;

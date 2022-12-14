const fs = require('fs');
const path = require('path');

const webpack = require('webpack');
const TerserPlugin = require("terser-webpack-plugin");
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const { CustomizedCleanWebpackPlugin } = require('./customized-webpack-plugins');

const rootDir = path.resolve(__dirname);
const srcDir = path.resolve(rootDir, './src');
const scriptsDir = path.resolve(srcDir, './scripts');
const manifestsDir = path.resolve(srcDir, './manifests');

const isStat = process.env.STAT === 'true';

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
		optimization: {
			minimize: !(process.env.NODE_ENV === 'development'),
			minimizer: [
				new TerserPlugin({
					terserOptions: {
						mangle: false,
						format: {
							comments: (node, comment) => comment.type === 'comment1'
								&& /(^\s==\/?UserScript==)|(^\s@.+\s+.+$)|(^\s$)/.test(comment.value)
						}
					}
				})
			]
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
			new CustomizedCleanWebpackPlugin(),
			...isStat ? [new BundleAnalyzerPlugin()] : [],
		],
		mode: 'development',
	};
};

module.exports = main;

const fs = require('fs');
const path = require('path');

const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
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
		namespace: 'https://github.com/tranphuquy19',
		author: 'tranphuquy19',
		version: `${process.env.USER_SCRIPT_VERSION || Date.now()}`,
	};

	const getHeaderRows = () => {
		const keys = Object.keys(headers);

		const rows = [];
		for (const key of keys) {
			let values = headers[key];
			if (typeof values === 'string') {
				values = [values];
			}
			// get current git branch
			const gitBranch = require('child_process')
				.execSync('git rev-parse --abbrev-ref HEAD')
				.toString()
				.trim();
			if (key === 'updateURL' || key === 'downloadURL') {
				values = values.map((value) => {
					let _value = value.replace('/raw/develop/dist', `/raw/${gitBranch}/dist`);
					if (process.env.MINIMIZE === 'true') {
						_value = _value.replace(/\.user\.js$/, '.min.user.js');
					}
					return _value;
				});
			}
			if (key === 'description') {
				// replace ${gitCommitId} with current git commit id
				values = values.map((value) => {
					let _value = value.replace(
						/\${gitCommitId}/g,
						require('child_process')
							.execSync('git rev-parse --short HEAD')
							.toString()
							.trim(),
					);
					return _value;
				}
				);
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
		stats: { warnings: false },
		output: {
			path: path.resolve(__dirname, 'dist'),
			filename: process.env.MINIMIZE === 'true' ? '[name].min.user.js' : '[name].user.js',
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
			},
		},
		optimization: {
			minimize: process.env.MINIMIZE === 'true',
			minimizer: [
				new TerserPlugin({
					terserOptions: {
						mangle: true,
						format: {
							comments: (node, comment) =>
								comment.type === 'comment1' &&
								/(^\s==\/?UserScript==)|(^\s@.+\s+.+$)|(^\s$)/.test(
									comment.value,
								),
						},
						keep_classnames: false,
						keep_fnames: false,
						compress: true,
					},
				}),
			],
			moduleIds: 'size',
			usedExports: true,
		},
		plugins: [
			new webpack.ProgressPlugin(),
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
			new CustomizedCleanWebpackPlugin(),
			...(isStat ? [new BundleAnalyzerPlugin()] : []),
		],
		mode: process.env.NODE_ENV,
	};
};

module.exports = main;

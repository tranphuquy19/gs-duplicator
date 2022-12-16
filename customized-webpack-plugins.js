const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

class CustomizedCleanWebpackPlugin {
	constructor({
		vendorJsFileRegex = /vendor.*\.js$/,
		licenseCommentRegex = /^\/\*\!.+\.LICENSE\.txt\s*\*\/\s*/,
		licenseTxtFilePattern = '**/*.LICENSE.txt',
		...rest
	} = {}) {
		this.licenseCommentRegex = licenseCommentRegex;
		this.vendorJsFileRegex = vendorJsFileRegex;
		this.licenseTxtFilePattern = licenseTxtFilePattern;
		this.restCleanWebpackPluginOptions = rest;
	}

	apply(compiler) {
		new CleanWebpackPlugin({
			cleanAfterEveryBuildPatterns: [this.licenseTxtFilePattern],
			protectWebpackAssets: false,
			...this.restCleanWebpackPluginOptions,
		}).apply(compiler);

		compiler.hooks.compilation.tap('CustomizedCleanWebpackPlugin', (compilation) => {
			compilation.hooks.afterProcessAssets.tap(
				'CustomizedCleanWebpackPlugin',
				(assets) => {
					Object.entries(assets).forEach(([fileName, source]) => {
						if (fileName.match(this.vendorJsFileRegex)) {
							compilation.updateAsset(
								fileName,
								new webpack.sources.RawSource(
									source.source().replace(this.licenseCommentRegex, ''),
								),
							);
						}
					});
				},
			);
		});
	}
}

module.exports = { CustomizedCleanWebpackPlugin };

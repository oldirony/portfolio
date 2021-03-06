const fs = require('fs')
const path = require('path')
const webpack = require('webpack')

module.exports = {
	entry: './source/server.js',
	output: {
		filename: 'server.bundle.js'
	},


	// keep node_module paths out of the bundle
	externals: fs.readdirSync(path.resolve(__dirname, 'node_modules')).concat([
		'react-dom/server', 'react/addons',
	]).reduce(function (ext, mod) {
		ext[mod] = 'commonjs ' + mod
		return ext
	}, {}),

	target: 'node',

	module: {
		rules: [
			{
				test:/\.js$/,
				exclude: /node_modules/,
				loader : 'babel-loader',
				options: {
					presets : ['es2015','stage-2', 'react']
				}
			}
		]
	},

	resolve: {
		alias: {
			utilities: path.resolve(__dirname, 'source/lib/utilities.js')
		}
	},
};
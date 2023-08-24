const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FixStyleOnlyEntriesPlugin = require('webpack-fix-style-only-entries');
const glob = require('glob');

const entries = {}

// Javascript
glob.sync('./resources/js/*.js').map((file) => {
	const pattern = new RegExp('resources/js');
	const f_name = path.dirname(file).replace(pattern, 'js') + '/' + path.basename(file, '.js');
	const f_path = './'+file
	entries[f_name] = {
		ext: 'js',
		file: f_path
	}
})

// SCSS
glob.sync('./resources/sass/**/*.scss', {
	ignore: [
		'resources/sass/_*.scss',
		'resources/sass/ignore/*'
	]
}).map((file) => {
	const pattern = new RegExp('resources/sass');
	const f_name = path.dirname(file).replace(pattern, 'css') + '/' + path.basename(file).replace(new RegExp('.scss'), '');
	const f_path = './'+file
	entries[f_name] = {
		ext: 'css',
		file: f_path
	}
})


let bundles = {};
for(let k in entries) {
	bundles[k] = entries[k].file
}


module.exports = {
	mode: 'development',
	entry: bundles,
	output: {
		filename: '[name].bundle.js',
		path: path.resolve(__dirname, './public/assets')
	},
	resolve: {
		extensions: ['.js', '.jsx', '.scss', '.css']
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/react']
					}
				}
			},
			{
				test: /\.scss$/,
				exclude: /node_modules/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader
					},
					{
						loader: 'css-loader',
						options: {
							sourceMap: true,
							url: false,
							importLoaders: 2
						}
					},
					{
						loader: 'sass-loader',
						options: {
							sourceMap: true
						}
					}
				]
			}
		]
	},
	plugins: [
		new FixStyleOnlyEntriesPlugin(),
		new MiniCssExtractPlugin({
			filename: "[name].css"
		})
	]
}
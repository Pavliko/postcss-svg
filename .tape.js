module.exports = {
	'postcss-svg': {
		'basic': {
			message: 'supports basic usage'
		},
		'basic:base64': {
			message: 'supports { "utf8": false } usage',
			options: {
				utf8: false
			}
		},
		'package': {
			message: 'supports package usage'
		},
		'paths': {
			message: 'supports { "paths" } usage',
			options: {
				dirs: 'sprite-module'
			}
		}
	}
};

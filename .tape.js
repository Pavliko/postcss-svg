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
		'basic:svgo': {
			message: 'supports { "svgo": true } usage',
			options: {
				svgo: true
			}
		},
		'package': {
			message: 'supports package usage'
		},
		'paths': {
			message: 'supports { "paths" } usage',
			options: {
				dirs: 'test/sprite-module'
			}
		}
	}
};

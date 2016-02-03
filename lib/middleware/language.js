var requestLanguage = require('express-request-language');
var assign = require('object-assign');

module.exports = function (keystone) {
	var languageOptions = assign({
		'supported languages': ['en-US'],
		'language cookie': 'language',
		'language cookie options': {},
		'language select url': '/languages/{language}',
	}, keystone.get('language options'));

	return requestLanguage({
		languages: languageOptions['supported languages'],
		cookie: {
			name: languageOptions['language cookie'],
			url: languageOptions['language select url'],
		},
		queryName: languageOptions['language query name'],
	});
};

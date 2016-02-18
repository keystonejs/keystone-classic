/**
 * Wraps an error in simple HTML to be sent as a response to the browser
 *
 * @api public
 */

function wrapHTMLError (title, err) {
	return '<html><head><meta charset=\'utf-8\'><title>Error</title>'
	+ '<link rel=\'stylesheet\' href=\'/' + this.get('admin path') + '/styles/error.css\'>'
	+ '</head><body><div class=\'error\'><h1 class=\'error-title\'>' + title + '</h1>'
	+ '<div class="error-message">' + (err || '') + '</div></div></body></html>';
}

module.exports = wrapHTMLError;

/**
 * Wraps an error in simple HTML to be sent as a response to the browser
 *
 * @api public
 */

var path = require('path');
var fs = require('fs');
var style = "";

//read style async into memory, if it is not ready or errors out, at least we have an unstyled error
fs.readFile(path.join(path.dirname(require.resolve('keystone')), 'templates/helpers/errors/styles/error.css'),
  function(err, css) {
    if(!err)
      style = css;
  });


function wrapHTMLError (title, err) {
	return '<html><head><meta charset=\'utf-8\'><title>Error</title>'
	+ '<style>' + style + '</style>'
	+ '</head><body><div class=\'error\'><h1 class=\'error-title\'>' + title + '</h1>'
	+ '<div class="error-message">' + (err || '') + '</div></div></body></html>';
}

module.exports = wrapHTMLError;

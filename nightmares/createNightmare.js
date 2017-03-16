var Nightmare = require('nightmare');

// Add further actions here
// Nightmare.action('sendKeyDown', function (name, options, parent, win, renderer, done) {
// 	parent.respondTo('sendKeyDown', function (unicodeValue, done) {
// 		win.focus();
// 		win.webContents.sendInputEvent({
// 			type: 'keyDown',
// 			keyCode: unicodeValue,
// 		});
// 		win.webContents.sendInputEvent({
// 			type: 'keyUp',
// 			keyCode: unicodeValue,
// 		});
// 		done();
// 	});
// 	done();
// },
// function (unicodeValue, done) {
// 	this.child.call('sendKeyDown', unicodeValue, done);
// });

module.exports = function createNightmare (opts) {
	return new Nightmare(Object.assign({}, { show: process.env.SHOW_ELECTRON || false }, opts));
};

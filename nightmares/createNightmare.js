var Nightmare = require('nightmare');

module.exports = function createNightmare (opts) {
	return new Nightmare(Object.assign({}, { show: process.env.SHOW_ELECTRON || false }, opts));
};

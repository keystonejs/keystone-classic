const Store = require('store-prototype');
const xhr = require('xhr');

const fn = function () {};

var csrfHeaders = {};
csrfHeaders[Keystone.csrf_header_key] = Keystone.csrf_token_value;

var _user = Keystone.user;

function callbackResponse (callback) {
	return function (err, resp, body) {
		if (!callback) return;
		if (err) return callback(err);
		if (resp.statusCode !== 200) return callback(body || true);
		callback(null, body);
	};
}

var SessionStore = new Store({
	getUser () {
		return _user;
	},
	signin (options, callback) {
		xhr({
			url: '/keystone/api/session/signin',
			method: 'post',
			json: options,
			headers: csrfHeaders
		}, callbackResponse(callback));
	},
	signout (callback) {
		callback = callback || fn;
		xhr({
			url: '/keystone/api/session/signout',
			method: 'post',
			json: {}
		}, callbackResponse(callback));
	}
});

export default SessionStore;

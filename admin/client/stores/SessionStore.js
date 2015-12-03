'use strict';

import Store from 'store-prototype';
import xhr from 'xhr';

var csrfHeaders = {};
csrfHeaders[Keystone.csrf_header_key] = Keystone.csrf_token_value;

var _user = Keystone.user;
var _adminPath = Keystone.adminPath;

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
			url: _adminPath + '/api/session/signin',
			method: 'post',
			json: options,
			headers: csrfHeaders
		}, callbackResponse(callback));
	},
	signout (callback) {
		callback = callback || function () {};
		xhr({
			url: _adminPath + '/api/session/signout',
			method: 'post',
			json: {}
		}, callbackResponse(callback));
	}
});

export default SessionStore;

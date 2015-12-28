'use strict';

import Store from 'store-prototype';
import xhr from 'xhr';

var csrfHeaders = {
	[Keystone.csrf_header_key]: Keystone.csrf_token_value
};

let { user, adminPath } = Keystone;

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
		return user;
	},
	signin (options, callback) {
		xhr({
			url: `${adminPath}/api/session/signin`,
			method: 'post',
			json: options,
			headers: csrfHeaders
		}, callbackResponse(callback));
	},
	signout (callback) {
		callback = callback || function () {};
		xhr({
			url: `${adminPath}/api/session/signout`,
			method: 'post',
			json: {}
		}, callbackResponse(callback));
	}
});

export default SessionStore;

const Store = require('store-prototype');
const xhr = require('xhr');

var _user = Keystone.user;

var SessionStore = new Store({
	getUser () {
		return _user;
	},
	signin (options, callback) {
		xhr({
			url: '/keystone/api/session/signin',
			method: 'post',
			json: options
		}, (err, resp, body) => {
			callback && callback(err, body);
		});
	},
	signout (callback) {
		xhr({
			url: '/keystone/api/session/signout',
			method: 'post',
			json: {}
		}, (err, resp, body) => {
			callback && callback(err, body);
		});
	}
});

export default SessionStore;

var demand = require('must'),
	csrf = require('../../lib/security/csrf');

var REQ = function(method) {
	var rtn = {
		session: {},
		query: {},
		method: method || 'GET'
	};
	if method == 'POST' {
		rtn.body = {};
	}
	return rtn;
}

var RES = function() {
	return {
		locals: {}
	};
}

var memory = {
	req: REQ(),
	post: REQ('POST'),
	res: RES()
};

describe('CSRF', function() {
	describe('getReqSecret()', function() {
		it('must return a new secret', function() {
			var secret = memory.firstSecret = csrf.getReqSecret(memory.req);
			secret.must.contain('==');
		});
		it('must return the same secret', function() {
			var secret = csrf.getReqSecret(memory.req);
			secret.must.be(memory.firstSecret);
		});
	});
})

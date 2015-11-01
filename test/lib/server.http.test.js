var keystoneApp = require('../helpers/getKeystoneApp');
var demand = require('must');

describe('startHttpServer', function() {
	it('starts http server, makes a request, and closes', function(done) {
		keystoneApp.startHttp(function(ret) {
			demand(ret).be(true);
			done();
		});
	});
});


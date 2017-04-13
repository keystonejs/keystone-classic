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

describe('startHttpsServer', function() {
	it('starts ssl server, makes a request, and closes', function(done) {
		keystoneApp.startHttps(function(ret) {
			demand(ret).be(true);
			done();
		});
	});
});

describe('startSocketServer', function() {
	it('starts http socket server, makes a request, and closes', function(done) {
		this.timeout(4000);
		keystoneApp.startSocket(function(ret) {
			demand(ret).be(true);
			done();
		});
		
	});
});

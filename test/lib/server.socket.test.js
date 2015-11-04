var keystoneApp = require('../helpers/getKeystoneApp');
var demand = require('must');

describe('startSocketServer', function() {
	it('starts http socket server, makes a request, and closes', function(done) {
		this.timeout(4000);
		keystoneApp.startSocket(function(ret) {
			demand(ret).be(true);
			done();
		});
		
	});
});

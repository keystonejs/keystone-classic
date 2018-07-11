var mongoose = require('mongoose');
var mongoUri = 'mongodb://localhost:27017/test';

function dropTestDatabase(done) {
	mongoose.connect(mongoUri, { useNewUrlParser: true }, function (err) {
		if (!err) {
			mongoose.connection.db.dropDatabase(function (err) {
				mongoose.connection.close(function (err) {
					done(err);
				});
			});
		} else {
			done(err);
		}
	});
}

function pretestTasks() {
	dropTestDatabase(function () {});
}

pretestTasks();

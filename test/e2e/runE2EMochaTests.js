var exec = require('child_process').exec;

module.exports = function (options, done) {
  exec('./node_modules/.bin/mocha "nightmares/**/*.js"', function(err, stdout, stderr) {
	console.log(`stdout: ${stdout}`);
	console.log(`stderr: ${stderr}`);
	if (err) {
		console.error(`exec error: ${err}`);
		return done(err);
	}
	done();
  });
};

module.exports = function (req, res, next) {
	res.apiError = function apiError(key, err) {
		var statusCode = 500;
		if (key === 404) {
			statusCode = 404;
			key = null;
			key = 'not found';
		}
		if (!key) {
			key = 'unknown error';
		}
		if (!err) {
			err = 'API Error';
		}
		if (typeof err === 'object' && err.message) {
			err = err.message;
		}
		res.status(statusCode);
		res.json({ err: err, key: key });
	};
	next();
};

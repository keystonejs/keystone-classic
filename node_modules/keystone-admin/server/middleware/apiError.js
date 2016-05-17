var assign = require('object-assign');

/*
	This middleware simplifies returning errors from the API.

	Example usage patterns and expected responses:
		apiError('database error', err) => 500 { err }
		apiError(403, 'invalid csrf') => 403 { error: 'invalid csrf' }
		apiError(403, 'validation errors', err) => 403 { error: 'validation errors', detail: err }
		apiError(403, 'not allowed', 'You can not delete yourself') => 403 { error: 'not allowed', detail: 'You can not delete yourself' }
		apiError(400, err) => 400 { err }
		apiError(err) => 500 { err }
*/

module.exports = function (req, res, next) {
	res.apiError = function apiError (statusCode, error, detail) {
		if (typeof statusCode !== 'number' && arguments.length < 3) {
			detail = error;
			error = statusCode;
			statusCode = 500;
		}
		if (statusCode) {
			res.status(statusCode);
		}
		if (error instanceof Error) {
			error = error.name !== 'Error' ? error.name + ': ' + error.message : error.message;
		}
		if (detail instanceof Error) {
			detail = detail.name !== 'Error' ? detail.name + ': ' + detail.message : detail.message;
		}
		var data = typeof error === 'string' || (error && detail)
			? { error: error, detail: detail }
			: error;
		res.json(data);
		return assign({
			statusCode: statusCode,
		}, data);
	};
	next();
};

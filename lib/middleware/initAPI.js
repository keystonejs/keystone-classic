/**
 * Middleware to initialise a standard API response.
 *
 * Adds `res.apiResonse` and `res.apiError` methods.
 *
 * ####Example:
 *
 *     app.all('/api*', initAPI);
 *
 * @param {app.request} req
 * @param {app.response} res
 * @param {function} next
 * @api public
 */

// The exported function returns a closure that retains
// a reference to the keystone instance, so it can be
// passed as middeware to the express app.

exports = module.exports = function (keystone) {
    return function initAPI(req, res, next) {

        res.apiResponse = function (status) {
            if (req.query.callback)
                res.jsonp(status);
            else
                res.json(status);
        };

        //added additional not found api response
        res.apiNotFound = function (key, msg, code) {
            res.status(code || 403);
            res.apiResponse({error: key || 'error', message: msg});
        };

        res.apiError = function (key, err, msg, code) {
            msg = msg || 'Error';
            key = key || 'unknown error';
            msg += ' (' + key + ')';
            if (keystone.get('logger')) {
                console.log(msg + (err ? ':' : ''));
                if (err) {
                    console.log(err);
                }
            }
            res.status(code || 500);
            res.apiResponse({error: key || 'error', detail: err});
        };

        next();
    };
};

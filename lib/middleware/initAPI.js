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
    var initAPI = function (req, res, next) {

        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

        res.apiResponse = function (status) {



            if (req.query.callback)
                res.jsonp(status);
            else
                res.json(status);
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

        //added additional not found api response
        res.apiNotFound = function (key, msg, code) {
            res.status(code || 404);
            res.apiResponse({error: key || 'error', message: 'data not found:' + msg});
        };

        //adding permission not allowed. or forbidden
        res.apiPermissionNotAllow = function (key, msg, code) {
            res.status(code || 403);
            res.apiResponse({error: key || 'error', message: 'permission not allow: ' + msg});
        };

        next();

    };

    return initAPI;
};

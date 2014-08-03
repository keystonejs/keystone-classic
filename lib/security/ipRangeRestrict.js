'use strict';

var _ = require('underscore'),
	range_check = require('range_check'),
	util = require('util');

/**
 * Implement IP range-based access control.
 *
 * Returns a middleware that restricts requests to those originating
 * from the IP ranges described by 'ipRanges'. IP ranges are specified
 * using CIDR format, e.g. 127.0.0.0/8. Multiple ranges must be
 * separated by space characters or a comma:
 *
 * 192.168.0.0/16,127.0.0.0/8
 *
 * Requests from outside an allowed range receive a 403 response.
 *
 * NB: the express 'trust proxy' setting must be enabled for this to
 * work.
 *
 * @param {string} ipRanges
 * @param {function} wrapHTMLError
 */
exports = module.exports = function(ipRanges, wrapHTMLError) {
	
	/**
	 * Returns an Express middleware.
	 *
	 * @param {app.request} req
	 * @param {app.response} res
	 * @param {function} next
	 */
	 return function (req, res, next) {
	 	
		// Require that at least one IP range has been provided.
		if (_.isUndefined(ipRanges) ) {
			throw new Error('Allowed IP range is not defined');
		}
		
		// The set of allowed ranges has to be separated by space
		// characters or a comma.
		var allowedRanges = ipRanges.split(/\s+|,/);
		
		// Regular expression for matching IPv4 CIDR ranges.
		var cidr = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])(\/(\d|[1-2]\d|3[0-2]))$/;
		
		// Keep only those ranges that match CIDR format.
		allowedRanges = _.filter(allowedRanges, function (ipRange) {
			return _.isString(ipRange) && ipRange.match(cidr);
		});
		if (allowedRanges.length <= 0) {
			throw new Error('No valid CIDR ranges were specified');
		}
		
		// Using req.ips requires that express 'trust proxy' setting is
		// true. When it *is* set the value for ips is extracted from the
		// X-Forwarded-For request header. The originating IP address is
		// the last one in the array.
		var requestIP = (req.ips.length > 0) ? req.ips.slice().pop() : req.ip;
		
		// Deny the request if request IP is not in one of the allowed
		// IP address ranges.
		var requestAllowed = range_check.in_range(requestIP, allowedRanges);
		
		if (!requestAllowed) {
			var msg = '-> blocked request from %s (not in allowed IP range)';
			console.log(util.format(msg, req.ip));
			
			// Display error page to the user.
			var title = 'Sorry, your request is not authorized (403)';
			var message = 'Requests from outside permitted IP range are not allowed';
			var htmlError = wrapHTMLError(title, message);
			
			return res.status(403).send(htmlError);
		}
		
		next();
		
	};
	
};

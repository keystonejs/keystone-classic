var React = require('react');
var renderToString = require('react-dom/server').renderToString;
var ReactRouter = require('react-router');

var match = ReactRouter.match;
var RoutingContext = ReactRouter.RoutingContext;

module.exports = function createComponentRouter (routes) {
	return function componentRouter (req, res, next) {
		match({ routes: routes, location: req.url },
			function (error, redirectLocation, renderProps) {

				if (error) return res.status(500).send(error.message);

				if (redirectLocation) {
					return res.redirect(302,
						redirectLocation.pathname + redirectLocation.search);
				}

				if (renderProps) {
					return res.render('default', {
						content: renderToString(React.createElement(RoutingContext, renderProps))
					});
				}

				next(null);
			}
		);
	};
};

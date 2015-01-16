/**
 * This file exposes the top-level application components for Keystone.
 * 
 * It's a temporary workaround until we figure out a better way to bootstrap
 * the views, or move to a completely client-side app that can be generated
 * without the requirements for view-specific scripts.
 */

module.exports = {
	Views: {
		Item: require('./views/item'),
		List: require('./views/list')
	}
};

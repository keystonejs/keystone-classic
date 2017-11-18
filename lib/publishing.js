/*!
 * Module dependencies.
 */

var keystone = require('../');

/**
 * Publishing Constructor
 * =================
 *
 * Helper to simplify content publishing logic
 *
 * @api public
 */

function Publishing (req, res) {

	if (!req || req.constructor.name !== 'IncomingMessage') {
		throw new Error('Keystone.View Error: Express request object is required.');
	}

	if (!res || res.constructor.name !== 'ServerResponse') {
		throw new Error('Keystone.View Error: Express response object is required.');
	}

	this.req = req;
	this.res = res;

}

module.exports = Publishing;

/**
 * Returns the viewable publishing states for the current user
 * @param {String} listType Our List type to check for states as these can be different for each model
 */
Publishing.prototype.getViewableStates = function (listType) {
	// const options = keystone.list(listType).getOptions();
	const previewStates = ['draft', 'published', 'archived'];
	const publishStates = ['published'];
	const isRequestingPreview = this.req.query.preview || this.req.params.preview || this.req.body.preview || false;
	var viewableStates = ['none'];
    // If the user is asking for a preview & has permissions then we can allow more viewable states
	if (isRequestingPreview) {
		if (this.req.user && this.req.user.canAccessKeystone) {
			viewableStates = previewStates;
			console.log('Publishing States:Preview: User has preview permissions ' + viewableStates + isRequestingPreview + ' user can access' + this.req.user.canAccessKeystone + ' Query:' + JSON.stringify(this.req.query));

		} else {
			viewableStates = ['none'];
			console.log('Publishing:Preview: User doesnt have permissions for preview' + viewableStates + isRequestingPreview + ' Query:' + JSON.stringify(this.req.query));
		}

	} else {
		viewableStates = publishStates;
		console.log('Publishing States:No Preview:' + viewableStates + ' Query:' + JSON.stringify(this.req.query));
	}

	return viewableStates;
};


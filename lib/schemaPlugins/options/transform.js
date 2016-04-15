var _ = require('lodash');

module.exports = function transform (doc, ret) {
	if (doc._populatedRelationships) {
		_.forEach(doc._populatedRelationships, function (on, key) {
			if (!on) return;
			ret[key] = doc[key];
		});
	}
};

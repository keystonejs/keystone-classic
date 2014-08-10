var mongoose = require('mongoose');

module.exports = function removeModel(modelName) {
	delete mongoose.models[modelName];
	delete mongoose.modelSchemas[modelName];	
}

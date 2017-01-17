module.exports = function safeRequire (library, feature) {
	try {
		return require(library);
	} catch (error) {
		if (error.code === 'MODULE_NOT_FOUND') {
			throw new Error('\nTo use ' + feature + ' install ' + library);
		}

		throw error;
	}
};

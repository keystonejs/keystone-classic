module.exports = function safeRequire (library, feature) {
	try {
		return require(library);
	} catch (error) {
		if (error.code === 'MODULE_NOT_FOUND') {
			console.error('\nTo use ' + feature + ' install ' + library);
			process.exit(1);
			return;
		}

		throw error;
	}
};

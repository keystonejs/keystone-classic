var re = /^[0-9a-fA-F]{24}$/;
module.exports = function isMongoObjectId (str) {
	if (str && typeof str !== 'string' && str.toString) {
		str = str.toString();
	}

	return str && re.test(str);
};

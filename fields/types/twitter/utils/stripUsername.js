/**
 * Strip twitter username from url, remove @
 */
module.exports = function stripUsername (twitter) {
	if (twitter.charAt(twitter.length - 1) === '/') {
		twitter = twitter.slice(0, -1);
	}
	var replacePosition = twitter.lastIndexOf('/');
	twitter = twitter.substring(replacePosition + 1);
	if (twitter.indexOf('@') !== -1) {
		return twitter.replace('@', '');
	}
	return twitter;
};

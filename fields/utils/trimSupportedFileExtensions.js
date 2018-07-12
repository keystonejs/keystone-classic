const _ = require('lodash');

/**
 * Trim supported file extensions from the public id because cloudinary uses these at
 * the end of the a url to dynamically convert the image filetype
 */
function trimSupportedFileExtensions (publicId) {
	var supportedExtensions = [
		'.jpg', '.jpe', '.jpeg', '.jpc', '.jp2', '.j2k', '.wdp', '.jxr',
		'.hdp', '.png', '.gif', '.webp', '.bmp', '.tif', '.tiff', '.ico',
		'.pdf', '.ps', '.ept', '.eps', '.eps3', '.psd', '.svg', '.ai',
		'.djvu', '.flif', '.tga',
	];
	for (var i = 0; i < supportedExtensions.length; i++) {
		var extension = supportedExtensions[i];
		if (_.endsWith(publicId, extension)) {
			return publicId.slice(0, -extension.length);
		}
	}
	return publicId;
}

module.exports = trimSupportedFileExtensions;

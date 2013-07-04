var cloudinary = require('cloudinary');

// Simply calling the function is a shorthand way of checking whether there is an image or not.
function img(image) {
	return (image && image.public_id) ? true : false;
}

img.tag = function(image, options) {
	return (image && image.public_id) ? cloudinary.image(image, options) : '';
}

var src = img.src = function(image, options) {
	return cloudinary.url(image.public_id + '.' + image.format, options);
}

// Resizes the image to fit within the dimensions given.
img.fit = function(image, width, height) {
	return src(image, { width: width, height: height, crop: 'fit' });
}

// Resizes the image (without upscaling) to fit within the dimensions given.
img.limit = function(image, width, height) {
	return src(image, { width: width, height: height, crop: 'limit' });
}

// Resizes and crops the image to fit (exactly) the dimensions given.
img.fill = function(image, width, height) {
	return src(image, { width: width, height: height, crop: 'fill', gravity: 'faces' });
}

// Crops the image to fit (exactly) the dimensions given.
img.crop = function(image, width, height) {
	return src(image, { width: width, height: height, crop: 'crop', gravity: 'faces' });
}

// Resizes and crops the image to fit within the dimensions given
img.thumbnail = function(image, width, height) {
	return src(image, { width: width, height: height, crop: 'thumb', gravity: 'faces' });
}

// Used to create a blank image value in the database
img.blank = function() {
	return {
		public_id: '',
		version: 0,
		signature: '',
		format: '',
		resource_type: '',
		url: '',
		width: 0,
		height: 0,
		secure_url: ''
	};
}

module.exports = exports = img;
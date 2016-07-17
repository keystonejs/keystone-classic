module.exports = {
	Field: require('../CloudinaryImagesField'),
	Filter: require('../CloudinaryImagesFilter'),
	section: 'Miscellaneous',
	spec: {
		label: 'CloudinaryImages',
		path: 'cloudinaryimages',
		paths: {
			action: 'cloudinaryimages_action',
			folder: 'cloudinaryimages.folder',
			order: 'cloudinaryimages_order',
			upload: 'cloudinaryimages_upload',
			uploads: 'cloudinaryimages_uploads',
		},
		value: [],
	},
};

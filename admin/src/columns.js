var React = require('react');

var Columns = {
	name: require('../../fields/types/name/NameColumn'),
	email: require('../../fields/types/email/EmailColumn'),
	text: require('../../fields/types/text/TextColumn'),
	boolean: require('../../fields/types/boolean/BooleanColumn'),
	number: require('../../fields/types/number/NumberColumn'),
	password: require('../../fields/types/password/PasswordColumn'),
	datearray: require('../../fields/types/datearray/DateArrayColumn'),
	textarray: require('../../fields/types/textarray/TextArrayColumn'),
	numberarray: require('../../fields/types/numberarray/NumberArrayColumn'),
	location: require('../../fields/types/location/LocationColumn'),
	select: require('../../fields/types/select/SelectColumn'),
	money: require('../../fields/types/money/MoneyColumn'),
	url: require('../../fields/types/url/UrlColumn'),
	datetime: require('../../fields/types/datetime/DatetimeColumn'),
	date: require('../../fields/types/date/DateColumn'),
	code: require('../../fields/types/code/CodeColumn'),
	markdown: require('../../fields/types/markdown/MarkdownColumn'),
	html: require('../../fields/types/html/HtmlColumn'),
	embedly: require('../../fields/types/embedly/EmbedlyColumn'),
	textarea: require('../../fields/types/textarea/TextareaColumn'),
	cloudinaryimage: require('../../fields/types/cloudinaryimage/CloudinaryImageColumn'),
	cloudinaryimages: require('../../fields/types/cloudinaryimages/CloudinaryImagesColumn'),
	key: require('../../fields/types/key/KeyColumn'),
	s3file: require('../../fields/types/s3file/S3FileColumn'),
	azurefile: require('../../fields/types/azurefile/AzureFileColumn'),
	localfile: require('../../fields/types/localfile/LocalFileColumn'),
	localfiles: require('../../fields/types/localfiles/LocalFilesColumn'),
	geopoint: require('../../fields/types/geopoint/GeoPointColumn'),
	color: require('../../fields/types/color/ColorColumn')
};

Columns.__unrecognised__ = Columns.text;
module.exports = Columns;
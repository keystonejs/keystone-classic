/**
 * Helper object of all column components
 */

var Columns = {
	azurefile: require('keystone/fields/admin/azurefile/AzureFileColumn'),
	boolean: require('keystone/fields/admin/boolean/BooleanColumn'),
	cloudinaryimage: require('keystone/fields/admin/cloudinaryimage/CloudinaryImageColumn'),
	cloudinaryimages: require('keystone/fields/admin/cloudinaryimages/CloudinaryImagesColumn'),
	code: require('keystone/fields/admin/code/CodeColumn'),
	color: require('keystone/fields/admin/color/ColorColumn'),
	date: require('keystone/fields/admin/date/DateColumn'),
	datearray: require('keystone/fields/admin/datearray/DateArrayColumn'),
	datetime: require('keystone/fields/admin/datetime/DatetimeColumn'),
	email: require('keystone/fields/admin/email/EmailColumn'),
	embedly: require('keystone/fields/admin/embedly/EmbedlyColumn'),
	geopoint: require('keystone/fields/admin/geopoint/GeoPointColumn'),
	html: require('keystone/fields/admin/html/HtmlColumn'),
	key: require('keystone/fields/admin/key/KeyColumn'),
	localfile: require('keystone/fields/admin/localfile/LocalFileColumn'),
	localfiles: require('keystone/fields/admin/localfiles/LocalFilesColumn'),
	location: require('keystone/fields/admin/location/LocationColumn'),
	markdown: require('keystone/fields/admin/markdown/MarkdownColumn'),
	money: require('keystone/fields/admin/money/MoneyColumn'),
	name: require('keystone/fields/admin/name/NameColumn'),
	number: require('keystone/fields/admin/number/NumberColumn'),
	numberarray: require('keystone/fields/admin/numberarray/NumberArrayColumn'),
	password: require('keystone/fields/admin/password/PasswordColumn'),
	relationship: require('keystone/fields/admin/relationship/RelationshipColumn'),
	s3file: require('keystone/fields/admin/s3file/S3FileColumn'),
	select: require('keystone/fields/admin/select/SelectColumn'),
	text: require('keystone/fields/admin/text/TextColumn'),
	textarea: require('keystone/fields/admin/textarea/TextareaColumn'),
	textarray: require('keystone/fields/admin/textarray/TextArrayColumn'),
	url: require('keystone/fields/admin/url/UrlColumn'),
};

Columns.id = require('keystone/fields/components/columns/IdColumn');
Columns.__unrecognised__ = require('keystone/fields/components/columns/InvalidColumn');
module.exports = Columns;

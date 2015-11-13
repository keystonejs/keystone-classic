var Columns = {
	azurefile        : require('../../fields/types/azurefile/AzureFileColumn'),
	boolean          : require('../../fields/types/boolean/BooleanColumn'),
	cloudinaryimage  : require('../../fields/types/cloudinaryimage/CloudinaryImageColumn'),
	cloudinaryimages : require('../../fields/types/cloudinaryimages/CloudinaryImagesColumn'),
	code             : require('../../fields/types/code/CodeColumn'),
	color            : require('../../fields/types/color/ColorColumn'),
	date             : require('../../fields/types/date/DateColumn'),
	datearray        : require('../../fields/types/datearray/DateArrayColumn'),
	datetime         : require('../../fields/types/datetime/DatetimeColumn'),
	email            : require('../../fields/types/email/EmailColumn'),
	embedly          : require('../../fields/types/embedly/EmbedlyColumn'),
	geopoint         : require('../../fields/types/geopoint/GeoPointColumn'),
	html             : require('../../fields/types/html/HtmlColumn'),
	key              : require('../../fields/types/key/KeyColumn'),
	localfile        : require('../../fields/types/localfile/LocalFileColumn'),
	localfiles       : require('../../fields/types/localfiles/LocalFilesColumn'),
	location         : require('../../fields/types/location/LocationColumn'),
	markdown         : require('../../fields/types/markdown/MarkdownColumn'),
	money            : require('../../fields/types/money/MoneyColumn'),
	name             : require('../../fields/types/name/NameColumn'),
	number           : require('../../fields/types/number/NumberColumn'),
	numberarray      : require('../../fields/types/numberarray/NumberArrayColumn'),
	password         : require('../../fields/types/password/PasswordColumn'),
	relationship     : require('../../fields/types/relationship/RelationshipColumn'),
	s3file           : require('../../fields/types/s3file/S3FileColumn'),
	select           : require('../../fields/types/select/SelectColumn'),
	text             : require('../../fields/types/text/TextColumn'),
	textarea         : require('../../fields/types/textarea/TextareaColumn'),
	textarray        : require('../../fields/types/textarray/TextArrayColumn'),
	url              : require('../../fields/types/url/UrlColumn')
};

Columns.id = require('../../fields/components/columns/IdColumn');
Columns.__unrecognised__ = require('../../fields/components/columns/InvalidColumn');
module.exports = Columns;

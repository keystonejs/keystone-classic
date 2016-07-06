import moment from 'moment';

const DATE_FORMAT = 'MMM D YYYY';
const DATETIME_FORMAT = 'MMM D YYYY h:mm:ss';

function getFilterLabel (field, value) {

	console.log('field', field);
	console.log('value', value);

	switch (field.type) {
		// BOOLEAN
		case 'boolean': {
			return value.value
				? field.label
				: `NOT ${field.label}`;
		}

		// DATE
		case 'date': {
			const joiner = value.inverted ? 'is NOT' : 'is';
			const mode = value.mode === 'on' ? '' : value.mode;
			const formattedValue = value.mode === 'between'
				? `${moment(value.after).format(DATE_FORMAT)} and ${moment(value.before).format(DATE_FORMAT)}`
				: moment(value.value).format(DATE_FORMAT);

			return `${field.label} ${joiner} ${mode} ${formattedValue}`;
		}

		// DATE ARRAY
		case 'datearray': {
			const presence = value.presence === 'some' ? 'Some' : 'No';
			const formattedValue = value.mode === 'between'
				? `${moment(value.after).format(DATE_FORMAT)} and ${moment(value.before).format(DATE_FORMAT)}`
				: moment(value.value).format(DATE_FORMAT);

			return `${presence} ${field.label} are ${value.mode} ${formattedValue}`;
		}

		// DATETIME
		case 'datetime': {
			const joiner = value.inverted ? 'is NOT' : 'is';
			const mode = value.mode === 'on' ? '' : value.mode;
			const formattedValue = value.mode === 'between'
				? `${moment(value.after).format(DATETIME_FORMAT)} and ${moment(value.before).format(DATETIME_FORMAT)}`
				: moment(value.value).format(DATETIME_FORMAT);

			return `${field.label} ${joiner} ${mode} ${formattedValue}`;
		}

		// GEOPOINT
		// TODO distance needs a qualifier, currently defaults to "km"?
		case 'geopoint': {
			const mode = value.distance.mode === 'max' ? 'is within' : 'is at least';
			const distance = `${value.distance.value}km`;
			const conjunction = value.distance.mode === 'max' ? 'of' : 'from';
			const latlong = `${value.lat}, ${value.lon}`;

			return `${field.label} ${mode} ${distance} ${conjunction} ${latlong}`;
		}

		// LOCATION
		case 'location': {
			const joiner = value.inverted ? 'does NOT match' : 'matches';

			// Remove undefined values before rendering the template literal
			const formattedValue = [
				value.street,
				value.city,
				value.state,
				value.code,
				value.country,
			].join(' ').trim();

			return `${field.label} ${joiner} "${formattedValue}"`;
		}

		// NUMBER & MONEY
		case 'number':
		case 'money': {
			let mode;
			if (value.mode === 'equals') mode = 'is';
			else if (value.mode === 'gt') mode = 'is greater than';
			else if (value.mode === 'lt') mode = 'is less than';
			else if (value.mode === 'between') mode = '';
			const formattedValue = value.mode === 'between'
				? `is between ${value.value.min} and ${value.value.max}`
				: value.value;

			return `${field.label} ${mode} ${formattedValue}`;
		}

		// RELATIONSHIP
		// TODO populate relationship, currently rendering an ID
		case 'relationship': {
			let joiner = value.inverted ? 'is NOT' : 'is';
			let formattedValue = (value.value.length > 1)
				? value.value.join(', or ')
				: value.value[0];

			return `${field.label} ${joiner} ${formattedValue}`;
		}

		// SELECT
		case 'select': {
			let joiner = value.inverted ? 'is NOT' : 'is';
			let formattedValue = (value.value.length > 1)
				? value.value.join(', or ')
				: value.value[0];

			return `${field.label} ${joiner} ${formattedValue}`;
		}

		// TEXT
		// Code, Color, Email, HTML, Key, Markdown, Name, Textarea, Url
		default: {
			let mode = '';
			if (value.mode && value.mode === 'beginsWith') {
				mode = value.inverted
					? 'does NOT begin with'
					: 'begins with';
			} else if (value.mode && value.mode === 'endsWith') {
				mode = value.inverted
					? 'does NOT end with'
					: 'ends with';
			} else if (value.mode && value.mode === 'exactly') {
				mode = value.inverted
					? 'is NOT exactly'
					: 'is exactly';
			} else if (value.mode && value.mode === 'contains') {
				mode = value.inverted
					? 'does NOT contain'
					: 'contains';
			}

			return `${field.label} ${mode} "${value.value}"`;
		}
	}
};

module.exports = getFilterLabel;

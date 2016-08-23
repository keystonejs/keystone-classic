module.exports = {

	validateNumber: function (value, rules, field) {
		var messages = [];

		if (rules.minValue !== undefined && rules.minValue !== null) {
			if (value < rules.minValue) {
				messages.push('The number in the ' + field.label + ' field must be greater than or equal to ' + rules.minValue + '.');
			}
		}

		if (rules.maxValue !== undefined && rules.maxValue !== null) {
			if (value > rules.maxValue) {
				messages.push('The number in the ' + field.label + ' field must be less than or equal to ' + rules.maxValue + '.');
			}
		}

		if (rules.mustBeEven) {
			if (value % 2 !== 0) {
				messages.push('The number in the ' + field.label + ' field must be even.');
			}
		}

		if (rules.mustBeOdd) {
			if (value % 2 === 0) {
				messages.push('The number in the ' + field.label + ' field must be odd.');
			}
		}

		if (messages.length > 0) {
			field.options.invalidMessage = messages;
			return false;
		} else {
			return true;
		}
	},
};

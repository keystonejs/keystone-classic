module.exports = {

	ValidateNumber: function (value, rules, field) {

		if (rules.minValue !== undefined && rules.minValue !== null) {
			if (value < rules.minValue) {
				field.options.invalidMessage = 'The number in the ' + field.label + ' field must be greater than or equal to' + rules.minValue + '.';
				return false;
			}
		}

		if (rules.maxValue !== undefined && rules.maxValue !== null) {
			if (value > rules.maxValue) {
				field.options.invalidMessage = 'The number in the ' + field.label + ' field must be less than or equal to' + rules.maxValue + '.';
				return false;
			}
		}

		if (rules.mustBeEven) {
			if (value % 2 !== 0) {
				field.options.invalidMessage = 'The number in the ' + field.label + ' field must be even.';
				return false;
			}
		}

		if (rules.mustBeOdd) {
			if (value % 2 === 0) {
				field.options.invalidMessage = 'The number in the ' + field.label + ' field must be odd.';
				return false;
			}
		}

		return true;
	},
};

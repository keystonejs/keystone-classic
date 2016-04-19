module.exports = {
	nameList: {
		selector: 'form[action="/keystone/names"]',
		sections: {
			nameField: {
				selector: '.field-type-text[for="name"]',
				elements: {
					label: '.FormLabel',
					value: 'input[name="name"]',
				}
			},
			fieldA: {
				selector: '.field-type-name[for="fieldA"]',
				elements: {
					label: '.FormLabel',
					firstName: 'input[name="fieldA.first"]',
					firstNamePlaceholder: 'input[placeholder="First name"]',
					lastName: 'input[name="fieldA.last"]',
					lastNamePlaceholder: 'input[placeholder="Last name"]',
				},
			},
		},
	},
};

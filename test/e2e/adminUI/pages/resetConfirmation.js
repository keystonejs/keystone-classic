module.exports = {
	elements: {
		resetButton: 'button.Button.Button--danger',
		cancelButton: 'button.Button.Button--link-cancel',
	},
	commands: [{
		reset: function () {
			return this
				.click('@resetButton');
		},
		cancel: function () {
			return this
				.click('@cancelButton');
		},
	}],
};

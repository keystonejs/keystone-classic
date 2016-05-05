module.exports = {
	elements: {
		deleteButton: 'button.Button.Button--danger',
		cancelButton: 'button.Button.Button--link-cancel',
	},
	commands: [{
		delete: function () {
			return this
				.click('@deleteButton');
		},
		cancel: function () {
			return this
				.click('@cancelButton');
		},
	}],
};

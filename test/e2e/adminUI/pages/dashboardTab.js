var utils = require('../../utils');

module.exports = function dashboardTab (config) {
	return {
		selector: '.dashboard-group__list[data-list-path="' + config.name + '"]',
		elements: {
			label: '.dashboard-group__list[data-list-path="' + config.name + '"] .dashboard-group__list-label',
			plusIconLink: '.dashboard-group__list[data-list-path="' + config.name + '"] a.dashboard-group__list-create.octicon.octicon-plus',
			itemCount: '.dashboard-group__list[data-list-path="' + config.name + '"] .dashboard-group__list-count',
		},
		commands: [{
			assertUI: function() {
				this
					.expect.element('@label').text.to.equal(utils.titlecase(config.name));
				this
					.expect.element('@plusIconLink').to.be.visible;
				this
					.expect.element('@plusIconLink').to.have.attribute('class').which.contains('dashboard-group__list-create octicon octicon-plus');
				this
					.expect.element('@itemCount').text.to.equal(config.items);
			},

		}],
	};
}

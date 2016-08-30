var dashboardTab = require('./dashboardTab');

module.exports = function dashboardGroup (config) {
	var sections = {};
	config.tabs.forEach(function (tab) {
		sections[tab.name] = dashboardTab(tab);
	});

	return {
		selector: '.dashboard-group[data-section-label="' + config.groupName + '"]',
		elements: {
			subheading: '.dashboard-group__heading',
		},
		sections: sections,
		commands: [{
			assertUI: function() {
				for (var tab in this.section) {
					if (this.section.hasOwnProperty(tab)) {
						this.section[tab].assertUI();
					}
				}
			},
		}],
	};
}

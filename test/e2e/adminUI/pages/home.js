module.exports = {
	elements: {
		dashboardHeader: '.dashboard-heading'
	},
	sections: {
		accessGroup: {
			selector: '.dashboard-group:nth-child(1)',
			elements: {
				subheading: '.dashboard-group__heading[data-section-label="Access"]',
			},
			sections: {
				usersTab: {
					selector: '.dashboard-group__list[data-list-path="users"]',
					elements: {
						label: '.dashboard-group__list[data-list-path="users"] .dashboard-group__list-label',
						plusIconLink: '.dashboard-group__list[data-list-path="users"] a.dashboard-group__list-create.octicon.octicon-plus',
						itemCount: '.dashboard-group__list[data-list-path="users"] .dashboard-group__list-count',
					},
				},
			},
		},
		fieldsGroup: {
			selector: '.dashboard-group:nth-child(2)',
			elements: {
				subheading: '.dashboard-group__heading[data-section-label="Fields"]',
			},
			sections: {
				booleansTab: {
					selector: '.dashboard-group__list[data-list-path="booleans"]',
					elements: {
						label: '.dashboard-group__list[data-list-path="booleans"] .dashboard-group__list-label',
						plusIconLink: '.dashboard-group__list[data-list-path="booleans"] a.dashboard-group__list-create.octicon.octicon-plus',
						itemCount: '.dashboard-group__list[data-list-path="booleans"] .dashboard-group__list-count',
					},
				},
				codesTab: {
					selector: '.dashboard-group__list[data-list-path="codes"]',
					elements: {
						label: '.dashboard-group__list[data-list-path="codes"] .dashboard-group__list-label',
						plusIconLink: '.dashboard-group__list[data-list-path="codes"] a.dashboard-group__list-create.octicon.octicon-plus',
						itemCount: '.dashboard-group__list[data-list-path="codes"] .dashboard-group__list-count',
					},
				},
				emailsTab: {
					selector: '.dashboard-group__list[data-list-path="emails"]',
					elements: {
						label: '.dashboard-group__list[data-list-path="emails"] .dashboard-group__list-label',
						plusIconLink: '.dashboard-group__list[data-list-path="emails"] a.dashboard-group__list-create.octicon.octicon-plus',
						itemCount: '.dashboard-group__list[data-list-path="emails"] .dashboard-group__list-count',
					},
				},
				namesTab: {
					selector: '.dashboard-group__list[data-list-path="names"]',
					elements: {
						label: '.dashboard-group__list[data-list-path="names"] .dashboard-group__list-label',
						plusIconLink: '.dashboard-group__list[data-list-path="names"] a.dashboard-group__list-create.octicon.octicon-plus',
						itemCount: '.dashboard-group__list[data-list-path="names"] .dashboard-group__list-count',
					},
				},
				numbersTab: {
					selector: '.dashboard-group__list[data-list-path="numbers"]',
					elements: {
						label: '.dashboard-group__list[data-list-path="numbers"] .dashboard-group__list-label',
						plusIconLink: '.dashboard-group__list[data-list-path="numbers"] a.dashboard-group__list-create.octicon.octicon-plus',
						itemCount: '.dashboard-group__list[data-list-path="numbers"] .dashboard-group__list-count',
					},
				},
				selectsTab: {
					selector: '.dashboard-group__list[data-list-path="selects"]',
					elements: {
						label: '.dashboard-group__list[data-list-path="selects"] .dashboard-group__list-label',
						plusIconLink: '.dashboard-group__list[data-list-path="selects"] a.dashboard-group__list-create.octicon.octicon-plus',
						itemCount: '.dashboard-group__list[data-list-path="selects"] .dashboard-group__list-count',
					},
				},
			},
		},
		otherGroup: {
			selector: '.dashboard-group:nth-child(3)',
			elements: {
				subheading: '.dashboard-group__heading[data-section-label="Other"]',
			},
			sections: {
				otherListsTab: {
					selector: '.dashboard-group__list[data-list-path="other-lists"]',
					elements: {
						label: '.dashboard-group__list[data-list-path="other-lists"] .dashboard-group__list-label',
						plusIconLink: '.dashboard-group__list[data-list-path="other-lists"] a.dashboard-group__list-create.octicon.octicon-plus',
						itemCount: '.dashboard-group__list[data-list-path="other-lists"] .dashboard-group__list-count',
					},
				},
			},
		},
	},
}

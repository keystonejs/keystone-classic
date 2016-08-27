var dashboardGroup = require('./dashboardGroup');

var accessdashboardGroup = dashboardGroup({
	groupName: 'Access',
	tabs: [
		{name: 'users', items: '2 Items'},
	],
});

var fieldsdashboardGroup = dashboardGroup({
	groupName: 'Fields',
	tabs: [
		{name: 'booleans', items: '0 Items'},
		{name: 'codes', items: '0 Items'},
		{name: 'emails', items: '0 Items'},
		{name: 'names', items: '0 Items'},
		{name: 'numbers', items: '0 Items'},
		{name: 'selects', items: '0 Items'},
	],
});

var otherdashboardGroup = dashboardGroup({
	groupName: 'Other',
	tabs: [
		{name: 'other-lists', items: '0 Items'},
	],
});

module.exports = {
	elements: {
		dashboardHeader: '.dashboard-heading',
	},
	sections: {
		accessGroup: accessdashboardGroup,
		fieldsGroup: fieldsdashboardGroup,
		otherGroup: otherdashboardGroup,
	},
};

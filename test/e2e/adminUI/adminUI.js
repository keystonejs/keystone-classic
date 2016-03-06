module.exports = {
	url: 'http://localhost:3000/keystone/',
	login: {
		email: 'test@test.e2e',
		password: 'test',
	},
	cssSelector: {
		allView: {
			homeIconLink: '.octicon-home',
			accessMenu: 'ul.app-nav:nth-child(2) > li:nth-child(2) > a:nth-child(1)',
			fieldsMenu: 'ul.app-nav:nth-child(2) > li:nth-child(3) > a:nth-child(1)',
			frontPageIconLink: '.octicon-globe',
			logoutIconLink: '.octicon-sign-out',
		},
		signinView: {
			id: '#signin-view',
			emailInput: 'input[name=email]',
			passwordInput: 'input[name=password]',
			submitButton: 'button[type=submit]',
		},
		homeView: {
			id: '#home-view',

			dashboardHeader: '.dashboard-heading',

			// Dashboard's Access Group
			dashboardAccessSubheading: 'div.dashboard-group:nth-child(1) > div:nth-child(1) > span:nth-child(2)',
			usersTabUnderDashboardAccessSubheading: 'div.dashboard-group:nth-child(1) > div:nth-child(2) > div:nth-child(1) > span:nth-child(1) > a:nth-child(1) > div:nth-child(1)',
			plusIconLinkForUsersTabUnderDashboardAccessSubheading: 'div.dashboard-group:nth-child(1) > div:nth-child(2) > div:nth-child(1) > span:nth-child(1) > a:nth-child(2)',
			itemCountForUsersTabUnderDashboardAccessSubheading: 'div.dashboard-group:nth-child(1) > div:nth-child(2) > div:nth-child(1) > span:nth-child(1) > a:nth-child(1) > div:nth-child(2)',

			// Dashboard's Fields Group
			dashboardFieldsSubheading: 'div.dashboard-group:nth-child(2) > div:nth-child(1) > span:nth-child(2)',
			nameFieldsTabUnderDashboardFieldsSubheading: 'div.dashboard-group:nth-child(2) > div:nth-child(2) > div:nth-child(1) > span:nth-child(1) > a:nth-child(1) > div:nth-child(1)',
			plusIconLinkForNameFieldsTabUnderDashboardFieldsSubheading: 'div.dashboard-group:nth-child(2) > div:nth-child(2) > div:nth-child(1) > span:nth-child(1) > a:nth-child(2)',
			itemCountForNameFieldsTabUnderDashboardFieldsSubheading: 'div.dashboard-group:nth-child(2) > div:nth-child(2) > div:nth-child(1) > span:nth-child(1) > a:nth-child(1) > div:nth-child(2)',

			// Dashboard's Others Group
			dashboardOthersSubheading: 'div.dashboard-group:nth-child(3) > div:nth-child(1) > span:nth-child(2)',
			otherListsTabUnderDashboardOthersSubheading: 'div.dashboard-group:nth-child(3) > div:nth-child(2) > div:nth-child(1) > span:nth-child(1) > a:nth-child(1) > div:nth-child(1)',
			plusIconLinkForOtherListsTabUnderDashboardOthersSubheading: 'div.dashboard-group:nth-child(3) > div:nth-child(2) > div:nth-child(1) > span:nth-child(1) > a:nth-child(2)',
			itemCountForOtherListsTabUnderDashboardOthersSubheading: 'div.dashboard-group:nth-child(3) > div:nth-child(2) > div:nth-child(1) > span:nth-child(1) > a:nth-child(1) > div:nth-child(2)',
		},
		listView: {
			id: '#list-view',
			noItemsFoundNoText: '.BlankState__heading > span:nth-child(1)',
			noItemsFoundListNameText: '.BlankState__heading > span:nth-child(2)',
			noItemsFoundFoundText: '.BlankState__heading > span:nth-child(3)',
			singleItemDeleteIcon: '.ItemList__control',
			searchInputField: '.FormInput',
			searchInputFieldClearIcon: '.ListHeader__search__icon',
			filterDropdown: '#listHeaderFilterButton',
			columnDropdown: '#listHeaderColumnButton',
			downloadDropdown: '#listHeaderDownloadButton',
			expandTableIcon: 'div.InputGroup_section:nth-child(5) > button:nth-child(1)',
			createItemIconWhenListHasExistingItems: '.Button--success',
			createItemIconWhenListHasNoExistingItems: '.Button',
			paginationCount: '.Pagination__count',

			// User List Column Headers
			nameColumnHeaderForUserList: '.Table > thead:nth-child(2) > tr:nth-child(1) > th:nth-child(1)',
			emailColumnHeaderForUserList: '.Table > thead:nth-child(2) > tr:nth-child(1) > th:nth-child(2)',
			isAdminColumnHeaderForUserList: '.Table > thead:nth-child(2) > tr:nth-child(1) > th:nth-child(3)',

			// Single Item User List Values
			nameColumnValueForUserList: '.ItemList__value--name',
			emailColumnValueForUserList: '.ItemList__value--email',
			isAdminColumnValueForUserList: '.octicon-check',

			// Name Field List Column Headers
			nameColumnHeaderForNameFieldsList: '.Table > thead:nth-child(2) > tr:nth-child(1) > th:nth-child(1)',

			// Single Item Name Field List Values
			nameColumnValueForNameFieldItemWhenListHasSingleItem: 'a.ItemList__value',

			// Multi Item Name Field List Values
			nameColumnValueForFirstNameFieldItemWhenListHasMultipleItems: '.Table > tbody:nth-child(3) > tr:nth-child(1) > td:nth-child(2) > a:nth-child(1)',
			nameColumnValueForSecondNameFieldItemWhenListHasMultipleItems: '.Table > tbody:nth-child(3) > tr:nth-child(2) > td:nth-child(2) > a:nth-child(1)',

			// Single Item List Delete Icon
			deleteItemIconWhenListHasSingleItem: '.ItemList__control',

			// Multi Item List Delete Icon
			deleteFirstItemIconWhenListHasMultipleItems: '.Table > tbody:nth-child(3) > tr:nth-child(1) > td:nth-child(1) > button:nth-child(1)',
			deleteSecondItemIconWhenListHasMultipleItems: '.Table > tbody:nth-child(3) > tr:nth-child(2) > td:nth-child(1) > button:nth-child(1)',
		},
		itemView: {
			id: '#item-view',
			listBreadcrumb: 'a.Button',
		},
		initialModalView: {
			id: '.Modal-content',
			buttonCreate: '.Modal__footer > button:nth-child(1)',
			field: {
				name: {
					label: '.FormLabel',
					first: '.is-open .Modal-content input[name="name.first"]',
					firstPlaceholder: '.is-open .Modal-content input[name="name.first"],input[placeholder="First name"]',
					last: '.is-open .Modal-content input[name="name.last"]',
					lastPlaceholder: '.is-open .Modal-content input[name="name.first"],input[placeholder="Last name"]',
				},
			},
		},
		deleteConfirmationModalView: {
			id: '.Modal-content',
			buttonDelete: '.Button--danger',
		},
	},
};

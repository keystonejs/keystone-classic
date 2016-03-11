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
			plusIconLinkForNamesTabUnderDashboardFieldsSubheading: 'div.dashboard-group:nth-child(2) > div:nth-child(2) > div:nth-child(1) > span:nth-child(1) > a:nth-child(2)',
			itemCountForNamesTabUnderDashboardFieldsSubheading: 'div.dashboard-group:nth-child(2) > div:nth-child(2) > div:nth-child(1) > span:nth-child(1) > a:nth-child(1) > div:nth-child(2)',

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
			searchInputField: '.ListHeader__searchbar-input',
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
			nameColumnHeaderForNamesList: '.Table > thead:nth-child(2) > tr:nth-child(1) > th:nth-child(1)',

			// Single Item Name Field List Values
			nameColumnValueForNameItemWhenListHasSingleItem: 'a.ItemList__value',

			// Multi Item Name Field List Values
			nameColumnValueForFirstNameItemWhenListHasMultipleItems: '.Table > tbody:nth-child(3) > tr:nth-child(1) > td:nth-child(2) > a:nth-child(1)',
			nameColumnValueForSecondNameItemWhenListHasMultipleItems: '.Table > tbody:nth-child(3) > tr:nth-child(2) > td:nth-child(2) > a:nth-child(1)',

			// Single Item List Delete Icon
			deleteItemIconWhenListHasSingleItem: '.ItemList__control',

			// Multi Item List Delete Icon
			deleteFirstItemIconWhenListHasMultipleItems: '.Table > tbody:nth-child(3) > tr:nth-child(1) > td:nth-child(1) > button:nth-child(1)',
			deleteSecondItemIconWhenListHasMultipleItems: '.Table > tbody:nth-child(3) > tr:nth-child(2) > td:nth-child(1) > button:nth-child(1)',
		},
		itemView: {
			id: '#item-view',
			listBreadcrumb: 'a.Button',
			breadcrumpForUsersList: 'a.Button > span:nth-child(2)',
			searchInputIcon: '.EditForm__header__search-input',
			newItemPlusButton: '.Button--success',
			itemNameHeader: '.EditForm__name-field > h2:nth-child(1)',
			itemId: '.EditForm__key-or-id',
			itemIdValue: 'EditForm__key-or-id > .EditForm__key-or-id__field',
			itemMetaHeader: '.EditForm__meta .form-heading',
			itemMetaCreatedOn: '.EditForm__meta > div:nth-child(2)',
			itemSaveButton: '.EditForm__footer .Button--primary',
			itemResetButton: '.EditForm__footer button.Button:nth-child(2)',
			itemResetButtonText: '.EditForm__footer button.Button:nth-child(2) > span:nth-child(1)',
			itemDeleteButton: '.EditForm__footer button.Button:nth-child(3)',
			itemDeleteButtonText: '.EditForm__footer button.Button:nth-child(3) > span:nth-child(1)',
			flashMessage: '.Alert > span:nth-child(1)',

			// NEED TO DUPLICATE AND KEEP IN SYNC THE FIELD IN initialModalView
			// TODO: is there a way to give precedence to the initial modal view fields?  The field DOM shows in both
			// the Initial Modal View and the Edit Item View but so far I cannot find a way to give precedence to the
			// Initial Modal View when it is opened.  And thus the duplication of fields both here and in the
			// initialModalView.
			field: {
				email: {
					label: '.EditForm-container .field-type-email .FormLabel',
					value: '.EditForm-container .field-type-email input[name="email"]',
				},
				name: {
					label: '.EditForm-container .field-type-name[for="name"] .FormLabel',
					first: '.EditForm-container .field-type-name[for="name"] input[name="name.first"]',
					firstPlaceholder: '.EditForm-container .field-type-name[for="name"] input[placeholder="First name"]',
					last: '.EditForm-container .field-type-name[for="name"] input[name="name.last"]',
					lastPlaceholder: '.EditForm-container .field-type-name[for="name"] input[placeholder="Last name"]',

					fieldLabel: '.EditForm-container .field-type-name[for="field"] .FormLabel',
					fieldFirst: '.EditForm-container .field-type-name[for="field"] input[name="field.first"]',
					fieldFirstPlaceholder: '.EditForm-container .field-type-name[for="field"] input[placeholder="First name"]',
					fieldLast: '.EditForm-container .field-type-name[for="field"] input[name="field.last"]',
					fieldLastPlaceholder: '.EditForm-container .field-type-name[for="field"] input[placeholder="Last name"]',

					// edit form
					itemHeader: '.EditForm__name-field > h2:nth-child(1)',
				},
				password: {
					label: '.EditForm-container .field-type-password .FormLabel',
					value: '.EditForm-container .field-type-password input[name="password"]',
					value_confirm: '.EditForm-container .field-type-password input[name="password_confirm"]',
				},
			},
		},
		initialModalView: {
			id: '.Modal-content',
			buttonCreate: '.Modal__footer > button:nth-child(1)',
			// NEED TO DUPLICATE AND KEEP IN SYNC THE FIELD IN itemView
			// TODO: is there a way to give precedence to the initial modal view fields?  The field DOM shows in both
			// the Initial Modal View and the Edit Item View but so far I cannot find a way to give precedence to the
			// Initial Modal View when it is opened.  And thus the duplication of fields both here and in the
			// itemView.
			field: {
				email: {
					label: '.Modal-dialog .field-type-email .FormLabel',
					value: '.Modal-dialog .field-type-email input[name="email"]',
				},
				name: {
					label: '.Modal-dialog .field-type-name .FormLabel',
					first: '.Modal-dialog .field-type-name input[name="name.first"]',
					firstPlaceholder: '.Modal-dialog .field-type-name input[placeholder="First name"]',
					last: '.Modal-dialog .field-type-name input[name="name.last"]',
					lastPlaceholder: '.Modal-dialog .field-type-name input[placeholder="Last name"]',
				},
				password: {
					label: '.Modal-dialog .field-type-password .FormLabel',
					value: '.Modal-dialog .field-type-password input[name="password"]',
					value_confirm: '.Modal-dialog .field-type-password input[name="password_confirm"]',
				},
			},
		},
		deleteConfirmationModalView: {
			id: '.Modal-content',
			buttonDelete: '.Button--danger',
		},
		resetConfirmationModalView: {
			id: '.Modal-content',
			buttonDelete: '.Button--danger',
		},
	},
};

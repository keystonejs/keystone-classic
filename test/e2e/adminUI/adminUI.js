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
			// Booleans List Tab
			booleansTabUnderDashboardFieldsSubheading: 'div.dashboard-group:nth-child(2) > div:nth-child(2) > div:nth-child(3) > span:nth-child(1) > a:nth-child(1) > div:nth-child(1)',
			plusIconLinkForBooleansTabUnderDashboardFieldsSubheading: 'div.dashboard-group:nth-child(2) > div:nth-child(2) > div:nth-child(3) > span:nth-child(1) > a:nth-child(2)',
			itemCountForBooleansTabUnderDashboardFieldsSubheading: 'div.dashboard-group:nth-child(2) > div:nth-child(2) > div:nth-child(3) > span:nth-child(1) > a:nth-child(1) > div:nth-child(2)',
			// Names List Tab
			namesTabUnderDashboardFieldsSubheading: 'div.dashboard-group:nth-child(2) > div:nth-child(2) > div:nth-child(1) > span:nth-child(1) > a:nth-child(1) > div:nth-child(1)',
			plusIconLinkForNamesTabUnderDashboardFieldsSubheading: 'div.dashboard-group:nth-child(2) > div:nth-child(2) > div:nth-child(1) > span:nth-child(1) > a:nth-child(2)',
			itemCountForNamesTabUnderDashboardFieldsSubheading: 'div.dashboard-group:nth-child(2) > div:nth-child(2) > div:nth-child(1) > span:nth-child(1) > a:nth-child(1) > div:nth-child(2)',
			// Selects List Tab
			selectsTabUnderDashboardFieldsSubheading: 'div.dashboard-group__list:nth-child(2) > span:nth-child(1) > a:nth-child(1) > div:nth-child(1)',
			plusIconLinkForSelectsTabUnderDashboardFieldsSubheading: 'div.dashboard-group__list:nth-child(2) > span:nth-child(1) > a:nth-child(2)',
			itemCountForSelectsTabUnderDashboardFieldsSubheading: 'div.dashboard-group__list:nth-child(2) > span:nth-child(1) > a:nth-child(1) > div:nth-child(2)',

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
			nameColumnHeaderForUserList: '.Table > thead:nth-child(2) > tr:nth-child(1) > th:nth-child(2)',
			emailColumnHeaderForUserList: '.Table > thead:nth-child(2) > tr:nth-child(1) > th:nth-child(3)',
			isAdminColumnHeaderForUserList: '.Table > thead:nth-child(2) > tr:nth-child(1) > th:nth-child(4)',

			// Single Item User List Values
			nameColumnValueForUserList: '.ItemList__value--name',
			emailColumnValueForUserList: '.ItemList__value--email',
			isAdminColumnValueForUserList: '.octicon-check',

			// Name Field List Column Headers
			nameColumnHeaderForNamesList: '.Table > thead:nth-child(2) > tr:nth-child(1) > th:nth-child(4)',

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
			itemHeader: '.EditForm__name-field > h2:nth-child(1)',

			// The structure of the following fieldType JSON is as follows:
			// 	fieldType: {
			//		<field-type>: {
			//			<list-used-in>: {
			//				<field-name-within-list>: {
			//					<field-path>:
			//					...
			//This allows for the flexibility of including a field type in any list and in as many fields of that list!
			fieldType: {
				bool: {
					bool: {
						name: {
							value: '.EditForm-container .field-type-text input[name="name"]'
						},
						testA: {
							button: '.EditForm-container .field-type-boolean button',
							label: '.EditForm-container .field-type-boolean span',
							value: '.EditForm-container .field-type-boolean input[name="testA"]'
						}
					}
				},
				email: {
					user: {
						email: {
							label: '.EditForm-container .field-type-email[for="email"] .FormLabel',
							value: '.EditForm-container .field-type-email[for="email"] input[name="email"]',
						},
					},
				},
				name: {
					user: {
						name: {
							label: '.EditForm-container .field-type-name[for="name"] .FormLabel',
							first: '.EditForm-container .field-type-name[for="name"] input[name="name.first"]',
							firstPlaceholder: '.EditForm-container .field-type-name[for="name"] input[placeholder="First name"]',
							last: '.EditForm-container .field-type-name[for="name"] input[name="name.last"]',
							lastPlaceholder: '.EditForm-container .field-type-name[for="name"] input[placeholder="Last name"]',
						},
					},
					name: {
						name: {
							label: '.EditForm-container .field-type-name[for="name"] .FormLabel',
							first: '.EditForm-container .field-type-name[for="name"] input[name="name.first"]',
							firstPlaceholder: '.EditForm-container .field-type-name[for="name"] input[placeholder="First name"]',
							last: '.EditForm-container .field-type-name[for="name"] input[name="name.last"]',
							lastPlaceholder: '.EditForm-container .field-type-name[for="name"] input[placeholder="Last name"]',
						},
						testA: {
							label: '.EditForm-container .field-type-name[for="testA"] .FormLabel',
							first: '.EditForm-container .field-type-name[for="testA"] input[name="testA.first"]',
							firstPlaceholder: '.EditForm-container .field-type-name[for="testA"] input[placeholder="First name"]',
							last: '.EditForm-container .field-type-name[for="testA"] input[name="testA.last"]',
							lastPlaceholder: '.EditForm-container .field-type-name[for="testA"] input[placeholder="Last name"]',
						},
					},
				},
				password: {
					user: {
						password: {
							label: '.EditForm-container .field-type-password[for="password"] .FormLabel',
							value: '.EditForm-container .field-type-password[for="password"] input[name="password"]',
							value_confirm: '.EditForm-container .field-type-password[for="password"] input[name="password_confirm"]',
						},
					},
				},
				select: {
					select: {
						name: {
							label: '.EditForm-container .field-type-select[for="name"] .FormLabel',
							inputField: '.EditForm-container .field-type-select[for="name"] .Select',
							inputValue: '.EditForm-container .field-type-select[for="name"] .Select-value-label',
							placeholder: '.EditForm-container .field-type-name[for="name"] .Select-placeholder',
							dropdownArrow: '.EditForm-container .field-type-name[for="name"] .Select-arrow',
							options: '.EditForm-container .field-type-name[for="name"] .Select-menu-outer',
						},
						testA: {
							label: '.EditForm-container .field-type-select[for="testA"] .FormLabel',
							inputField: '.EditForm-container .field-type-select[for="testA"] .Select',
							inputValue: '.EditForm-container .field-type-select[for="testA"] .Select-value-label',
							placeholder: '.EditForm-container .field-type-name[for="testA"] .Select-placeholder',
							dropdownArrow: '.EditForm-container .field-type-name[for="testA"] .Select-arrow',
							options: '.EditForm-container .field-type-name[for="testA"] .Select-menu-outer',
						},
					},
				},
			},
		},
		initialModalView: {
			id: '.Modal-content',
			buttonCreate: '.Modal__footer > button:nth-child(1)',

			// The structure of the following fieldType JSON is as follows:
			// 	fieldType: {
			//		<field-type>: {
			//			<list-used-in>: {
			//				<field-name-within-list>: {
			//					<field-path>:
			//					...
			//This allows for the flexibility of including a field type in any list and in as many fields of that list!
			fieldType: {
				bool: {
					bool: {
						name: {
							label: '.Modal-dialog .field-type-text[for="name"] .FormLabel',
							value: '.Modal-dialog .field-type-text[for="name"] input[name="name"]'
						},
						testA: {
							button: '.Modal-dialog .field-type-boolean button',
							label: '.Modal-dialog .field-type-boolean span',
							value: '.Modal-dialog .field-type-boolean input[name="testA"]'
						}
					}
				},
				email: {
					user: {
						email: {
							label: '.Modal-dialog .field-type-email[for="name"] .FormLabel',
							value: '.Modal-dialog .field-type-email[for="email"] input[name="email"]',
						},
					},
				},
				name: {
					name: {
						name: {
							label: '.Modal-dialog .field-type-name[for="name"] .FormLabel',
							first: '.Modal-dialog .field-type-name[for="name"] input[name="name.first"]',
							firstPlaceholder: '.Modal-dialog .field-type-name[for="name"] input[placeholder="First name"]',
							last: '.Modal-dialog .field-type-name[for="name"] input[name="name.last"]',
							lastPlaceholder: '.Modal-dialog .field-type-name[for="name"] input[placeholder="Last name"]',
						},
					},
					user: {
						name: {
							label: '.Modal-dialog .field-type-name[for="name"] .FormLabel',
							first: '.Modal-dialog .field-type-name[for="name"] input[name="name.first"]',
							firstPlaceholder: '.Modal-dialog .field-type-name[for="name"] input[placeholder="First name"]',
							last: '.Modal-dialog .field-type-name[for="name"] input[name="name.last"]',
							lastPlaceholder: '.Modal-dialog .field-type-name[for="name"] input[placeholder="Last name"]',
						},
					},
				},
				password: {
					user: {
						password: {
							label: '.Modal-dialog .field-type-password[for="password"] .FormLabel',
							value: '.Modal-dialog .field-type-password[for="password"] input[name="password"]',
							value_confirm: '.Modal-dialog .field-type-password[for="password"] input[name="password_confirm"]',
						},
					},
				},
				select: {
					select: {
						name: {
							label: '.Modal-dialog .field-type-select[for="name"] .FormLabel',
							inputField: '.Modal-dialog .field-type-select[for="name"] .Select',
							inputValue: '.Modal-dialog .field-type-select[for="name"] .Select-value-label',
							placeholder: '.Modal-dialog .field-type-name[for="name"] .Select-placeholder',
							dropdownArrow: '.Modal-dialog .field-type-name[for="name"] .Select-arrow-zone',
							optionOne: '.Modal-dialog .field-type-name[for="name"] .Select-menu-outer option[value="One"]',
						},
					},
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

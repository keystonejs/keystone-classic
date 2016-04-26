module.exports = {
	url: 'http://localhost:3000/keystone/',
	login: {
		email: 'test@test.e2e',
		password: 'test',
	},
	cssSelector: {
		allView: {
			homeIcon: '.primary-navbar [data-section-label="octicon-home"]',
			homeIconLink: '.primary-navbar [data-section-label="octicon-home"] a',
			accessMenu: '.primary-navbar [data-section-label="Access"]',
			fieldsMenu: '.primary-navbar [data-section-label="Fields"]',
			booleanFieldsSubmenu: '.secondary-navbar [data-list-path="booleans"]',
			emailsFieldsSubmenu: '.secondary-navbar [data-list-path="emails"]',
			namesFieldsSubmenu: '.secondary-navbar [data-list-path="names"]',
			selectsFieldsSubmenu: '.secondary-navbar [data-list-path="selects"]',
			frontPageIcon: '.primary-navbar [data-section-label="octicon-globe"]',
			frontPageIconLink: '.primary-navbar [data-section-label="octicon-globe"] a',
			logoutIcon: '.primary-navbar [data-section-label="octicon-sign-out"]',
			logoutIconLink: '.primary-navbar [data-section-label="octicon-sign-out"] a',
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
			dashboardAccessSubheading: '.dashboard-group__heading[data-section-label="Access"]',
			// Users List Tab
			usersTabUnderDashboardAccessSubheading: '.dashboard-group__list[data-list-path="users"]',
			labelForUsersTabUnderDashboardAccessSubheading: '.dashboard-group__list[data-list-path="users"] .dashboard-group__list-label',
			plusIconLinkForUsersTabUnderDashboardAccessSubheading: '.dashboard-group__list[data-list-path="users"] a.dashboard-group__list-create.octicon.octicon-plus',
			itemCountForUsersTabUnderDashboardAccessSubheading: '.dashboard-group__list[data-list-path="users"] .dashboard-group__list-count',

			// Dashboard's Fields Group
			dashboardFieldsSubheading: '.dashboard-group__heading[data-section-label="Fields"]',
			// Booleans List Tab
			booleansTabUnderDashboardFieldsSubheading: '.dashboard-group__list[data-list-path="booleans"]',
			labelForBooleansTabUnderDashboardFieldsSubheading: '.dashboard-group__list[data-list-path="booleans"] .dashboard-group__list-label',
			plusIconLinkForBooleansTabUnderDashboardFieldsSubheading: '.dashboard-group__list[data-list-path="booleans"] a.dashboard-group__list-create.octicon.octicon-plus',
			itemCountForBooleansTabUnderDashboardFieldsSubheading: '.dashboard-group__list[data-list-path="booleans"] .dashboard-group__list-count',
			// Code List Tab
			codesTabUnderDashboardFieldsSubheading: '.dashboard-group__list[data-list-path="codes"]',
			labelForCodesTabUnderDashboardFieldsSubheading: '.dashboard-group__list[data-list-path="codes"] .dashboard-group__list-label',
			plusIconLinkForCodesTabUnderDashboardFieldsSubheading: '.dashboard-group__list[data-list-path="codes"] a.dashboard-group__list-create.octicon.octicon-plus',
			itemCountForCodesTabUnderDashboardFieldsSubheading: '.dashboard-group__list[data-list-path="codes"] .dashboard-group__list-count',
			// Email List Tab
			emailsTabUnderDashboardFieldsSubheading: '.dashboard-group__list[data-list-path="emails"]',
			labelForEmailsTabUnderDashboardFieldsSubheading: '.dashboard-group__list[data-list-path="emails"] .dashboard-group__list-label',
			plusIconLinkForEmailsTabUnderDashboardFieldsSubheading: '.dashboard-group__list[data-list-path="emails"] a.dashboard-group__list-create.octicon.octicon-plus',
			itemCountForEmailsTabUnderDashboardFieldsSubheading: '.dashboard-group__list[data-list-path="emails"] .dashboard-group__list-count',
			// Names List Tab
			namesTabUnderDashboardFieldsSubheading: '.dashboard-group__list[data-list-path="names"]',
			labelForNamesTabUnderDashboardFieldsSubheading: '.dashboard-group__list[data-list-path="names"] .dashboard-group__list-label',
			plusIconLinkForNamesTabUnderDashboardFieldsSubheading: '.dashboard-group__list[data-list-path="names"] a.dashboard-group__list-create.octicon.octicon-plus',
			itemCountForNamesTabUnderDashboardFieldsSubheading: '.dashboard-group__list[data-list-path="names"] .dashboard-group__list-count',
			// Numbers List Tab
			numbersTabUnderDashboardFieldsSubheading: '.dashboard-group__list[data-list-path="numbers"]',
			labelForNumbersTabUnderDashboardFieldsSubheading: '.dashboard-group__list[data-list-path="numbers"] .dashboard-group__list-label',
			plusIconLinkForNumbersTabUnderDashboardFieldsSubheading: '.dashboard-group__list[data-list-path="numbers"] a.dashboard-group__list-create.octicon.octicon-plus',
			itemCountForNumbersTabUnderDashboardFieldsSubheading: '.dashboard-group__list[data-list-path="numbers"] .dashboard-group__list-count',
			// Selects List Tab
			selectsTabUnderDashboardFieldsSubheading: '.dashboard-group__list[data-list-path="selects"]',
			labelForSelectsTabUnderDashboardFieldsSubheading: '.dashboard-group__list[data-list-path="selects"] .dashboard-group__list-label',
			plusIconLinkForSelectsTabUnderDashboardFieldsSubheading: '.dashboard-group__list[data-list-path="selects"] a.dashboard-group__list-create.octicon.octicon-plus',
			itemCountForSelectsTabUnderDashboardFieldsSubheading: '.dashboard-group__list[data-list-path="selects"] .dashboard-group__list-count',

			// Dashboard's Others Group
			dashboardOthersSubheading: '.dashboard-group__heading[data-section-label="Other"]',
			// Other Lists Tab
			otherListsTabUnderDashboardOthersSubheading: '.dashboard-group__list[data-list-path="other-lists"]',
			labelForOtherListsTabUnderDashboardOthersSubheading: '.dashboard-group__list[data-list-path="other-lists"] .dashboard-group__list-label',
			plusIconLinkForOtherListsTabUnderDashboardOthersSubheading: '.dashboard-group__list[data-list-path="other-lists"] a.dashboard-group__list-create.octicon.octicon-plus',
			itemCountForOtherListsTabUnderDashboardOthersSubheading: '.dashboard-group__list[data-list-path="other-lists"] .dashboard-group__list-count',
		},
		listView: {
			id: '#list-view',
			noItemsFoundNoText: '.BlankState__heading > span:nth-child(1)',
			noItemsFoundListNameText: '.BlankState__heading > span:nth-child(2)',
			noItemsFoundFoundText: '.BlankState__heading > span:nth-child(3)',
			singleItemDeleteIcon: '.ItemList__control--delete',
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
							label: '.EditForm-container .field-type-text[for="name"] .FormLabel',
							value: '.EditForm-container .field-type-text[for="name"] input[name="name"]',
						},
						fieldA: {
							button: '.EditForm-container .field-type-boolean[for="fieldA"] button',
							label: '.EditForm-container .field-type-boolean[for="fieldA"] span',
							value: '.EditForm-container .field-type-boolean[for="fieldA"] input[name="fieldA"]',
						},
						fieldB: {
							button: '.EditForm-container .field-type-boolean[for="fieldB"] button',
							label: '.EditForm-container .field-type-boolean[for="fieldB"] span',
							value: '.EditForm-container .field-type-boolean[for="fieldB"] input[name="fieldB"]',
						},
					},
				},
				code: {
					code: {
						name: {
							label: '.EditForm-container .field-type-text[for="name"] .FormLabel',
							value: '.EditForm-container .field-type-text[for="name"] input[name="name"]',
						},
						fieldA: {
							label: '.EditForm-container .field-type-code[for="fieldA"] .FormLabel',
							lineNumber: '.EditForm-container .field-type-code[for="fieldA"] .CodeMirror-linenumber',
							codeMirror: '.EditForm-container .field-type-code[for="fieldA"] .CodeMirror-container',
						},
						fieldB: {
							label: '.EditForm-container .field-type-code[for="fieldB"] .FormLabel',
							lineNumber: '.EditForm-container .field-type-code[for="fieldB"] .CodeMirror-linenumber',
							codeMirror: '.EditForm-container .field-type-code[for="fieldB"] .CodeMirror-container',
						},
					},
				},
				email: {
					user: {
						email: {
							label: '.EditForm-container .field-type-email[for="email"] .FormLabel',
							value: '.EditForm-container .field-type-email[for="email"] input[name="email"]',
						},
					},
					email: {
						name: {
							label: '.EditForm-container .field-type-text[for="name"] .FormLabel',
							value: '.EditForm-container .field-type-text[for="name"] input[name="name"]',
						},
						fieldA: {
							label: '.EditForm-container .field-type-email[for="fieldA"] .FormLabel',
							value: '.EditForm-container .field-type-email[for="fieldA"] input[name="fieldA"]',
						},
						fieldB: {
							label: '.EditForm-container .field-type-email[for="fieldB"] .FormLabel',
							value: '.EditForm-container .field-type-email[for="fieldB"] input[name="fieldB"]',
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
							label: '.EditForm-container .field-type-text[for="name"] .FormLabel',
							value: '.EditForm-container .field-type-text[for="name"] input[name="name"]',
						},
						fieldA: {
							label: '.EditForm-container .field-type-name[for="fieldA"] .FormLabel',
							first: '.EditForm-container .field-type-name[for="fieldA"] input[name="fieldA.first"]',
							firstPlaceholder: '.EditForm-container .field-type-name[for="fieldA"] input[placeholder="First name"]',
							last: '.EditForm-container .field-type-name[for="fieldA"] input[name="fieldA.last"]',
							lastPlaceholder: '.EditForm-container .field-type-name[for="fieldA"] input[placeholder="Last name"]',
						},
						fieldB: {
							label: '.EditForm-container .field-type-name[for="fieldB"] .FormLabel',
							first: '.EditForm-container .field-type-name[for="fieldB"] input[name="fieldB.first"]',
							firstPlaceholder: '.EditForm-container .field-type-name[for="fieldB"] input[placeholder="First name"]',
							last: '.EditForm-container .field-type-name[for="fieldB"] input[name="fieldB.last"]',
							lastPlaceholder: '.EditForm-container .field-type-name[for="fieldB"] input[placeholder="Last name"]',
						},
					},
				},
				number: {
					number: {
						name: {
							label: '.EditForm-container .field-type-text[for="name"] .FormLabel',
							value: '.EditForm-container .field-type-text[for="name"] input[name="name"]',
						},
						fieldA: {
							label: '.EditForm-container .field-type-number[for="fieldA"] label',
							value: '.EditForm-container .field-type-number[for="fieldA"] input[name="fieldA"]',
						},
						fieldB: {
							label: '.EditForm-container .field-type-number[for="fieldB"] label',
							value: '.EditForm-container .field-type-number[for="fieldB"] input[name="fieldB"]',
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
					password: {
						name: {
							label: '.EditForm-container .field-type-text[for="name"] .FormLabel',
							value: '.EditForm-container .field-type-text[for="name"] input[name="name"]',
						},
					},
				},
				select: {
					select: {
						name: {
							label: '.EditForm-container .field-type-text[for="name"] .FormLabel',
							value: '.EditForm-container .field-type-text[for="name"] input[name="name"]',
						},
						fieldA: {
							label: '.EditForm-container .field-type-select[for="fieldA"] .FormLabel',
							inputField: '.EditForm-container .field-type-select[for="fieldA"] .Select',
							inputValue: '.EditForm-container .field-type-select[for="fieldA"] .Select-value-label',
							placeholder: '.EditForm-container .field-type-name[for="fieldA"] .Select-placeholder',
							dropdownArrow: '.EditForm-container .field-type-name[for="fieldA"] .Select-arrow',
							options: '.EditForm-container .field-type-name[for="fieldA"] .Select-menu-outer',
						},
						fieldB: {
							label: '.EditForm-container .field-type-select[for="fieldB"] .FormLabel',
							inputField: '.EditForm-container .field-type-select[for="fieldB"] .Select',
							inputValue: '.EditForm-container .field-type-select[for="fieldB"] .Select-value-label',
							placeholder: '.EditForm-container .field-type-name[for="fieldB"] .Select-placeholder',
							dropdownArrow: '.EditForm-container .field-type-name[for="fieldB"] .Select-arrow',
							options: '.EditForm-container .field-type-name[for="fieldB"] .Select-menu-outer',
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
							value: '.Modal-dialog .field-type-text[for="name"] input[name="name"]',
						},
						fieldA: {
							button: '.Modal-dialog .field-type-boolean[for="fieldA"] button',
							label: '.Modal-dialog .field-type-boolean[for="fieldA"] span',
							value: '.Modal-dialog .field-type-boolean[for="fieldA"] input[name="fieldA"]',
						},
					},
				},
				code: {
					code: {
						name: {
							label: '.Modal-dialog .field-type-text[for="name"] .FormLabel',
							value: '.Modal-dialog .field-type-text[for="name"] input[name="name"]',
						},
						fieldA: {
							label: '.Modal-dialog .field-type-code[for="fieldA"] .FormLabel',
							lineNumber: '.Modal-dialog .field-type-code[for="fieldA"] .CodeMirror-linenumber',
							codeMirror: '.Modal-dialog .field-type-code[for="fieldA"] .CodeMirror-container',
						},
					},
				},
				email: {
					user: {
						email: {
							label: '.Modal-dialog .field-type-email[for="name"] .FormLabel',
							value: '.Modal-dialog .field-type-email[for="email"] input[name="email"]',
						},
					},
					email: {
						name: {
							label: '.Modal-dialog .field-type-text[for="name"] .FormLabel',
							value: '.Modal-dialog .field-type-text[for="name"] input[name="name"]',
						},
						fieldA: {
							label: '.Modal-dialog .field-type-email[for="fieldA"] .FormLabel',
							value: '.Modal-dialog .field-type-email[for="fieldA"] input[name="fieldA"]',
						},
					},
				},
				name: {
					name: {
						name: {
							label: '.Modal-dialog .field-type-text[for="name"] .FormLabel',
							value: '.Modal-dialog .field-type-text[for="name"] input[name="name"]',
						},
						fieldA: {
							label: '.Modal-dialog .field-type-name[for="fieldA"] .FormLabel',
							first: '.Modal-dialog .field-type-name[for="fieldA"] input[name="fieldA.first"]',
							firstPlaceholder: '.Modal-dialog .field-type-name[for="fieldA"] input[placeholder="First name"]',
							last: '.Modal-dialog .field-type-name[for="fieldA"] input[name="fieldA.last"]',
							lastPlaceholder: '.Modal-dialog .field-type-name[for="fieldA"] input[placeholder="Last name"]',
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
				number: {
					number: {
						name: {
							label: '.Modal-dialog .field-type-text[for="name"] .FormLabel',
							value: '.Modal-dialog .field-type-text[for="name"] input[name="name"]',
						},
						fieldA: {
							label: '.Modal-dialog .field-type-number[for="fieldA"] label',
							value: '.Modal-dialog .field-type-number[for="fieldA"] input[name="fieldA"]',
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
					password: {
						name: {
							label: '.Modal-dialog .field-type-text[for="name"] .FormLabel',
							value: '.Modal-dialog .field-type-text[for="name"] input[name="name"]',
						},
					},
				},
				select: {
					select: {
						name: {
							label: '.Modal-dialog .field-type-text[for="name"] .FormLabel',
							value: '.Modal-dialog .field-type-text[for="name"] input[name="name"]',
						},
						fieldA: {
							label: '.Modal-dialog .field-type-select[for="fieldA"] .FormLabel',
							inputField: '.Modal-dialog .field-type-select[for="fieldA"] .Select',
							inputValue: '.Modal-dialog .field-type-select[for="fieldA"] .Select-value-label',
							placeholder: '.Modal-dialog .field-type-name[for="fieldA"] .Select-placeholder',
							dropdownArrow: '.Modal-dialog .field-type-name[for="fieldA"] .Select-arrow-zone',
							optionOne: '.Modal-dialog .field-type-name[for="fieldA"] .Select-menu-outer option[value="One"]',
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

module.exports = {
	elements: {
		noItemsFoundNoText:'.BlankState__heading',
		singleItemDeleteIcon: '.ItemList__control--delete',
		firstItemDeleteIcon: {
			locateStrategy: 'xpath',
			selector: '//tbody/tr[1]/td[contains(concat(" ", normalize-space(@class), " "), "ItemList__col--control ItemList__col--delete")][1]',
		},
		secondItemDeleteIcon: {
			locateStrategy: 'xpath',
			selector: '//tbody/tr[2]/td[contains(concat(" ", normalize-space(@class), " "), "ItemList__col--control ItemList__col--delete")][1]',
		},
		itemDeleteIcon: '.Table.ItemList .ItemList__col--control.ItemList__col--delete',
		searchInputField: '[data-search-input-field]',
		searchInputFieldClearIcon: '[data-search-input-field-clear-icon]',
		filterDropdown: '#listHeaderFilterButton',
		columnDropdown: '#listHeaderColumnButton',
		downloadDropdown: '#listHeaderDownloadButton',
		expandTableIcon: 'div.InputGroup_section:nth-child(5) > button:nth-child(1)',
		createFirstItemButton: 'button[data-e2e-list-create-button="no-results"]',
		createMoreItemsButton: 'button[data-e2e-list-create-button="header"]',
		paginationCount: '.Pagination__count',
		firstColumnHeader: {
			locateStrategy: 'xpath',
			selector: '//thead/tr[1]/th[2]/button[contains(@class, "ItemList__sort-button th-sort")]',
		},
		secondColumnHeader: {
			locateStrategy: 'xpath',
			selector: '//thead/tr[1]/th[3]/button[contains(@class, "ItemList__sort-button th-sort")]',
		},
		thirdColumnHeader: {
			locateStrategy: 'xpath',
			selector: '//thead/tr[1]/th[4]/button[contains(@class, "ItemList__sort-button th-sort")]',
		},
		firstItemFirstColumnValue: {
			locateStrategy: 'xpath',
			selector: '//tbody/tr[1]/td[2]',
		},
		firstItemSecondColumnValue: {
			locateStrategy: 'xpath',
			selector: '//tbody/tr[1]/td[3]',
		},
		firstItemThirdColumnValue: {
			locateStrategy: 'xpath',
			selector: '//tbody/tr[1]/td[4]',
		},
		secondItemFirstColumnValue: {
			locateStrategy: 'xpath',
			selector: '//tbody/tr[2]/td[2]',
		},
		secondItemSecondColumnValue: {
			locateStrategy: 'xpath',
			selector: '//tbody/tr[2]/td[3]',
		},
		secondItemThirdColumnValue: {
			locateStrategy: 'xpath',
			selector: '//tbody/tr[2]/td[4]',
		},
		firstUserItemIsNotAdmin: {
			locateStrategy: 'xpath',
			selector: '//tbody/tr[1]/td[4]/div/span[contains(@class, "octicon-x")]',
		},
		firstUserItemIsMember: {
			locateStrategy: 'xpath',
			selector: '//tbody/tr[1]/td[5]/div/span[contains(@class, "octicon-check")]',
		},
		secondUserItemIsAdmin: {
			locateStrategy: 'xpath',
			selector: '//tbody/tr[2]/td[4]/div/span[contains(@class, "octicon-check")]',
		},
		secondUserItemIsNotMember: {
			locateStrategy: 'xpath',
			selector: '//tbody/tr[2]/td[5]/div/span[contains(@class, "octicon-x")]',
		},
		firstItemLink: {
			locateStrategy: 'xpath',
			selector: '//tbody/tr[1]/td[2]/a',
		},
		secondItemLink: {
			locateStrategy: 'xpath',
			selector: '//tbody/tr[2]/td[2]/a',
		},
		thirdItemLink: {
			locateStrategy: 'xpath',
			selector: '//tbody/tr[3]/td[2]/a',
		},
		firstItemNameValue: {
			locateStrategy: 'xpath',
			selector: '//tbody/tr[1]/td/a[contains(@class, "ItemList__value ItemList__value--text")][1]',
		},
		secondItemNameValue: {
			locateStrategy: 'xpath',
			selector: '//tbody/tr[2]/td/a[contains(@class, "ItemList__value ItemList__value--text")][1]',
		},
	},
	commands: [{
		deleteItem: function (selector) {
			return this
				.click(selector);
		},
		createFirstItem: function() {
			return this
				.click('@createFirstItemButton');
		},
		navigateToFirstItem: function() {
			return this
				.click('@firstItemLink');
		}
	}],
};

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
		searchInputField: '.ListHeader__searchbar-input',
		searchInputFieldClearIcon: '.ListHeader__search__icon',
		filterDropdown: '#listHeaderFilterButton',
		columnDropdown: '#listHeaderColumnButton',
		downloadDropdown: '#listHeaderDownloadButton',
		expandTableIcon: 'div.InputGroup_section:nth-child(5) > button:nth-child(1)',
		createFirstItemButton: '.Button',
		createMoreItemsButton: '.Button--success',
		paginationCount: '.Pagination__count',
		firstColumnHeader: {
			locateStrategy: 'xpath',
			selector: '//thead/tr[1]/th[2]/button[contains(concat(" ", normalize-space(@class), " "), "ItemList__sort-button th-sort")]',
		},
		secondColumnHeader: {
			locateStrategy: 'xpath',
			selector: '//thead/tr[1]/th[3]/button[contains(concat(" ", normalize-space(@class), " "), "ItemList__sort-button th-sort")]',
		},
		thirdColumnHeader: {
			locateStrategy: 'xpath',
			selector: '//thead/tr[1]/th[4]/button[contains(concat(" ", normalize-space(@class), " "), "ItemList__sort-button th-sort")]',
		},
		firstColumnValue: {
			locateStrategy: 'xpath',
			selector: '//tbody/tr[1]/td[2]',
		},
		secondColumnValue: {
			locateStrategy: 'xpath',
			selector: '//tbody/tr[1]/td[3]',
		},
		thirdColumnValue: {
			locateStrategy: 'xpath',
			selector: '//tbody/tr[1]/td[4]',
		},
		firstItemNameValue: {
			locateStrategy: 'xpath',
			selector: '//tbody/tr[1]/td/a[contains(concat(" ", normalize-space(@class), " "), "ItemList__value ItemList__value--text")][1]',
		},
		secondItemNameValue: {
			locateStrategy: 'xpath',
			selector: '//tbody/tr[2]/td/a[contains(concat(" ", normalize-space(@class), " "), "ItemList__value ItemList__value--text")][1]',
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
		}
	}],
};

import React from 'react';
var { Button, FormField, FormInput, InputGroup, SegmentedControl } = require('elemental');
import PopoutList from '../../../admin/client/components/PopoutList';

const TOGGLE_OPTIONS = [
	{ label: 'Linked To', value: true },
	{ label: 'NOT Linked To', value: false }
];

const RELATED_ITEMS = [
	{ label: 'Amazon',             value: 'amazon' },
	{ label: 'Arnold',             value: 'arnold' },
	{ label: 'Disrupt',            value: 'disrupt' },
	{ label: 'Ebay',               value: 'ebay' },
	{ label: 'Google',             value: 'google' },
	{ label: 'Jaze',               value: 'jaze' },
	{ label: 'Keystone',           value: 'keystone' },
	{ label: 'Molomby Consulting', value: 'molomby_consulting' },
	{ label: 'Prismatik',          value: 'prismatik' },
	{ label: 'Sweathers',          value: 'sweathers' },
	{ label: 'Team9',              value: 'team9' },
	{ label: 'The Means',          value: 'the_means' },
	{ label: 'Thinkmill',          value: 'thinkmill' },
	{ label: 'Twitter',            value: 'twitter' },
	{ label: 'Yahoo',              value: 'yahoo' },
];

function findElement(arr, propName, propValue) {
	for (var i=0; i < arr.length; i++) {
		if (arr[i][propName] == propValue) {
			return arr[i];
		}
	}
};

var RelationshipFilter = React.createClass({

	getInitialState () {
		return {
			activeItems: [],
			inactiveItems: RELATED_ITEMS,
			inverted: TOGGLE_OPTIONS[0].value,
			searchString: '',
			value: '',
		};
	},

	componentDidMount () {
		this.focusSearch();
	},

	toggleInverted (value) {
		this.setState({
			inverted: value
		});
	},

	focusSearch () {
		React.findDOMNode(this.refs.search).focus();
	},

	updateSearch (e) {
		this.setState({ searchString: e.target.value });
	},

	makeSelectionActive (selectedItem) {
		console.log(selectedItem);
		let { activeItems, inactiveItems } = this.state;
		let newActiveItems = activeItems;
		let newInactiveItems = inactiveItems;

		// remove the item from "inactive items"
		let selectedItemIndex = inactiveItems.indexOf(findElement(inactiveItems, 'value', selectedItem.value));
		if (selectedItemIndex > -1) {
			newInactiveItems.splice(selectedItemIndex, 1);
		}
		// add it to "picked up"
		newActiveItems.push(selectedItem);

		// reset verification to simulate real update
		// and take the user to the correct list
		this.setState({
			activeItems: newActiveItems,
			inactiveItems: newInactiveItems,
		});
	},

	makeSelectionInactive (selectedItem) {
		console.log(selectedItem);
		let { activeItems, inactiveItems } = this.state;
		let newActiveItems = activeItems;
		let newInactiveItems = inactiveItems;

		// remove the item from "inactive items"
		let selectedItemIndex = activeItems.indexOf(findElement(activeItems, 'value', selectedItem.value));
		if (selectedItemIndex > -1) {
			newActiveItems.splice(selectedItemIndex, 1);
		}
		// add it to "picked up"
		newInactiveItems.push(selectedItem);

		// reset verification to simulate real update
		// and take the user to the correct list
		this.setState({
			activeItems: newActiveItems,
			inactiveItems: newInactiveItems,
		});
	},

	renderToggle () {
		return (
			<FormField>
				<SegmentedControl equalWidthSegments options={TOGGLE_OPTIONS} value={this.state.inverted} onChange={this.toggleInverted} />
			</FormField>
		);
	},

	renderList (active) {
		let self = this;
		let { activeItems, inactiveItems, searchString } = this.state;
		let searchRegex = new RegExp(searchString);

		let listItems = active ? activeItems : inactiveItems;
		let itemIconHover = active ? 'x' : 'check';
		function listAction(item) {
			return active ? self.makeSelectionInactive(item) :  self.makeSelectionActive(item);
		};

		function searchFilter (filter) {
			return searchRegex.test(filter.label.toLowerCase());
		};

		let filteredItems = searchString ? listItems.filter(searchFilter) : listItems;

		var popoutList = filteredItems.map((item, i) => {
			return (
				<PopoutList.Item
					key={'item_' + item.value}
					icon="dash"
					iconHover={itemIconHover}
					label={item.label}
					onClick={() => { listAction(item); }} />
			);
		});

		return popoutList;
	},

	renderInactiveItems () {
		if (!this.state.inactiveItems.length) return null;

		return (
			<PopoutList>
				<PopoutList.Heading style={this.state.activeItems.length ? { marginTop: '2em' } : null}>Items</PopoutList.Heading>
				{this.renderList()}
			</PopoutList>
		);
	},

	renderActiveItems () {
		if (!this.state.activeItems.length) return null;

		return (
			<PopoutList>
				<PopoutList.Heading>Selected</PopoutList.Heading>
				{this.renderList(true)}
			</PopoutList>
		);
	},

	render () {
		return (
			<div>
				{this.renderToggle()}
				<FormField style={{ borderBottom: '1px dashed rgba(0,0,0,0.1)', paddingBottom: '1em' }}>
					<FormInput ref="search" value={this.state.searchString} onChange={this.updateSearch} placeholder={'Find a ' + this.props.field.label + '...'} />
				</FormField>
				{this.renderActiveItems()}
				{this.renderInactiveItems()}
			</div>
		);
	}

});

module.exports = RelationshipFilter;

import React from 'react';
import xhr from 'xhr';

import { Button, FormField, FormInput, InputGroup, SegmentedControl } from 'elemental';

import PopoutList from '../../../admin/client/components/PopoutList';

const TOGGLE_OPTIONS = [
	{ label: 'Linked To', value: true },
	{ label: 'NOT Linked To', value: false },
];

function findElement(arr, propName, propValue) {
	for (var i=0; i < arr.length; i++) {
		if (arr[i][propName] == propValue) {
			return arr[i];
		}
	}
};

function getDefaultValue () {
	return {
		inverted: TOGGLE_OPTIONS[0].value,
		value: [],
	};
}

var RelationshipFilter = React.createClass({

	statics: {
		getDefaultValue: getDefaultValue,
	},

	propTypes: {
		field: React.PropTypes.object,
		filter: React.PropTypes.shape({
			inverted: React.PropTypes.bool,
			value: React.PropTypes.array,
		}),
		onHeightChange: React.PropTypes.func,
	},

	getDefaultProps () {
		return {
			filter: getDefaultValue(),
		};
	},

	getInitialState () {
		return {
			loading: true,
			searchResults: [],
			searchString: '',
		};
	},

	componentDidMount () {
		this._itemsCache = {};
		this.loadSearchResults();
	},

	cacheItem (item) {
		this._itemsCache[item.id] = item;
	},

	loadSearchResults () {
		let searchString = this.state.searchString;
		xhr({
			url: '/keystone/api/' + this.props.field.refList.path + '?basic&search=' + searchString,
			responseType: 'json',
		}, (err, resp, data) => {
			if (err) {
				console.error('Error loading items:', err);
				return;
			}
			data.results.forEach(this.cacheItem);
			if (searchString !== this.state.searchString) return;
			// todo: handle pagination
			// setTimeout(() => {
			this.setState({
				searchResults: data.results,
			}, this.updateHeight);
			// }, 800);
		});
	},

	updateHeight () {
		this.props.onHeightChange(this.refs.container.offsetHeight);
	},

	toggleInverted (value) {
		this.setState({ inverted: value });
	},

	updateSearch (e) {
		this.setState({ searchString: e.target.value }, this.loadSearchResults);
	},

	renderItems (items, selected) {
		let itemIconHover = selected ? 'x' : 'check';

		return items.map((item, i) => {
			return (
				<PopoutList.Item
					key={`item-${i}-${item.id}`}
					icon="dash"
					iconHover={itemIconHover}
					label={item.name}
					onClick={() => { console.log(item); }} />
			);
		});
	},

	render () {
		let selectedItems = [];
		let searchResults = this.state.searchResults.filter(i => {
			return this.props.filter.value.indexOf(i.id) === -1;
		});
		return (
			<div ref="container">
				<FormField>
					<SegmentedControl equalWidthSegments options={TOGGLE_OPTIONS} value={this.state.inverted} onChange={this.toggleInverted} />
				</FormField>
				<FormField style={{ borderBottom: '1px dashed rgba(0,0,0,0.1)', paddingBottom: '1em' }}>
					<FormInput autofocus ref="focusTarget" value={this.state.searchString} onChange={this.updateSearch} placeholder={'Find a ' + this.props.field.label + '...'} />
				</FormField>
				{selectedItems.length ? (
					<PopoutList>
						<PopoutList.Heading>Selected</PopoutList.Heading>
						{this.renderItems(selectedItems, true)}
					</PopoutList>
				) : null}
				{searchResults.length ? (
					<PopoutList>
						<PopoutList.Heading style={selectedItems.length ? { marginTop: '2em' } : null}>Items</PopoutList.Heading>
						{this.renderItems(searchResults)}
					</PopoutList>
				) : null}
			</div>
		);
	}

});

module.exports = RelationshipFilter;

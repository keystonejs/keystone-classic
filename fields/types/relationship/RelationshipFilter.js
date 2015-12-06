import async from 'async';
import React from 'react';
import xhr from 'xhr';

import { Button, FormField, FormInput, InputGroup, SegmentedControl } from 'elemental';

import PopoutList from '../../../admin/client/components/PopoutList';

const TOGGLE_OPTIONS = [
	{ label: 'Linked To', value: false },
	{ label: 'NOT Linked To', value: true },
];

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
			searchIsLoading: false,
			searchResults: [],
			searchString: '',
			selectedItems: [],
			valueIsLoading: true,
		};
	},

	componentDidMount () {
		this._itemsCache = {};
		this.loadSearchResults(true);
	},

	componentWillReceiveProps (nextProps) {
		if (nextProps.filter.value !== this.props.filter.value) {
			this.populateValue(nextProps.filter.value);
		}
	},

	isLoading () {
		return this.state.searchIsLoading || this.state.valueIsLoading;
	},

	populateValue (value) {
		async.map(value, (id, next) => {
			if (this._itemsCache[id]) return next(null, this._itemsCache[id]);
			xhr({
				url: Keystone.adminPath + '/api/' + this.props.field.refList.path + '/' + id + '?basic',
				responseType: 'json',
			}, (err, resp, data) => {
				if (err || !data) return done(err);
				this.cacheItem(data);
				done(err, data);
			});
		}, (err, items) => {
			if (err) {
				// TODO: Handle errors better
				console.error('Error loading items:', err);
			}
			this.setState({
				valueIsLoading: false,
				selectedItems: items || [],
			}, () => {
				this.refs.focusTarget.focus();
			});
		});
	},

	cacheItem (item) {
		this._itemsCache[item.id] = item;
	},

	loadSearchResults (thenPopulateValue) {
		let searchString = this.state.searchString;
		xhr({
			url: Keystone.adminPath + '/api/' + this.props.field.refList.path + '?basic&search=' + searchString,
			responseType: 'json',
		}, (err, resp, data) => {
			if (err) {
				// TODO: Handle errors better
				console.error('Error loading items:', err);
				this.setState({
					searchIsLoading: false,
				});
				return;
			}
			data.results.forEach(this.cacheItem);
			if (thenPopulateValue) {
				this.populateValue(this.props.filter.value);
			}
			if (searchString !== this.state.searchString) return;
			this.setState({
				searchIsLoading: false,
				searchResults: data.results,
			}, this.updateHeight);
		});
	},

	updateHeight () {
		if (this.props.onHeightChange) {
			this.props.onHeightChange(this.refs.container.offsetHeight);
		}
	},

	toggleInverted (inverted) {
		this.updateFilter({ inverted });
	},

	updateSearch (e) {
		this.setState({ searchString: e.target.value }, this.loadSearchResults);
	},

	selectItem (item) {
		let value = this.props.filter.value.concat(item.id);
		this.updateFilter({ value });
	},

	removeItem (item) {
		let value = this.props.filter.value.filter(i => { return i !== item.id; });
		this.updateFilter({ value });
	},

	updateFilter (value) {
		this.props.onChange({ ...this.props.filter, ...value });
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
					onClick={() => {
						if (selected) this.removeItem(item);
						else this.selectItem(item);
					}}
				/>
			);
		});
	},

	render () {
		let selectedItems = this.state.selectedItems;
		let searchResults = this.state.searchResults.filter(i => {
			return this.props.filter.value.indexOf(i.id) === -1;
		});
		let placeholder = this.isLoading() ? 'Loading...' : 'Find a ' + this.props.field.label + '...';
		return (
			<div ref="container">
				<FormField>
					<SegmentedControl equalWidthSegments options={TOGGLE_OPTIONS} value={this.props.filter.inverted} onChange={this.toggleInverted} />
				</FormField>
				<FormField style={{ borderBottom: '1px dashed rgba(0,0,0,0.1)', paddingBottom: '1em' }}>
					<FormInput autofocus ref="focusTarget" value={this.state.searchString} onChange={this.updateSearch} placeholder={placeholder} />
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

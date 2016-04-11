/**
 * Item View
 *
 * This is the item view, it is rendered when users visit a page of a specific
 * item. This mainly renders the form to edit the item content in.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import Lists from '../../../stores/Lists';
import CreateForm from '../../../components/Forms/CreateForm';
import EditForm from '../../../components/Forms/EditForm';
import EditFormHeader from '../../../components/Forms/EditFormHeader';
import FlashMessages from '../../../components/FlashMessages';
import Footer from '../../../components/Footer';
import MobileNavigation from '../../../components/Navigation/MobileNavigation';
import PrimaryNavigation from '../../../components/Navigation/PrimaryNavigation';
import RelatedItemsList from '../../../components/RelatedItemsList';
import SecondaryNavigation from '../../../components/Navigation/SecondaryNavigation';
import { Container, Spinner } from 'elemental';

var ItemView = React.createClass({
	displayName: 'ItemView',
	contextTypes: {
		router: React.PropTypes.object.isRequired,
	},
	getInitialState () {
		return {
			itemData: null,
			createIsOpen: false,
		};
	},
	// When we are mounted, start loading the data
	componentDidMount () {
		this.loadItemData();
	},
	// Load the data
	loadItemData () {
		Lists[this.props.params.listId].loadItem(this.props.params.itemId, { drilldown: true }, (err, itemData) => {
			if (err || !itemData) {
				// TODO: nicer error handling
				console.log('Error loading item data', err);
				alert('Error loading data (details logged to console)');
				return;
			}
			this.setState({ itemData });
		});
	},
	onCreate (item) {
		let list = Lists[this.props.params.listId];
		// After we've created a new item, redirect to newly created item path
		// TODO FIX THIS SO IT DOESNT THROW AN ERROR
		this.context.router.push(`${Keystone.adminPath}/${list.path}/${item.id}`);
	},
	// Open and close the create new item modal
	toggleCreate (visible) {
		this.setState({
			createIsOpen: visible,
		});
	},
	renderRelationships () {
		const { relationships } = Lists[this.props.params.listId];
		const keys = Object.keys(relationships);
		if (!keys.length) return;
		return (
			<div>
				<h2>Relationships</h2>
				{keys.map(key => {
					const relationship = relationships[key];
					const refList = Lists[relationship.path];
					return (
						<RelatedItemsList
							key={relationship.path}
							list={Lists[this.props.params.listId]}
							refList={refList}
							relatedItemId={this.props.params.itemId}
							relationship={relationship}
						/>
					);
				})}
			</div>
		);
	},
	render () {
		// If we don't have any data yet, show the loading indicator
		if (!this.state.itemData) {
			return (
				<div className="view-loading-indicator">
					<Spinner size="md" />
				</div>
			);
		}
		// When we have the data, render the item view with it
		return (
			<div>
				<EditFormHeader
					list={Lists[this.props.params.listId]}
					data={this.state.itemData}
					drilldown={this.state.itemDrilldown}
					toggleCreate={this.toggleCreate} />
				<Container>
					<CreateForm
						list={Lists[this.props.params.listId]}
						isOpen={this.state.createIsOpen}
						onCancel={() => this.toggleCreate(false)}
						onCreate={(item) => this.onCreate(item)} />
					<FlashMessages
						messages={Keystone.messages} />
					<EditForm
						list={Lists[this.props.params.listId]}
						data={this.state.itemData} />
					{this.renderRelationships()}
				</Container>
			</div>
		);
	},
});

module.exports = ItemView;

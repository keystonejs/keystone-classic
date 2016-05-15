/**
 * Item View
 *
 * This is the item view, it is rendered when users visit a page of a specific
 * item. This mainly renders the form to edit the item content in.
 */

import React from 'react';
import { Container, Spinner } from 'elemental';
import { connect } from 'react-redux';

import { listsByKey } from '../../../utils/lists';
import CreateForm from '../../shared/CreateForm';
import EditForm from './components/EditForm';
import EditFormHeader from './components/EditFormHeader';
import RelatedItemsList from './components/RelatedItemsList';
import FlashMessages from '../../shared/FlashMessages';

import {
	selectItem,
	loadItemData,
} from './actions';

import {
	selectList,
} from '../List/actions';

var ItemView = React.createClass({
	displayName: 'ItemView',
	contextTypes: {
		router: React.PropTypes.object.isRequired,
	},
	getInitialState () {
		return {
			createIsOpen: false,
		};
	},
	componentDidMount () {
		// When we directly navigate to an item without coming from another client
		// side routed page before, we need to select the list before initializing the item
		this.props.dispatch(selectList(this.props.params.listId));
		this.initializeItem(this.props.params.itemId);
	},
	componentWillReceiveProps (nextProps) {
		// We've opened a new item from the client side routing, so initialize
		// again with the new item id
		if (nextProps.params.itemId !== this.props.params.itemId) {
			this.initializeItem(nextProps.params.itemId);
		}
	},
	// Initialize an item
	initializeItem (itemId) {
		this.props.dispatch(selectItem(itemId));
		this.props.dispatch(loadItemData());
	},
	// Called when a new item is created
	onCreate (item) {
		// Hide the create form
		this.setState({
			createIsOpen: false,
		});
		// Redirect to newly created item path
		const list = this.props.currentList;
		this.context.router.push(`${Keystone.adminPath}/${list.path}/${item.id}`);
	},
	// Open and close the create new item modal
	toggleCreate (visible) {
		this.setState({
			createIsOpen: visible,
		});
	},
	// Render this items relationships
	renderRelationships () {
		const { relationships } = this.props.currentList;
		const keys = Object.keys(relationships);
		if (!keys.length) return;
		return (
			<div className="Relationships">
				<Container>
					<h2>Relationships</h2>
					{keys.map(key => {
						const relationship = relationships[key];
						// const refList = Lists[relationship.path];
						// return (
						// 	<RelatedItemsList
						// 		key={relationship.path}
						// 		list={this.props.currentList}
						// 		refList={refList}
						// 		relatedItemId={this.props.params.itemId}
						// 		relationship={relationship}
						// 	/>
						// );
					})}
				</Container>
			</div>
		);
	},
	render () {
		// If we don't have any data yet, show the loading indicator
		if (!this.props.ready) {
			return (
				<div className="centered-loading-indicator" data-screen-id="item">
					<Spinner size="md" />
				</div>
			);
		}
		// When we have the data, render the item view with it
		return (
			<div data-screen-id="item">
				{(this.props.error) ? (
					<FlashMessages
						messages={{
							error: [{
								title: "There's a problem with the network, we're trying to reconnect...",
							}],
						}}
					/>
				) : (
					<div>
						<Container>
							<EditFormHeader
								list={this.props.currentList}
								data={this.props.data}
								toggleCreate={this.toggleCreate}
							/>
							<CreateForm
								list={this.props.currentList}
								isOpen={this.state.createIsOpen}
								onCancel={() => this.toggleCreate(false)}
								onCreate={(item) => this.onCreate(item)}
							/>
							<EditForm
								list={this.props.currentList}
								data={this.props.data}
								dispatch={this.props.dispatch}
								router={this.context.router}
							/>
						</Container>
						{this.renderRelationships()}
					</div>
				)}
			</div>
		);
	},
});

module.exports = connect((state) => ({
	data: state.item.data,
	loading: state.item.loading,
	ready: state.item.ready,
	error: state.item.error,
	currentList: state.lists.currentList,
}))(ItemView);

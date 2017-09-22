/**
 * Item View
 *
 * This is the item view, it is rendered when users visit a page of a specific
 * item. This mainly renders the form to edit the item content in.
 */

import React from 'react';
import { Center, Container, Spinner } from '../../elemental';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { listsByKey } from '../../../utils/lists';
import CreateForm from '../../shared/CreateForm';
import Alert from '../../elemental/Alert';
import EditForm from './components/EditForm';
import EditFormHeader from './components/EditFormHeader';
import RelatedItemsList from './components/RelatedItemsList/RelatedItemsList';
// import FlashMessages from '../../shared/FlashMessages';

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
		// We also need to update when the list id has changed
		if (!this.props.currentList || this.props.currentList.id !== this.props.params.listId) {
			this.props.dispatch(selectList(this.props.params.listId));
		}
		this.initializeItem(this.props.params.itemId);
	},
	componentWillReceiveProps (nextProps) {
		// We've opened a new item from the client side routing, so initialize
		// again with the new item id
		if (nextProps.params.itemId !== this.props.params.itemId) {
			this.props.dispatch(selectList(nextProps.params.listId));
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
		this.toggleCreateModal(false);
		// Redirect to newly created item path
		const list = this.props.currentList;
		this.context.router.push(`${Keystone.adminPath}/${list.path}/${item.id}`);
	},
	// Open and close the create new item modal
	toggleCreateModal (visible) {
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
						const refList = listsByKey[relationship.ref];
						const { currentList, params, relationshipData, drag } = this.props;
						return (
							<RelatedItemsList
								key={relationship.path}
								list={currentList}
								refList={refList}
								relatedItemId={params.itemId}
								relationship={relationship}
								items={relationshipData[relationship.path]}
								dragNewSortOrder={drag.newSortOrder}
								dispatch={this.props.dispatch}
							/>
						);
					})}
				</Container>
			</div>
		);
	},
	// Handle errors
	handleError (error) {
		const detail = error.detail;
		if (detail) {
			// Item not found
			if (detail.name === 'CastError'
				&& detail.path === '_id') {
				return (
					<Container>
						<Alert color="danger" style={{ marginTop: '2em' }}>
							No item matching id "{this.props.routeParams.itemId}".&nbsp;
							<Link to={`${Keystone.adminPath}/${this.props.routeParams.listId}`}>
								Go back to {this.props.routeParams.listId}?
							</Link>
						</Alert>
					</Container>
				);
			}
		}
		if (error.message) {
			// Server down + possibly other errors
			if (error.message === 'Internal XMLHttpRequest Error') {
				return (
					<Container>
						<Alert color="danger" style={{ marginTop: '2em' }}>
							We encountered some network problems, please refresh.
						</Alert>
					</Container>
				);
			}
		}
		return (
			<Container>
				<Alert color="danger" style={{ marginTop: '2em' }}>
					An unknown error has ocurred, please refresh.
				</Alert>
			</Container>
		);
	},
	render () {
		// If we don't have any data yet, show the loading indicator
		if (!this.props.ready) {
			return (
				<Center height="50vh" data-screen-id="item">
					<Spinner />
				</Center>
			);
		}

		// When we have the data, render the item view with it
		return (
			<div data-screen-id="item">
				{(this.props.error) ? this.handleError(this.props.error) : (
					<div>
						<Container>
							<EditFormHeader
								list={this.props.currentList}
								data={this.props.data}
								toggleCreate={this.toggleCreateModal}
							/>
							<CreateForm
								list={this.props.currentList}
								isOpen={this.state.createIsOpen}
								onCancel={() => this.toggleCreateModal(false)}
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
	relationshipData: state.item.relationshipData,
	drag: state.item.drag,
}))(ItemView);

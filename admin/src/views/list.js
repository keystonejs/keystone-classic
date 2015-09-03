const React = require('react');

const ListHeader = require('../components/ListHeader');
const CreateForm = require('../components/CreateForm');
const ItemsTable = require('../components/ItemsTable');

const CurrentListStore = require('../stores/CurrentListStore');

const { BlankState, Container, Button, Spinner } = require('elemental');

const ListView = React.createClass({

	displayName: 'ListView',

	getInitialState () {
		return {
			constrainTableWidth: true,
			...this.getStateFromStore()
		};
	},

	componentDidMount () {
		CurrentListStore.addChangeListener(this.updateStateFromStore);
		if (!this.state.ready) {
			CurrentListStore.loadItems();
		}
	},

	componentWillUnmount () {
		CurrentListStore.removeChangeListener(this.updateStateFromStore);
	},

	updateStateFromStore () {
		this.setState(this.getStateFromStore());
	},

	toggleTableWidth () {
		this.setState({
			constrainTableWidth: !this.state.constrainTableWidth
		});
	},

	getStateFromStore () {
		var state = {
			columns: CurrentListStore.getActiveColumns(),
			items: CurrentListStore.getItems(),
			list: CurrentListStore.getList(),
			loading: CurrentListStore.isLoading(),
			ready: CurrentListStore.isReady(),
			search: CurrentListStore.getActiveSearch()
		};
		state.showBlankState = (state.ready && !state.loading && !state.items.results.length && !state.search) ? true : false;
		return state;
	},

	toggleCreateModal (visible) {
		this.setState({
			createIsOpen: visible
		});
	},

	reorderItems () {
		alert('TODO: Add re-ordering of items');
	},

	removeItem () {
		confirm('Are you sure you want to remove this item?');
	},

	renderBlankState () {
		if (!this.state.showBlankState) return null;
		return (
			<Container>
				<BlankState style={{ marginTop: 40 }}>
					<BlankState.Heading>No {this.state.list.plural.toLowerCase()} found&hellip;</BlankState.Heading>
					{this.renderCreateButton()}
				</BlankState>
				{this.renderCreateForm()}
			</Container>
		);
	},

	renderActiveState () {
		if (this.state.showBlankState) return null;

		let containerStyle = {
			maxWidth: this.state.constrainTableWidth ? null : '100%',
			transition: 'max-width 160ms ease-out',
			msTransition: 'max-width 160ms ease-out',
			MozTransition: 'max-width 160ms ease-out',
			WebkitTransition: 'max-width 160ms ease-out',
		};

		return (
			<div>
				<ListHeader toggleTableWidth={this.toggleTableWidth} tableIsExpanded={!this.state.constrainTableWidth} />
				<Container style={containerStyle}>
					{this.renderItemsTable()}
					{this.renderNoSearchResults()}
				</Container>
			</div>
		);
	},

	renderItemsTable () {
		if (!this.state.items.results.length) return null;
		return (
			<div className="ItemList-wrapper">
				<ItemsTable
					items={this.state.items.results}
					columns={this.state.columns}
					list={this.state.list} />
			</div>
		);
	},

	renderNoSearchResults () {
		if (this.state.items.results.length) return null;
		return (
			<BlankState style={{ marginTop: 20 }}>
				<span className="octicon octicon-search" style={{ fontSize: 32, marginBottom: 20 }} />
				<BlankState.Heading>No {this.state.list.plural.toLowerCase()} found matching {this.state.search}</BlankState.Heading>
			</BlankState>
		);
	},

	renderCreateButton () {
		var props = { type: 'success' };
		if (this.state.list.nocreate) return null;
		if (this.state.list.autocreate) {
			props.href = '?new' + Keystone.csrf.query;
		} else {
			props.onClick = this.toggleCreateModal.bind(this, true);
		}
		return (
			<Button {...props}>
				<span className="octicon octicon-plus" />
				Create {this.state.list.singular}
			</Button>
		);
	},

	renderCreateForm () {
		return <CreateForm list={this.state.list} isOpen={this.state.createIsOpen} onCancel={this.toggleCreateModal.bind(this, false)} values={Keystone.createFormData} err={Keystone.createFormErrors} />;
	},

	render () {
		return !this.state.ready ? (
			<div className="view-loading-indicator"><Spinner size="md" /></div>
		) : (
			<div>
				{this.renderBlankState()}
				{this.renderActiveState()}
			</div>
		);
	}

});

var target = document.getElementById('list-view');
if (target) {
	React.render(<ListView />, target);
}

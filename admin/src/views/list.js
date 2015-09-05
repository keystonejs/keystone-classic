const React = require('react');

const CreateForm = require('../components/CreateForm');
const ItemsTable = require('../components/ItemsTable');
const ListHeader = require('../components/ListHeader');
const Footer = require('../components/Footer');
const FlashMessages = require('../components/FlashMessages');
const MobileNavigation = require('../components/MobileNavigation');
const PrimaryNavigation = require('../components/PrimaryNavigation');
const SecondaryNavigation = require('../components/SecondaryNavigation');

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
				<FlashMessages messages={Keystone.messages} />
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
			transition: 'max-width 160ms ease-out',
			msTransition: 'max-width 160ms ease-out',
			MozTransition: 'max-width 160ms ease-out',
			WebkitTransition: 'max-width 160ms ease-out',
		};
		if (!this.state.constrainTableWidth) containerStyle['maxWidth'] = '100%';

		return (
			<div>
				<ListHeader toggleTableWidth={this.toggleTableWidth} tableIsExpanded={!this.state.constrainTableWidth} />
				<Container style={containerStyle}>
					<FlashMessages messages={Keystone.messages} />
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
			props.href = '?new' + this.props.csrfQuery;
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
		return <CreateForm list={this.state.list} isOpen={this.state.createIsOpen} onCancel={this.toggleCreateModal.bind(this, false)} values={this.props.createFormData} err={this.props.createFormErrors} />;
	},

	render () {
		return !this.state.ready ? (
			<div className="view-loading-indicator"><Spinner size="md" /></div>
		) : (
			<div className="keystone-wrapper">
				<header className="keystone-header">
					<MobileNavigation
						brand={Keystone.brand}
						currentListKey={Keystone.list.path}
						currentSectionKey={Keystone.nav.currentSection.key}
						sections={Keystone.nav.sections}
						signoutUrl={Keystone.signoutUrl}
						/>
					<PrimaryNavigation
						brand={Keystone.brand}
						currentSectionKey={Keystone.nav.currentSection.key}
						sections={Keystone.nav.sections}
						signoutUrl={Keystone.signoutUrl} />
					<SecondaryNavigation
						currentListKey={Keystone.list.path}
						lists={Keystone.nav.currentSection.lists} />
				</header>
				<div className="keystone-body">
					{this.renderBlankState()}
					{this.renderActiveState()}
				</div>
				<Footer
					appversion={Keystone.appversion}
					backUrl={Keystone.backUrl}
					brand={Keystone.brand}
					User={Keystone.User}
					user={Keystone.user}
					version={Keystone.version} />
			</div>
		);
	}

});

var target = document.getElementById('list-view');
if (target) {
	React.render(<ListView
	csrfQuery={Keystone.csrf_query}
	createFormData={Keystone.createFormData}
	createFormErrors={Keystone.createFormErrors} />,
	target);
}

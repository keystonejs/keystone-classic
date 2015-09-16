const React = require('react');

const CreateForm = require('../components/CreateForm');
const FlashMessages = require('../components/FlashMessages');
const Footer = require('../components/Footer');
const ItemsTable = require('../components/ItemsTable');
const ListHeader = require('../components/ListHeader');
const MobileNavigation = require('../components/MobileNavigation');
const PrimaryNavigation = require('../components/PrimaryNavigation');
const SecondaryNavigation = require('../components/SecondaryNavigation');

const CurrentListStore = require('../stores/CurrentListStore');

const { BlankState, Container, Button, Spinner } = require('elemental');
const { plural } = require('../utils');

function showCreateForm() {
	return window.location.search === '?create' || Keystone.createFormErrors;
}

const ListView = React.createClass({
	getInitialState () {
		return {
			constrainTableWidth: true,
			showCreateForm: showCreateForm(),
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
			filters: CurrentListStore.getActiveFilters(),
			items: CurrentListStore.getItems(),
			list: CurrentListStore.getList(),
			loading: CurrentListStore.isLoading(),
			ready: CurrentListStore.isReady(),
			search: CurrentListStore.getActiveSearch()
		};
		state.showBlankState = (state.ready && !state.loading && !state.items.results.length && !state.search && !state.filters.length) ? true : false;
		return state;
	},
	toggleCreateModal (visible) {
		this.setState({
			showCreateForm: visible
		});
	},
	renderBlankState () {
		if (!this.state.showBlankState) return null;
		return (
			<Container>
				<FlashMessages messages={this.props.messages} />
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
					<FlashMessages messages={this.props.messages} />
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
		let matching = this.state.search;
		if (this.state.filters.length) {
			matching += (matching ? ' and ' : '') + plural(this.state.filters.length, '* filter', '* filters');
		}
		matching = matching ? ' found matching ' + matching : '.';
		return (
			<BlankState style={{ marginTop: 20, marginBottom: 20 }}>
				<span className="octicon octicon-search" style={{ fontSize: 32, marginBottom: 20 }} />
				<BlankState.Heading>No {this.state.list.plural.toLowerCase()}{matching}</BlankState.Heading>
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
		return (
			<CreateForm
				list={this.state.list}
				isOpen={this.state.showCreateForm}
				onCancel={this.toggleCreateModal.bind(this, false)}
				values={this.props.createFormData}
				err={this.props.createFormErrors} />
		);
	},
	render () {
		return !this.state.ready ? (
			<div className="view-loading-indicator"><Spinner size="md" /></div>
		) : (
			<div className="keystone-wrapper">
				<header className="keystone-header">
					<MobileNavigation
						brand={this.props.brand}
						currentListKey={this.state.list.path}
						currentSectionKey={this.props.nav.currentSection.key}
						sections={this.props.nav.sections}
						signoutUrl={this.props.signoutUrl}
						/>
					<PrimaryNavigation
						brand={this.props.brand}
						currentSectionKey={this.props.nav.currentSection.key}
						sections={this.props.nav.sections}
						signoutUrl={this.props.signoutUrl} />
					<SecondaryNavigation
						currentListKey={this.state.list.path}
						lists={this.props.nav.currentSection.lists} />
				</header>
				<div className="keystone-body">
					{this.renderBlankState()}
					{this.renderActiveState()}
				</div>
				<Footer
					appversion={this.props.appversion}
					backUrl={this.props.backUrl}
					brand={this.props.brand}
					User={this.props.User}
					user={this.props.user}
					version={this.props.version} />
			</div>
		);
	}

});

React.render(
	<ListView
		appversion={Keystone.appversion}
		backUrl={Keystone.backUrl}
		brand={Keystone.brand}
		createFormData={Keystone.createFormData}
		createFormErrors={Keystone.createFormErrors}
		csrfQuery={Keystone.csrf.query}
		messages={Keystone.messages}
		nav={Keystone.nav}
		signoutUrl={Keystone.signoutUrl}
		user={Keystone.user}
		User={Keystone.User}
		version={Keystone.version}
	/>,
	document.getElementById('list-view')
);

const React = require('react');
const ReactDOM = require('react-dom');
const request = require('superagent');

const Lists = require('../stores/Lists');

const CreateForm = require('../components/CreateForm');
const EditForm = require('../components/EditForm');
const EditFormHeader = require('../components/EditFormHeader');
const FlashMessages = require('../components/FlashMessages');
const Footer = require('../components/Footer');
const MobileNavigation = require('../components/MobileNavigation');
const PrimaryNavigation = require('../components/PrimaryNavigation');
const SecondaryNavigation = require('../components/SecondaryNavigation');

const { Container, Spinner } = require('elemental');

var RelatedItemsList = React.createClass({
	propTypes: {
		list: React.PropTypes.object.isRequired,
		relatedItemId: React.PropTypes.string.isRequired,
		relationship: React.PropTypes.object.isRequired,
	},
	render () {
		return (
			<span>
				{json}
			</span>
		);
	}
});


var ItemView = React.createClass({

	displayName: 'ItemView',

	getInitialState () {
		return {
			createIsOpen: false,
			itemData: null,
		};
	},

	componentDidMount () {
		this.loadItemData();
	},

	loadItemData () {
		this.props.list.loadItem(this.props.itemId, { drilldown: true }, (err, itemData) => {
			if (err || !itemData) {
				// TODO: nicer error handling
				console.log('Error loading item data', err);
				alert('Error loading data (details logged to console)');
				return;
			}
			this.setState({ itemData });
		});
	},

	toggleCreate (visible) {
		this.setState({
			createIsOpen: visible
		});
	},

	renderRelationships () {
		// TODO
		return;
		let { relationships } = this.props.list;
		let keys = Object.keys(relationships);
		if (!keys.length) return;
		return (
			<div>
				<h2>Relationships</h2>
				{keys.map(key => {
					return <RelatedItemsList list={this.props.list} relationship={relationships[key]} relatedItemId={this.props.itemId} />;
				})}
			</div>
		);
	},

	render () {
		if (!this.state.itemData) return <div className="view-loading-indicator"><Spinner size="md" /></div>;
		return (
			<div className="keystone-wrapper">
				<header className="keystone-header">
					<MobileNavigation
						brand={this.props.brand}
						currentListKey={this.props.list.path}
						currentSectionKey={this.props.nav.currentSection.key}
						sections={this.props.nav.sections}
						signoutUrl={this.props.signoutUrl}
						/>
					<PrimaryNavigation
						currentSectionKey={this.props.nav.currentSection.key}
						brand={this.props.brand}
						sections={this.props.nav.sections}
						signoutUrl={this.props.signoutUrl} />
					<SecondaryNavigation
						currentListKey={this.props.list.path}
						lists={this.props.nav.currentSection.lists} />
				</header>
				<div className="keystone-body">
					<EditFormHeader
						list={this.props.list}
						data={this.state.itemData}
						drilldown={this.state.itemDrilldown}
						toggleCreate={this.toggleCreate} />
					<Container>
						<CreateForm
							list={this.props.list}
							isOpen={this.state.createIsOpen}
							onCancel={this.toggleCreate.bind(this, false)} />
						<FlashMessages
							messages={this.props.messages} />
						<EditForm
							list={this.props.list}
							data={this.state.itemData} />
						{this.renderRelationships()}
					</Container>
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

ReactDOM.render(
	<ItemView
		appversion={Keystone.appversion}
		backUrl={Keystone.backUrl}
		brand={Keystone.brand}
		itemId={Keystone.itemId}
		list={Lists[Keystone.list.key]}
		messages={Keystone.messages}
		nav={Keystone.nav}
		signoutUrl={Keystone.signoutUrl}
		User={Keystone.User}
		user={Keystone.user}
		version={Keystone.version}
	/>,
	document.getElementById('item-view')
);

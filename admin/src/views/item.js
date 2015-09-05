const React = require('react');
const request = require('superagent');

const CreateForm = require('../components/CreateForm');
const EditForm = require('../components/EditForm');
const EditFormHeader = require('../components/EditFormHeader');
const Footer = require('../components/Footer');
const FlashMessages = require('../components/FlashMessages');
const MobileNavigation = require('../components/MobileNavigation');
const PrimaryNavigation = require('../components/PrimaryNavigation');
const SecondaryNavigation = require('../components/SecondaryNavigation');

const { Container, Spinner } = require('elemental');

var View = React.createClass({

	displayName: 'ItemView',

	getInitialState () {
		return {
			createIsOpen: false,
			itemData: null
		};
	},

	componentDidMount () {
		this.loadItemData();
	},

	loadItemData () {
		request.get('/keystone/api/' + this.props.list.path + '/' + this.props.itemId + '?drilldown=true')
			.set('Accept', 'application/json')
			.end((err, res) => {
				if (err || !res.ok) {
					// TODO: nicer error handling
					console.log('Error loading item data:', res ? res.text : err);
					alert('Error loading data (details logged to console)');
					return;
				}
				this.setState({
					itemData: res.body
				});
			});
	},

	toggleCreate (visible) {
		this.setState({
			createIsOpen: visible
		});
	},

	renderCreateForm () {
		return <CreateForm list={this.props.list} isOpen={this.state.createIsOpen} onCancel={this.toggleCreate.bind(this, false)} />;
	},

	render () {
		if (!this.state.itemData) return <div className="view-loading-indicator"><Spinner size="md" /></div>;
		return (
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
						currentSectionKey={Keystone.nav.currentSection.key}
						brand={Keystone.brand}
						sections={Keystone.nav.sections}
						signoutUrl={Keystone.signoutUrl} />
					<SecondaryNavigation
						currentListKey={Keystone.list.path}
						lists={Keystone.nav.currentSection.lists} />
				</header>
				<div className="keystone-body">
					<EditFormHeader
						list={this.props.list}
						data={this.state.itemData}
						drilldown={this.state.itemDrilldown}
						toggleCreate={this.toggleCreate} />
					<Container>
						{this.renderCreateForm()}
						<FlashMessages messages={Keystone.messages} />
						<EditForm list={this.props.list} data={this.state.itemData} />
					</Container>
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

React.render(<View
		itemId={Keystone.itemId}
		list={Keystone.list}
	/>, document.getElementById('item-view'));

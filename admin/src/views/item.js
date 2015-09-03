const React = require('react');
const request = require('superagent');

const CreateForm = require('../components/CreateForm');
const EditForm = require('../components/EditForm');
const EditFormHeader = require('../components/EditFormHeader');
const PrimaryNavigation = require('../components/PrimaryNavigation');

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
			<div>
				<PrimaryNavigation
					activeView={Keystone.nav.currentSection}
					brand={Keystone.brand}
					navItems={Keystone.nav.sections}
					signoutUrl={Keystone.signoutUrl} />
				<EditFormHeader
					list={this.props.list}
					data={this.state.itemData}
					drilldown={this.state.itemDrilldown}
					toggleCreate={this.toggleCreate} />
				<Container>
					{this.renderCreateForm()}
					<EditForm list={this.props.list} data={this.state.itemData} />
				</Container>
			</div>
		);
	}

});

React.render(<View
		itemId={Keystone.itemId}
		list={Keystone.list}
	/>, document.getElementById('item-view'));

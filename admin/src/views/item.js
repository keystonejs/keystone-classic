var React = require('react');
var request = require('superagent');

var CreateForm = require('../components/CreateForm');
var EditForm = require('../components/EditForm');
var EditFormHeader = require('../components/EditFormHeader');

var { Container, Spinner } = require('elemental');

var View = React.createClass({

	displayName: 'ItemView',

	getInitialState () {
		return {
			createIsOpen: false,
			list: Keystone.list,
			itemData: null
		};
	},

	componentDidMount () {
		this.loadItemData();
	},

	loadItemData () {
		request.get('/keystone/api/' + Keystone.list.path + '/' + this.props.itemId + '?drilldown=true')
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
		return <CreateForm list={Keystone.list} isOpen={this.state.createIsOpen} onCancel={this.toggleCreate.bind(this, false)} />;
	},

	render () {
		if (!this.state.itemData) return <div className="view-loading-indicator"><Spinner size="md" /></div>;
		return (
			<div>
				<EditFormHeader list={this.state.list} data={this.state.itemData} drilldown={this.state.itemDrilldown} toggleCreate={this.toggleCreate} />
				<Container>
					{this.renderCreateForm()}
					<EditForm list={this.state.list} data={this.state.itemData} />
				</Container>
			</div>
		);
	}

});

React.render(<View itemId={Keystone.itemId} />, document.getElementById('item-view'));

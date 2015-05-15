var React = require('react');
var request = require('superagent');

var CreateForm = require('../components/CreateForm');
var EditForm = require('../components/EditForm');
var EditFormHeader = require('../components/EditFormHeader');

var Spinner = require('elemental').Spinner;

var View = React.createClass({
	
	displayName: 'ItemView',
	
	getInitialState: function() {
		return {
			createIsVisible: false,
			list: Keystone.list,
			itemData: null,
			itemDrilldown: null
		};
	},

	componentDidMount: function() {
		request.get('/keystone/api/' + Keystone.list.path + '/' + this.props.itemId + '?drilldown=true')
			.set('Accept', 'application/json')
			.end(function(err, res) {//eslint-disable-line no-unused-vars, handle-callback-err
				if (!res.ok) {
					// TODO: nicer error handling
					console.log('Error loading item data:', res.text);
					alert('Error loading data (details logged to console)');
					return;
				}
				this.setState({//eslint-disable-line react/no-did-mount-set-state
					itemData: res.body.data,
					itemDrilldown: res.body.drilldown 
				});
			}.bind(this));
	},
	
	toggleCreate: function(visible) {
		this.setState({
			createIsVisible: visible
		});
	},
	
	renderCreateForm: function() {
		if (!this.state.createIsVisible) return null;
		return <CreateForm list={Keystone.list} animate onCancel={this.toggleCreate.bind(this, false)} />;
	},
	
	render: function() {
		if (!this.state.itemData) return <div className="view-loading-indicator"><Spinner /></div>;
		return (
			<div>
				<EditFormHeader list={this.state.list} data={this.state.itemData} drilldown={this.state.itemDrilldown} toggleCreate={this.toggleCreate} />
				<div className="container">
					{this.renderCreateForm()}
					<EditForm list={this.state.list} data={this.state.itemData} />
				</div>
			</div>
		);
	}
	
});

React.render(<View itemId={Keystone.itemId} />, document.getElementById('item-view'));

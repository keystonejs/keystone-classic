var React = require('react');
var CreateForm = require('../components/CreateForm');

var View = React.createClass({
	
	displayName: 'ListView',
	
	getInitialState: function() {
		return {
			createIsVisible: Keystone.showCreateForm,
			animateCreateForm: false
		};
	},
	
	toggleCreate: function(visible) {
		this.setState({
			createIsVisible: visible,
			animateCreateForm: true
		});
	},
	
	renderCreateButton: function() {
		if (Keystone.list.autocreate) {
			return (
				<div className="toolbar">
					<a href={'?new' + Keystone.csrf.query} className="btn btn-default btn-create btn-create-item">
						<span className="ion-plus-round mr-5" />
						Create {Keystone.list.singular}
					</a>
				</div>
			);
		}
		return (
			<div className="toolbar">
				<button type="button" className="btn btn-default btn-create btn-create-item" onClick={this.toggleCreate.bind(this, true)}>
					<span className="ion-plus-round mr-5" />
					Create {Keystone.list.singular}
				</button>
			</div>
		);
	},
	
	renderCreateForm: function() {
		if (!this.state.createIsVisible) return null;
		return <CreateForm list={Keystone.list} animate={this.state.animateCreateForm} onCancel={this.toggleCreate.bind(this, false)} values={Keystone.createFormData} err={Keystone.createFormErrors} />;
	},
	
	render: function() {
		if (Keystone.list.nocreate) return null;
		return (
			<div className="create-item">
				{this.renderCreateButton()}
				{this.renderCreateForm()}
				<hr />
			</div>
		);
	}
	
});

React.render(<View />, document.getElementById('list-view'));

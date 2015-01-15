var React = require('react'),
	CreateForm = require('../../components/CreateForm');

var View = React.createClass({
	
	// TODO: Handle auto-display of create form when validation failed
	
	getInitialState: function() {
		return {
			createIsVisible: false
		};
	},
	
	toggleCreate: function(visible) {
		this.setState({
			createIsVisible: visible
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
			<div className="toolbar-default">
				<button type="button" className="btn btn-default btn-create btn-create-item" onClick={this.toggleCreate.bind(this, true)}>
					<span className="ion-plus-round mr-5" />
					Create {Keystone.list.singular}
				</button>
			</div>
		);
	},
	
	renderCreateForm: function() {
		if (!this.state.createIsVisible) return null;
		return <CreateForm list={Keystone.list} onCancel={this.toggleCreate.bind(this, false)} />
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

exports.render = function() {
	React.render(<View />, document.getElementById('list-view'));
};

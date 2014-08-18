/** @jsx React.DOM */

/**
 * TODO:
 * - collapse
 * - noedit
 */

var _ = require('underscore'),
	React = require('react'),
	Note = require('../components/note');


function validateSpec(spec) {
	if (!_.isObject(spec.supports)) {
		spec.supports = {};
	}
	return spec;
}

function evalDependsOn(dependsOn, values) {
	if (!_.isObject(dependsOn)) return true;
	var keys = _.keys(dependsOn);
	return (keys.length) ? _.every(keys, function(key) {
		return (values[key] == dependsOn[key]);
	}, this) : true;
}

var Base = module.exports.Base = {
	
	getInitialState: function() {
		return {};
	},
	
	valueChanged: function(event) {
		this.props.onChange({
			path: this.props.path,
			value: event.target.value
		});
	},
	
	renderUI: function(spec) {
		
		var fieldClassName = 'field-ui';
			
		if (spec.supports.width) {
			fieldClassName += ' width-' + this.props.width;
		}
		
		return <div className={"field type-" + spec.type}>
			<label className="field-label">{this.props.label}</label>
			<div className={fieldClassName}>
				{this.renderField()}
				<Note note={this.props.note} />
			</div>
		</div>;
		
	},
	
	renderField: function() {
		return this.props.noedit
			? <div className="field-value">{this.props.value}</div>
			: <input type="text" name={this.props.path} ref="focusTarget" value={this.props.value} onChange={this.valueChanged} autoComplete="off" className="form-control" />;
	}
	
}

var Mixins = module.exports.Mixins = {
	
	Collapse: {
		
		componentWillMount: function() {
			this.setState({
				isCollapsed: this.shouldCollapse()
			});
		},
		
		componentDidUpdate: function(prevProps, prevState) {
			if (prevState.isCollapsed && !this.state.isCollapsed && this.refs.focusTarget) {
				this.refs.focusTarget.getDOMNode().focus();
			}
		},
		
		shouldCollapse: function() {
			return this.props.collapse && !this.props.value;
		},
		
		uncollapse: function() {
			this.setState({
				isCollapsed: false
			});
		},
		
		renderCollapse: function() {
			
			if (this.props.noedit) {
				return null;
			}
			
			return <div className="col-sm-12">
				<label className="uncollapse">
					<a href="javascript:;" onClick={this.uncollapse}>+ Add {this.props.label.toLowerCase()}</a>
				</label>
			</div>;
			
		}
		
	}
	
}

module.exports.create = function(spec) {
	
	spec = validateSpec(spec);
	
	var field = {
		
		mixins: [Mixins.Collapse],
		
		render: function() {
			
			if (!evalDependsOn(this.props.dependsOn, this.props.values)) {
				return null;
			}
			
			if (this.state.isCollapsed) {
				return this.renderCollapse();
			}
			
			return this.renderUI(spec);
			
		}
		
	};
	
	_.extend(field, Base);
	_.extend(field, spec);
	
	if (_.isArray(spec.mixins)) {
		field.mixins.concat(spec.mixins);
	}
	
	return React.createClass(field);
	
}

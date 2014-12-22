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
	if (!spec.focusTargetRef) {
		spec.focusTargetRef = 'focusTarget';
	}
	return spec;
}

function evalDependsOn(dependsOn, values) {
	if (!_.isObject(dependsOn)) return true;
	var keys = _.keys(dependsOn);
	return (keys.length) ? _.every(keys, function(key) {
		var matches = _.isArray(dependsOn[key]) ? dependsOn[key] : [dependsOn[key]];
		return _.contains(matches, values[key]);
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
		
	shouldCollapse: function() {
		return this.props.collapse && !this.props.value;
	},
	
	renderUI: function(spec) {
		var fieldClassName = 'field-ui field-size-' + this.props.size;
		var inner = this.props.noedit ? this.renderValue() : this.renderField();
		return (
			<div className={"field field-type-" + this.props.type}>
				<label className="field-label">{this.props.label}</label>
				<div className={fieldClassName}>
					{inner}
					<Note note={this.props.note} />
				</div>
			</div>
		);
		
	},
	
	renderField: function() {
		return <input type="text" name={this.props.path} ref="focusTarget" value={this.props.value} onChange={this.valueChanged} autoComplete="off" className="form-control" />;
	},
	
	renderValue: function() {
		return <div className="field-value">{this.props.value}</div>;
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
			if (prevState.isCollapsed && !this.state.isCollapsed && this.refs[this.spec.focusTargetRef]) {
				this.refs[this.spec.focusTargetRef].getDOMNode().focus();
			}
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
			return (
				<div className={"field field-type-" + this.props.type}>
					<div className="col-sm-12">
						<label className="uncollapse">
							<a href="javascript:;" onClick={this.uncollapse}>+ Add {this.props.label.toLowerCase()}</a>
						</label>
					</div>
				</div>
			);
		}
	}
}

module.exports.create = function(spec) {
	
	spec = validateSpec(spec || {});
	
	var excludeBaseMethods = [];
	
	var field = {
		
		spec: spec,
		
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
	
	if (spec.mixins) {
		_.each(spec.mixins, function(mixin) {
			_.each(mixin, function(method, name) {
				if (Base[name]) excludeBaseMethods.push(name);
			});
		});
	}
	
	_.extend(field, _.omit(Base, excludeBaseMethods));
	_.extend(field, _.omit(spec, 'mixins'));
	
	if (_.isArray(spec.mixins)) {
		field.mixins = field.mixins.concat(spec.mixins);
	}
	
	return React.createClass(field);
	
}

var _ = require('underscore');
var blacklist = require('blacklist');
var cx = require('classnames');
var evalDependsOn = require('../utils/evalDependsOn.js');
var React = require('react');
var Note = require('../components/Note');

var FormField = require('elemental').FormField;
var FormInput = require('elemental').FormInput;
var Button = require('elemental').Button;

function validateSpec(spec) {
	if (!_.isObject(spec.supports)) {
		spec.supports = {};
	}
	if (!spec.focusTargetRef) {
		spec.focusTargetRef = 'focusTarget';
	}
	return spec;
}

var Base = module.exports.Base = {
	
	getInitialState: function() {
		return {};
	},
	
	getDefaultProps: function() {
		return {
			inputProps: {},
			labelProps: {},
			valueProps: {},
			size: 'large'
		};
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
	
	shouldRenderField: function() {
		if (!this.props.noedit) return true;
		if (this.props.mode === 'create' && this.props.initial) return true;
		return false;
	},
	
	focus: function() {
		if (!this.refs[this.spec.focusTargetRef]) return;
		this.refs[this.spec.focusTargetRef].getDOMNode().focus();
	},
	
	renderLabel: function() {
		if (!this.props.label) return null;
		return <label className="field-label">{this.props.label}</label>;
	},
	
	renderNote: function() {
		if (!this.props.note) return null;
		return <Note note={this.props.note} />;
	},
	
	renderField: function() {
		var props = _.extend(this.props.inputProps, {
			ref: 'focusTarget',
			name: this.props.path,
			onChange: this.valueChanged,
			autoComplete: 'off'
		});
		return <FormInput {...props} />;
	},
	
	renderValue: function() {
		return <div className="field-value">{this.props.value}</div>;
	},
	
	renderUI: function(spec) {//eslint-disable-line no-unused-vars
		var wrapperClassName = cx('field', 'field-type-' + this.props.type, this.props.className);
		var fieldClassName = cx('field-ui', 'field-size-' + this.props.size);
		console.log(this.props.path + ': ' + fieldClassName);
		return (
			<div className={wrapperClassName}>
				{this.renderLabel()}
				<div className={fieldClassName}>
					{this.shouldRenderField() ? this.renderField() : this.renderValue()}
					{this.renderNote()}
				</div>
			</div>
		);
		
	}
	
};

var Mixins = module.exports.Mixins = {
	
	Collapse: {
		
		componentWillMount: function() {
			this.setState({
				isCollapsed: this.shouldCollapse()
			});
		},
		
		componentDidUpdate: function(prevProps, prevState) {
			if (prevState.isCollapsed && !this.state.isCollapsed) {
				this.focus();
			}
		},
		
		uncollapse: function() {
			this.setState({
				isCollapsed: false
			});
		},
		
		renderCollapse: function() {
			if (!this.shouldRenderField()) return null;
			return (
				<div className={'field field-type-' + this.props.type}>
					<div className="col-sm-12">
						<Button type="link" onClick={this.uncollapse}>+ Add {this.props.label.toLowerCase()}</Button>
					</div>
				</div>
			);
		}
	}
};

module.exports.create = function(spec) {
	
	spec = validateSpec(spec || {});
	
	var excludeBaseMethods = [];
	
	var field = {
		
		spec: spec,
		
		displayName: spec.displayName,
		
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
	
};

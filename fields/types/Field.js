var _ = require('underscore');
var cx = require('classnames');
var evalDependsOn = require('../utils/evalDependsOn.js');
var React = require('react');

var FormField = require('elemental').FormField;
var FormInput = require('elemental').FormInput;
var FormNote = require('elemental').FormNote;
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
			size: 'full'
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

	renderNote: function() {
		if (!this.props.note) return null;
		return <FormNote note={this.props.note} />;
	},

	wrapField: function() {
		return this.renderField();
	},

	renderField: function() {
		var props = _.extend(this.props.inputProps, {
			autoComplete: 'off',
			name: this.props.path,
			onChange: this.valueChanged,
			ref: 'focusTarget',
			value: this.props.value
		});
		return <FormInput {...props} />;
	},

	wrapValue: function() {
		return this.renderValue();
	},

	renderValue: function() {
		return <FormInput noedit>{this.props.value}</FormInput>;
	},

	renderUI: function() {
		var wrapperClassName = cx(
			('field-type-' + this.props.type),
			('field-size-' + this.props.size),
			this.props.className
		);

		return (
			<FormField label={this.props.label} className={wrapperClassName} htmlFor={this.props.path}>
				{this.shouldRenderField() ? this.wrapField() : this.wrapValue()}
				{this.renderNote()}
			</FormField>
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
				<FormField>
					<Button type="link" className="collapsed-field-label" onClick={this.uncollapse}>+ Add {this.props.label.toLowerCase()}</Button>
				</FormField>
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
			return this.renderUI();
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

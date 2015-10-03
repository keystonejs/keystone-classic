import _ from 'underscore';
import classnames from 'classnames';
import evalDependsOn from '../utils/evalDependsOn.js';
import React from 'react';
import { Button, FormField, FormInput, FormNote } from 'elemental';

function validateSpec(spec) {
	if (!spec) spec = {};
	if (!_.isObject(spec.supports)) {
		spec.supports = {};
	}
	if (!spec.focusTargetRef) {
		spec.focusTargetRef = 'focusTarget';
	}
	return spec;
}

var Base = module.exports.Base = {
	getInitialState () {
		return {};
	},
	getDefaultProps () {
		return {
			inputProps: {},
			labelProps: {},
			valueProps: {},
			size: 'full'
		};
	},
	valueChanged (event) {
		this.props.onChange({
			path: this.props.path,
			value: event.target.value
		});
	},
	shouldCollapse () {
		return this.props.collapse && !this.props.value;
	},
	shouldRenderField () {
		if (!this.props.noedit) return true;
		if (this.props.mode === 'create' && this.props.initial) return true;
		return false;
	},
	focus () {
		if (!this.refs[this.spec.focusTargetRef]) return;
		this.refs[this.spec.focusTargetRef].getDOMNode().focus();
	},
	renderNote () {
		if (!this.props.note) return null;
		return <FormNote note={this.props.note} />;
	},
	renderField () {
		var props = _.extend(this.props.inputProps, {
			autoComplete: 'off',
			name: this.props.path,
			onChange: this.valueChanged,
			ref: 'focusTarget',
			value: this.props.value
		});
		return <FormInput {...props} />;
	},
	renderValue () {
		return <FormInput noedit>{this.props.value}</FormInput>;
	},
	renderUI () {
		var wrapperClassName = classnames(
			('field-type-' + this.props.type),
			this.props.className
		);
		return (
			<FormField label={this.props.label} className={wrapperClassName} htmlFor={this.props.path}>
				<div className={'FormField__inner field-size-' + this.props.size}>
					{this.shouldRenderField() ? this.renderField() : this.renderValue()}
				</div>
				{this.renderNote()}
			</FormField>
		);
	}
};

var Mixins = module.exports.Mixins = {
	Collapse: {
		componentWillMount () {
			this.setState({
				isCollapsed: this.shouldCollapse()
			});
		},
		componentDidUpdate (prevProps, prevState) {
			if (prevState.isCollapsed && !this.state.isCollapsed) {
				this.focus();
			}
		},
		uncollapse () {
			this.setState({
				isCollapsed: false
			});
		},
		renderCollapse () {
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

	spec = validateSpec(spec);

	var excludeBaseMethods = [];
	var field = {
		spec: spec,
		displayName: spec.displayName,
		mixins: [Mixins.Collapse],
		render () {
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

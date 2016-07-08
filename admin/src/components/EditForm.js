var _ = require('underscore'),
	assign = require('object-assign'),
	moment = require('moment'),
	React = require('react'),
	Fields = require('FieldTypes'),
	FormHeading = require('./FormHeading'),
	Toolbar = require('./Toolbar'),
	InvalidFieldType = require('./InvalidFieldType');

var EditForm = React.createClass({

	displayName: 'EditForm',

	getInitialState: function() {
		return {
			values: _.clone(this.props.data.fields)
		};
	},

	getFieldProps: function(field) {
		return assign({}, field, {
			value: this.state.values[field.path],
			values: this.state.values,
			onChange: this.handleChange,
			mode: 'edit',
		});
	},

	handleChange: function(event) {
		var values = this.state.values;
		values[event.path] = event.value;
		this.setState({
			values: values
		});
	},

	renderNameField: function() {

		var nameField = this.props.list.nameField,
			nameIsEditable = this.props.list.nameIsEditable;

		function wrapNameField(field) {
			return (
				<div className="field item-name">
					<div className="col-sm-12">
						{field}
					</div>
				</div>
			);
		}

		if (nameIsEditable) {

			var nameFieldProps = this.getFieldProps(nameField);
			nameFieldProps.className = 'item-name-field';
			nameFieldProps.placeholder = nameField.label;
			nameFieldProps.label = false;

			var fieldType = Fields[nameField.type];
			var FieldType = React.createElement(fieldType, nameFieldProps);

			return wrapNameField(FieldType);

		} else {
			return wrapNameField(
				<h2 className="form-heading name-value">{this.props.data.name || '(no name)'}</h2>
			);
		}
	},

	renderTrackingMeta: function() {

		if (!this.props.list.tracking) return null;

		var elements = {},
			data = {},
			label;


		function renderCreatedAt (props) {
			if (props.list.tracking.createdAt) {
				data.createdAt = props.data.fields[props.list.tracking.createdAt];
				if (data.createdAt) {
					return (
						<div className="item-details-meta-item">
							<span className="item-details-meta-label">Created</span>
							<span className="item-details-meta-info">{moment(data.createdAt).format('Do MMM YY h:mm:ssa')}</span>
						</div>
					);
				}
			}
		}

		function renderCreatedBy (props) {
			if (props.list.tracking.createdBy) {
				data.createdBy = props.data.fields[props.list.tracking.createdBy];
				if (data.createdBy) {
					label = data.createdAt ? 'by' : 'Created by';
					// todo: harden logic around user name
					return (
						<div className="item-details-meta-item">
							<span className="item-details-meta-label">{label}</span>
							<span className="item-details-meta-info">{data.createdBy.name.first} {data.createdBy.name.last}</span>
						</div>
					);
				}
			}
		}

		function renderUpdatedAt (props) {
			if (props.list.tracking.updatedAt) {
				data.updatedAt = props.data.fields[props.list.tracking.updatedAt];
				if (data.updatedAt && (!data.createdAt || data.createdAt !== data.updatedAt)) {
					return (
						<div className="item-details-meta-item">
							<span className="item-details-meta-label">Updated</span>
							<span className="item-details-meta-info">{moment(data.updatedAt).format('Do MMM YY h:mm:ssa')}</span>
						</div>
					);
				}
			}
		}

		function renderUpdatedBy(props) {
			if (props.list.tracking.updatedBy) {
				data.updatedBy = props.data.fields[props.list.tracking.updatedBy];
				if (data.updatedBy && (!data.createdBy || data.createdBy.id !== data.updatedBy.id || elements.updatedAt)) {
					label = data.updatedAt ? 'by' : 'Created by';
					return (
						<div className="item-details-meta-item">
							<span className="item-details-meta-label">{label}</span>
							<span className="item-details-meta-info">{data.updatedBy.name.first} {data.updatedBy.name.last}</span>
						</div>
					);
				}
			}
		}

		return Object.keys(elements).length
			? (
				<div className="item-details-meta">
					{this.renderCreatedAt(this.props)}
					{this.renderCreatedBy(this.props)}
					{this.renderUpdatedAt(this.props)}
					{this.renderUpdatedBy(this.props)}
				</div>
			)
			: null;

	},

	renderFormElements: function() {

		var list = this.props.list,
			elements = [],
			headings = 0,
			_this = this;

		function renderHeading(el) {
				headings++;
				el.options.values = _this.state.values;

				return React.createElement(FormHeading, el);
				// elements['h-' + headings] = React.createElement(FormHeading, el);

		};

		return _.each(list.uiElements, function (el) {
			if (el.type === 'heading') return renderHeading(el);

		});

		_.each(list.uiElements, function(el) {

			if (el.type === 'heading') {

				headings++;
				el.options.values = this.state.values;
				elements['h-' + headings] = React.createElement(FormHeading, el);

			} else if (el.type === 'field') {

				var field = list.fields[el.field],
					props = this.getFieldProps(field);


				if ('function' !== typeof Fields[field.type]) {
					elements[field.path] = React.createElement(InvalidFieldType, { type: field.type, path: field.path });
					return;
				}

				if (props.dependsOn) {
					props.currentDependencies = {};
					Object.keys(props.dependsOn).forEach(function (dep) {
						props.currentDependencies[dep] = this.state.values[dep];
					}, this);
				}

				elements[field.path] = React.createElement(Fields[field.type], props);

			}

		}, this);

		console.log('elements', elements)

		return elements;

	},

	renderToolbar: function() {

		function renderSaveAndReset (props) {
			return !props.list.noedit && (
				<div>
					<button type="submit" className="btn btn-save">Save</button>
					<a
						href={'/keystone/' + props.list.path + '/' + props.data.id}
						className="btn btn-link btn-cancel"
						data-confirm="Are you sure you want to reset your changes?">
						reset changes
					</a>
		    </div>
			);
		};

		function renderDelete (props) {
			return !props.list.noedit && !props.list.nodelete && (
				<a
					href={'/keystone/' + props.list.path + '?delete=' + props.data.id + Keystone.csrf.query}
					className="btn btn-link btn-cancel delete"
					data-confirm={'Are you sure you want to delete this?' + props.list.singular.toLowerCase()}>
					delete {props.list.singular.toLowerCase()}
				</a>
			);
		}

		return (
			<Toolbar className="toolbar">
				{renderSaveAndReset(this.props)}
				{renderDelete(this.props)}
			</Toolbar>
		);

	},

	render: function() {
		return (
			<div>
				{this.renderNameField()}
				{this.renderTrackingMeta()}
				{this.renderFormElements()}
				{this.renderToolbar()}
	   </div>
	 );
		// return (
		// 	<form method="post" encType="multipart/form-data" className="item-details">
		// 		<input type="hidden" name="action" value="updateItem" />
		// 		<input type="hidden" name={Keystone.csrf.key} value={Keystone.csrf.value} />
		// 		{this.renderNameField()}
		// 		{this.renderTrackingMeta()}
		// 		{this.renderFormElements()}
		// 		{this.renderToolbar()}
		// 	</form>
		// );
	}

});

module.exports = EditForm;

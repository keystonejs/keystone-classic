var React = require('react');
var $ = require('jquery'); //Scope jquery for tablesaw.
var tablesaw = require('./lib/tablesaw.stackonly');
var Field = require('../Field');
var _ = require('underscore');

var nextIndex = 0;
var deleted = 0;

/**
 * createRow creates an object representing a new row
 * @param {Object} value
 * @returns {{key: string, value: *, index: number}}
 */
function createRow(value, state) {

	var rowset = {key: 'row' + nextIndex, value: value, index: nextIndex};
	nextIndex++;
	return rowset;

}

/**
 *
 * TableField provides a basic spreadsheet like field.
 *
 * @todo Adding support for nested fields would be nice.
 * @extends {Field}
 *
 *
 */
module.exports = Field.create({

	getInitialState: function () {
		return {
			values: this.props.value.map(createRow),
		};
	},

	/**
	 * addRow adds a new blank row to the table.
	 * @param columns
	 * @returns {function(this:exports)}
	 */
	addRow: function (columns) {

		return function () {

			var blankRow = {};

			_.forEach(columns, function (column) {
				blankRow[column.name] = '';
			});

			var newRow = this.state.values.concat(createRow(blankRow));

			this.setState({
				values: newRow
			}, function () {
				this.valueChanged(_.pluck(newRow, 'value'));
			});


		}.bind(this);
	},
	/**
	 * removeRow removes a row from the table.
	 * @param {Object} rowset
	 */
	removeRow: function (rowset) {

		var newValues = _.without(this.state.values, rowset);

		this.setState({
			values: newValues,
		}, function () {

			deleted++;
			this.valueChanged(_.pluck(newValues, 'value'));

		}.bind(this));


	},
	valueChanged: function (values) {

		this.props.onChange({
			path: this.props.path,
			value: values
		});
	},
	updateItem: function (column, row, rowset, event) {


		row[column.name] = this.cleanInput ? this.cleanInput(event.target.value) : event.target.value;

		this.setState({
			row: row
		}, function () {


		});

	},
	/**
	 *
	 * renderTableHeading renders a static table headings.
	 * @return {JSX}
	 *
	 */
	renderTableHeading: function (column) {
		return (
			<th key={'column-called-' + column.name} data-tablesaw-sortable-col data-tablesaw-priority="persist">{column.name}</th>
		);

	},
	/**
	 * renderTableHeader will render the header section of the table.
	 * @return {JSX}
	 */
	renderTableHeader: function (isEditable) {

		var btn = '';

		if (isEditable)
			btn = (
				<td>
					<button type="button" className='btn btn-xs btn-default' onClick={this.addRow(this.props.columns)}>Add Row</button>
				</td>
			);

		return (
			<thead>
				<tr data-tablesaw-priority="persist">
					<td>#</td>
					{this.props.columns.map(this.renderTableHeading)}
					{btn}
				</tr>
			</thead>
		);
	},
	/**
	 * renderValueCell renders a single uneditable cell.
	 * @param {Object} column
	 * @param {Object} row
	 * @param {Object} rowset
	 * @returns {JSX}
	 */
	renderValueCell: function (column, row, rowset) {

		return (<td key={column.name + rowset.index}>{row[column.name]}</td>);


	},
	/**
	 * renderFieldCell renders a single editable cell.
	 * @param {Object} column
	 * @param {Object} row
	 * @param {Object} rowset
	 * @returns {JSX}
	 */
	renderFieldCell: function (column, row, rowset) {

		return (
			<td key={column.name + rowset.index}>
				<input ref={'input_row_' + column.name + rowset.index}
					onChange={this.updateItem.bind(this, column, row, rowset)}
					className='form-control multi' value={row[column.name]}
					name={this.props.path + '[' + rowset.index + '][' + column.name + ']'} />
			</td>
		);

	},

	/**
	 * renderRow renders an entire row
	 * @param {Boolean} isEditable
	 * @returns {Function}
	 */
	renderRow: function (isEditable) {

		return function (rowset) {

			var html = [];
			var func = (isEditable) ? this.renderFieldCell : this.renderValueCell;
			var row = rowset.value;
			var index = rowset.index;

			_.forEach(this.props.columns, function (column) {

				html.push(func(column, row, rowset));

			}.bind(this));

			if (isEditable)
				html.push((
					<td key={rowset.key+'delete-button'}>
						<a href="javascript:;"
							className='btn btn-default btn-cancel'
							onClick={this.removeRow.bind(this, rowset)}>&times;</a>
					</td>
				));
			return (
				<tr key={rowset.key}>
					<td>{rowset.index + 1}</td>
				    {html}

				</tr>
			);
		}.bind(this);
	},
	renderValue: function () {
		return (
			<div>
				<table className="table tablesaw tablesaw-stack table-bordered" data-tablesaw-mode="stack">
					{this.renderTableHeader(false)}
					<tbody>
						{this.state.values.map(this.renderRow(false))}
					</tbody>
					<tfoot>
					</tfoot>
				</table>
			</div>
		);
	},
	renderField: function () {
		return (
			<div>
				<table className="table tablesaw tablesaw-stack table-bordered" data-tablesaw-mode="stack">
					{this.renderTableHeader(true)}
					<tbody>
						{this.state.values.map(this.renderRow(true))}
					</tbody>
					<tfoot>
					</tfoot>
				</table>
			</div>
		);
	}
});

var React = require('react');
var $ = require('jquery'); //Scope jquery for tablesaw.
var tablesaw = require('./lib/tablesaw.stackonly');
var Field = require('../Field');

/**
 *
 * TableField provides a read-only table for array subdocuments.
 *
 * Each field is expected to be a primitive and there is no 
 * support for nesting or complex objects.
 *
 * @extends {Field}
 *
 *
 */
module.exports = Field.create({

  getRow : function(row) {

    return function(column) {

      return (<td>{row[column.name]}</td>);

    };

  },

  /**
   *
   * renderTableHeading renders the table headings.
   *
   */
  renderTableHeading: function(column) {
    return (
      <th data-tablesaw-sortable-col data-tablesaw-priority="persist">{column.name}</th>
    );

  },

  /**
   *
   * renderTableRow renders the data as a row in a table.
   *
   */
  renderTableRow: function(row) {
    return (
      <tr>{this.props.columns.map(this.getRow(row))}</tr>
    );

  },
  renderField: function () {
    return (
      <table className="table tablesaw tablesaw-stack" data-tablesaw-mode="stack">
        <thead>
          <tr>
            {this.props.columns.map(this.renderTableHeading)}
          </tr>
        </thead>
        <tbody>
          {this.props.value.map(this.renderTableRow)}
        </tbody>
      </table>
    );
  }
});

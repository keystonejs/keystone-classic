var React = require('react');
var tablesaw = require('tablesaw/dist/tablesaw.js');
var Field = require('../field');

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

  /**
   *
   * renderTableHeading renders the table headings.
   *
   */
  renderTableHeading: function(heading) {
    return (
      <th scope="col" data-tablesaw-sortable-col data-tablesaw-priority="persist">{heading.name}</th>
    );

  },

  renderField: function () {
    return (
      <table class="tablesaw tablesaw-stack" data-tablesaw-mode="stack">
        <thead>
          <tr>
            {this.props.columns.map(this.renderTableHeading)}
          </tr>
        </thead>
      </table>
    );
  }
});

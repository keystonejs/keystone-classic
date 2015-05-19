var React = require('react');
var Columns = require('../columns');

var Table = React.createClass({
	
	displayName: 'ListTable',

	renderCols: function() {
		return Keystone.columns.map(function(col) {
			if (col.width) {
				return <col width={col.width} key={col.path} />;
			} else {
				return <col key={col.path} />;
			}
		});
	},

	renderHeaders: function() {
		var cells = Keystone.columns.map(function(col) {
			return <th key={col.path}>{col.label}</th>;
		});
		return <thead>{cells}</thead>;
	},

	renderRow: function(item) {
		var cells = Keystone.columns.map(function(col) {
			var ColumnType = Columns[col.type] || Columns.__unrecognised__;
			return <ColumnType key={col.path} list={Keystone.list} col={col} data={item} />;
		});
		return <tr>{cells}</tr>;
	},
	
	render: function() {
		var sortable = Keystone.list.sortable;
		var tableClass = sortable ? 'sortable ' : '';
		tableClass += 'table items-list';
		return (
			<div className="items-list-wrapper">
				<table cellpadding="0" cellspacing="0" className={tableClass}>
					{this.renderCols()}
					{this.renderHeaders()}
					{Keystone.items.results.map(this.renderRow)}
				</table>
			</div>
		);
	}
	
});

var target = document.getElementById('list-view-table');
if (target) {
	React.render(<Table />, target);
}

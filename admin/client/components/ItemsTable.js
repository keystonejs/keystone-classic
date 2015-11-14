'strict'

import React from 'react';
import classnames from 'classnames';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import Columns from '../columns';
import CurrentListStore from '../stores/CurrentListStore';
import ListControl from './ListControl';
import TableRow from './ItemsTableRow'

const CONTROL_COLUMN_WIDTH = 26;  // icon + padding


const ItemsTable = React.createClass({
	propTypes: {
		columns: React.PropTypes.array,
		items: React.PropTypes.object,
		list: React.PropTypes.object
	},
	renderCols () {
		var cols = this.props.columns.map((col) => <col width={col.width} key={col.path} />);
		// add delete col when applicable
		if (!this.props.list.nodelete) {
			cols.unshift(<col width={CONTROL_COLUMN_WIDTH} key="delete" />);
		}
		// add sort col when applicable
		if (this.props.list.sortable) {
			cols.unshift(<col width={CONTROL_COLUMN_WIDTH} key="sortable" />);
		}
		return <colgroup width={CONTROL_COLUMN_WIDTH}>{cols}</colgroup>;
	},
	renderHeaders () {
		var cells = this.props.columns.map((col, i) => {
			// span first col for controls when present
			var span = 1;
			if (!i) {
				if (this.props.list.sortable) span++;
				if (!this.props.list.nodelete) span++;
			}
			return <th key={col.path} colSpan={span}>{col.label}</th>;
		});
		return <thead><tr>{cells}</tr></thead>;
	},
	render () {
		if (!this.props.items.results.length) return null;
		const Row = this.props.list.sortable ? TableRow.Sortable : TableRow
		return (
			<div className="ItemList-wrapper">
				<table cellPadding="0" cellSpacing="0" className="Table ItemList">
					{this.renderCols()}
					{this.renderHeaders()}
					<tbody >
						{this.props.items.results.map((item, i) => { 
							return (
								<Row key={item.id}
									index={i}
									sortOrder={item.sortOrder || 0}
									id={item.id}
									item={item}
									{ ...this.props }
								/>
							);
						})}
					</tbody>
				</table>
			</div>
		);
	}
});

module.exports = exports = ItemsTable;

exports.Sortable = DragDropContext(HTML5Backend)(ItemsTable);

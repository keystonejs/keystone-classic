import React from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { Sortable } from './ItemsTableRow';
import DropZone from './ItemsTableDragDropZone';

var ItemsTableDragDrop = React.createClass({
	displayName: 'ItemsTableDragDrop',
	propTypes: {
		columns: React.PropTypes.array,
		id: React.PropTypes.any,
		index: React.PropTypes.number,
		items: React.PropTypes.object,
		list: React.PropTypes.object,
	},
	render () {
		return (
			<tbody >
				{this.props.items.results.map((item, i) => {
					return (
						<Sortable key={item.id}
							index={i}
							sortOrder={item.sortOrder || 0}
							id={item.id}
							item={item}
							{...this.props}
						/>
					);
				})}
				<DropZone {...this.props} />
			</tbody>
		);
	},
});

module.exports = DragDropContext(HTML5Backend)(ItemsTableDragDrop);

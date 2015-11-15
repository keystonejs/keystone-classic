import React from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { Sortable } from './ItemsTableRow';
import DropZone from './ItemsTableDragDropZone';

import CurrentListStore from '../stores/CurrentListStore';
import classnames from 'classnames';

var ItemsTableDragDrop = React.createClass({
	displayName: 'ItemsTableDragDrop',
	propTypes: {
		columns: React.PropTypes.array,
		items: React.PropTypes.object,
		list: React.PropTypes.object,
		index: React.PropTypes.number,
		id: React.PropTypes.any
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
							{ ...this.props }
						/>
					);
				})}
				<DropZone { ...this.props } />
			</tbody>
		);
	}
});

module.exports = DragDropContext(HTML5Backend)(ItemsTableDragDrop);

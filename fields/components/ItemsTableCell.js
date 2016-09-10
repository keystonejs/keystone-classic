import React from 'react';
import classnames from 'classnames';

function ItemsTableCell ({ className, ...props }) {
	props.className = classnames('ItemList__col', className);

	return <td {...props} />;
};

module.exports = ItemsTableCell;

var React = require('react');

var S3FileColumn = React.createClass({
	render: function () {
		var value = this.props.data.fields[this.props.col.path];
		var isVal = value.url ? value.url : null;
		return (
			<td className="ItemList__col">
				<div className="ItemList__value ItemList__value--s3-file"><a href={isVal} target="_blank">{isVal}</a></div>
			</td>
		);
	},
});

module.exports = S3FileColumn;

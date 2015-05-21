var React = require('react');

var UrlColumn = React.createClass({

	renderValue: function() {
		var value = this.props.data.fields[this.props.col.path];
		if (!value) return;

		// if the value doesn't start with a prototcol, assume http for the href
		var href = value;
		if (href && !/^(mailto\:)|(\w+\:\/\/)/.test(href)) {
			href = 'http://' + value;
		}

		// strip the protocol from the link if it's http(s)
		var label = value.replace(/^https?\:\/\//i, '');

		return <a href={href} target="_blank">{label}</a>;
	},

	render: function() {
		return (
			<td>
				<div className="ItemList__col-value">{this.renderValue()}</div>
			</td>
		);
	}
	
});

module.exports = UrlColumn;

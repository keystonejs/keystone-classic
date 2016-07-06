const React = require('react');
const ReactDOM = require('react-dom');

const Types = {
	Text: {
		Field: require('../types/text/TextField'),
		Filter: require('../types/text/TextFilter'),
		spec: {
			label: 'Text Field',
			path: 'textField',
		},
	},
};

const Field = React.createClass({
	render () {
		const FieldComponent = Types[this.props.type].Field;
		const FilterComponent = Types[this.props.type].Filter;
		const spec = Types[this.props.type].spec;
		return (
			<div>
				<h2>{this.props.type}</h2>
				<h3>Field</h3>
				<FieldComponent path={spec.path} onChange={(e) => console.log(e)} />
				<h3>Filter</h3>
				<FilterComponent field={spec} onChange={(e) => console.log(e)} />
			</div>
		);
	},
});

ReactDOM.render(
	<div>
		<h1>Fields Explorer</h1>
		<Field type="Text" />
	</div>,
	document.getElementById('explorer')
);

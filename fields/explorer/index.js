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
		value: '',
	},
};

const FieldType = React.createClass({
	getInitialState () {
		return {
			fieldValue: Types[this.props.type].value,
			filterValue: {},
		};
	},
	onFieldChange (e) {
		console.log(`${this.props.type} field value changed:`, e.value);
		this.setState({
			value: e.value,
		});
	},
	onFilterChange (value) {
		console.log(`${this.props.type} filter value changed:`, value);
		this.setState({
			filter: value,
		});
	},
	render () {
		const FieldComponent = Types[this.props.type].Field;
		const FilterComponent = Types[this.props.type].Filter;
		const spec = Types[this.props.type].spec;
		return (
			<div className="ExplorerField">
				<h2>{this.props.type}</h2>
				<h3>Field</h3>
				<FieldComponent path={spec.path} onChange={this.onFieldChange} value={this.state.value} />
				<h3>Filter</h3>
				<FilterComponent field={spec} onChange={this.onFilterChange} filter={this.state.filter} />
			</div>
		);
	},
});

ReactDOM.render(
	<div>
		<h1>Fields Explorer</h1>
		<FieldType type="Text" />
	</div>,
	document.getElementById('explorer')
);

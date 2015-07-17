var classNames = require('classnames');
var React = require('react');

var { FormField, FormInput } = require('elemental');

var TextFilter = React.createClass({

	getInitialState () {
		return {
			inverted: false,
			mode: 'partial', // 'match'
			value: ''
		};
	},

	toggleMode (mode) {
		this.setState({ mode: mode });
	},

	renderMode () {
		var containClass = classNames('popout__toggle__action', { 'is-selected': this.state.mode === 'partial' });
		var matchClass = classNames('popout__toggle__action', { 'is-selected': this.state.mode === 'match' });
		return (
			<div className="popout__toggle">
				<span className="popout__toggle__item">
					<button type="button" onClick={(e) => { this.toggleMode('partial'); }} className={containClass}>Contains</button>
				</span>
				<span className="popout__toggle__item">
					<button type="button" onClick={(e) => { this.toggleMode('match'); }} className={matchClass}>Matches</button>
				</span>
			</div>
		);
	},

	render () {
		// return <div>hello</div>;
		return (
			<div>
				<FormField>
					<label>
						<input type="checkbox" />
						<span> Invert this filter</span>
					</label>
				</FormField>
				{this.renderMode()}
				<FormField>
					<FormInput ref="input" placeholder="Text" />
				</FormField>
			</div>
		);
	}

});

module.exports = TextFilter;

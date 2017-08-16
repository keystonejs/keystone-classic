import { css } from 'glamor';
import React, { Component, PropTypes } from 'react';

import classes from './styles';

class FormSelect extends Component {
	render () {
		const { children, id, options, ...props } = this.props;
		const { formFieldId } = this.context;

		props.className = css(
			classes.select,
			props.disabled ? classes['select--disabled'] : null
		);
		props.id = id || formFieldId;

		// Property Violation
		if (options && children) {
			console.error('Warning: FormSelect cannot render `children` and `options`. You must provide one or the other.');
		}

		return (
			<div className={css(classes.container)}>
				{options ? (
					<select {...props}>{options.map(opt => (
						<option key={opt.value} value={opt.value}>
							{opt.label}
						</option>
					))}
					</select>
				) : <select {...props}>{children}</select>}
				<span className={css(classes.arrows, props.disabled ? classes['arrows--disabled'] : null)}>
					<span className={css(classes.arrow, classes.arrowTop)} />
					<span className={css(classes.arrow, classes.arrowBottom)} />
				</span>
			</div>
		);
	}
};

FormSelect.contextTypes = {
	formFieldId: PropTypes.string,
};
FormSelect.propTypes = {
	onChange: PropTypes.func.isRequired,
	options: React.PropTypes.arrayOf(
		React.PropTypes.shape({
			label: React.PropTypes.string,
			value: React.PropTypes.string,
		})
	),
	value: PropTypes.oneOfType([
		PropTypes.number,
		PropTypes.string,
	]),
};

module.exports = FormSelect;

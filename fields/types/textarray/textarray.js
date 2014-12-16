var _ = require('underscore'),
	Field = require('../field'),
	React = require('react');

module.exports = Field.create({
	getInitialState: function () {
		return {
			value: this.props.value
		};
	},

	addItem: function () {
		this.state.value.push("");
		this.forceUpdate();
	},

	removeItem: function (i) {
		this.state.value.splice(i, 1);
		this.forceUpdate();
	},

	renderField: function () {
		var self = this;

		return <div>
			{this.state.value.map(function (value, i) {
				return <div key={self.props.path + '-' + i} className='field-item'>
					<input className='form-control multi' type='text' name={self.props.path} defaultValue={value} autoComplete='off' />
					<a className='btn btn-link btn-cancel btn-remove-item' onClick={self.removeItem.bind(self, i)}>
						<span className='ion-close-round' />
					</a>
				</div>;
			})}
			<a className='btn btn-xs btn-default btn-add-item' onClick={this.addItem}>Add item</a>
		</div>;
	}
});

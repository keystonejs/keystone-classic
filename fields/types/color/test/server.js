var demand = require('must');
var ColorType = require('../ColorType');

exports.initList = function (List) {
	List.add({
		color: { type: ColorType },
		nested: {
			color: { type: ColorType },
		},
	});
};

exports.createData = function (List) { // eslint-disable-line no-unused-vars

};

exports.testFilters = function (List) { // eslint-disable-line no-unused-vars

};

exports.testFieldType = function (List) {
	var testItem = new List.model();

	it('should update top level fields', function (done) {
		List.fields.color.updateItem(testItem, {
			color: '#ffffff',
		}, function () {
			demand(testItem.color).be('#ffffff');
			testItem.color = undefined;
			done();
		});
	});

	it('should update nested fields', function (done) {
		List.fields['nested.color'].updateItem(testItem, {
			nested: {
				color: '#ffffff',
			},
		}, function () {
			demand(testItem.nested.color).be('#ffffff');
			testItem.nested.color = undefined;
			done();
		});
	});

	it('should update nested fields with flat paths', function (done) {
		List.fields['nested.color'].updateItem(testItem, {
			'nested.color': '#ffffff',
		}, function () {
			demand(testItem.nested.color).be('#ffffff');
			testItem.nested.color = undefined;
			done();
		});
	});

	it('should validate string input', function (done) {
		// require the validators at the top of the document so we can access them
		List.fields.color.validateInput({ color: 'a' }, function (result) {
			demand(result).be(true);
			done();
		});
	});

	it('should validate undefined input', function (done) {
		// require the validators at the top of the document so we can access them
		List.fields.color.validateInput({}, function (result) {
			demand(result).be(true);
			done();
		});
	});

	it('should invalidate numeric input', function (done) {
		// require the validators at the top of the document so we can access them
		List.fields.color.validateInput({ color: 1 }, function (result) {
			demand(result).be(false);
			done();
		});
	});

	it('should invalidate object input', function (done) {
		// require the validators at the top of the document so we can access them
		List.fields.color.validateInput({ color: { things: 'stuff' } }, function (result) {
			demand(result).be(false);
			done();
		});
	});

	it('should invalidate array input', function (done) {
		// require the validators at the top of the document so we can access them
		List.fields.color.validateInput({ color: [1, 2, 3] }, function (result) {
			demand(result).be(false);
			done();
		});
	});

	it('should invalidate Boolean input', function (done) {
		// require the validators at the top of the document so we can access them
		List.fields.color.validateInput({ color: true }, function (result) {
			demand(result).be(false);
			done();
		});
	});

	it('should invalidate function input', function (done) {
		// require the validators at the top of the document so we can access them
		List.fields.color.validateInput({ color: function () {} }, function (result) {
			demand(result).be(false);
			done();
		});
	});

	it('should invalidate regexp input', function (done) {
		// require the validators at the top of the document so we can access them
		List.fields.color.validateInput({ color: /foo/ }, function (result) {
			demand(result).be(false);
			done();
		});
	});

	it('should invalidate date input', function (done) {
		// require the validators at the top of the document so we can access them
		List.fields.color.validateInput({ color: Date.now() }, function (result) {
			demand(result).be(false);
			done();
		});
	});

	it('should invalidate null input', function (done) {
		// require the validators at the top of the document so we can access them
		List.fields.color.validateInput({ color: null }, function (result) {
			demand(result).be(false);
			done();
		});
	});


	it('should validate input present', function (done) {
		List.fields.color.validateRequiredInput(this, { color: 'a' }, function (result) {
			demand(result).be(true);
			done();
		});
	});

	it('should invalidate input not present', function (done) {
		List.fields.color.validateRequiredInput(this, { color: '' }, function (result) {
			demand(result).be(false);
			done();
		});
	});
};

var demand = require('must');

exports.initList = function (List) {
	List.add({
		text: String,
		nested: {
			text: String,
		},
		maxChar: {
			type: String,
			max: 55,
		},
		minChar: {
			type: String,
			min: 10,
		},
	});
};

exports.testFieldType = function (List) {
	describe('updateItem', function () {
		it('should update top level fields', function (done) {
			var testItem = new List.model();
			List.fields.text.updateItem(testItem, {
				text: 'value',
			}, function () {
				demand(testItem.text).be('value');
				done();
			});
		});

		it('should update nested fields', function (done) {
			var testItem = new List.model();
			List.fields['nested.text'].updateItem(testItem, {
				nested: {
					text: 'value',
				},
			}, function () {
				demand(testItem.nested.text).be('value');
				done();
			});
		});

		it('should truncate text with a length', function () {
			var testItem = new List.model({
				text: 'hello world',
			});
			demand(testItem._.text.crop(8)).be('hello wo');
		});

		it('should update nested fields with flat paths', function (done) {
			var testItem = new List.model();
			List.fields['nested.text'].updateItem(testItem, {
				'nested.text': 'value',
			}, function () {
				demand(testItem.nested.text).be('value');
				done();
			});
		});
	});

	describe('validateInput', function () {
		it('should validate string input', function (done) {
			List.fields.text.validateInput({ text: 'a' }, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should validate emtpy string input', function (done) {
			List.fields.text.validateInput({ text: '' }, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should validate undefined input', function (done) {
			List.fields.text.validateInput({}, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should validate null input', function (done) {
			List.fields.text.validateInput({ text: null }, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should invalidate numeric input', function (done) {
			List.fields.text.validateInput({ text: 1 }, function (result) {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate object input', function (done) {
			List.fields.text.validateInput({ text: { things: 'stuff' } }, function (result) {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate array input', function (done) {
			List.fields.text.validateInput({ text: [1, 2, 3] }, function (result) {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate Boolean input', function (done) {
			List.fields.text.validateInput({ text: true }, function (result) {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate function input', function (done) {
			List.fields.text.validateInput({ text: function () {} }, function (result) {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate regexp input', function (done) {
			List.fields.text.validateInput({ text: /foo/ }, function (result) {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate date input', function (done) {
			List.fields.text.validateInput({ text: Date.now() }, function (result) {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate string over max characters', function (done) {
			List.fields.maxChar.validateInput({ maxChar: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit' }, function (result) {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate string shorter than min characters', function (done) {
			List.fields.minChar.validateInput({ minChar: 'Short' }, function (result) {
				demand(result).be.false();
				done();
			});
		});

	});

	describe('validateRequiredInput', function () {
		it('should validate input present', function (done) {
			var testItem = new List.model();
			List.fields.text.validateRequiredInput(testItem, { text: 'a' }, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should invalidate undefined', function (done) {
			var testItem = new List.model();
			List.fields.text.validateRequiredInput(testItem, { text: undefined }, function (result) {
				demand(result).be.false();
				done();
			});
		});

		it('should validate undefined if a previous value exists', function (done) {
			var testItem = new List.model({
				text: 'a',
			});
			List.fields.text.validateRequiredInput(testItem, { text: undefined }, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should invalidate empty string', function (done) {
			var testItem = new List.model();
			List.fields.text.validateRequiredInput(testItem, { text: '' }, function (result) {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate null', function (done) {
			var testItem = new List.model();
			List.fields.text.validateRequiredInput(testItem, { text: null }, function (result) {
				demand(result).be.false();
				done();
			});
		});
	});

	describe('addFilterToQuery', function () {
		it('should return a regex with the "i" flag set', function () {
			var result = List.fields.text.addFilterToQuery({
				value: 'abc',
			});
			demand(result.text).eql(/abc/i);
		});

		it('should allow case sensitive matching', function () {
			var result = List.fields.text.addFilterToQuery({
				value: 'abc',
				caseSensitive: true,
			});
			demand(result.text).eql(/abc/);
		});

		it('should allow inverted matching', function () {
			var result = List.fields.text.addFilterToQuery({
				value: 'abc',
				inverted: true,
			});
			demand(result.text).eql({
				$not: /abc/i,
			});
		});

		it('should allow exact matching', function () {
			var result = List.fields.text.addFilterToQuery({
				value: 'abc',
				mode: 'exactly',
			});
			demand(result.text).eql(/^abc$/i);
		});

		it('should allow matching the end', function () {
			var result = List.fields.text.addFilterToQuery({
				value: 'abc',
				mode: 'endsWith',
			});
			demand(result.text).eql(/abc$/i);
		});

		it('should allow matching the start', function () {
			var result = List.fields.text.addFilterToQuery({
				value: 'abc',
				mode: 'beginsWith',
			});
			demand(result.text).eql(/^abc/i);
		});

		it('should allow matching empty values in exact mode', function () {
			var result = List.fields.text.addFilterToQuery({
				mode: 'exactly',
			});
			demand(result.text).eql({
				$in: ['', null],
			});
		});

		it('should allow matching non-empty values in exact mode with the inverted option', function () {
			var result = List.fields.text.addFilterToQuery({
				mode: 'exactly',
				inverted: true,
			});
			demand(result.text).eql({
				$nin: ['', null],
			});
		});
	});
};

var demand = require('must');

exports.initList = function (List) {
	List.add({
		datetime: Date,
		nested: {
			datetime: Date,
		},
	});
};

exports.testFieldType = function (List) {
	var testItem = new List.model();

	it('should get input from data', function () {
		var value = List.fields.datetime.getInputFromData({
			datetime: '2016-02-25 04:45:00',
		});
		demand(value).to.equal('2016-02-25 04:45:00');
	});

	it('should get nested input from data', function () {
		var value = List.fields['nested.datetime'].getInputFromData({
			nested: { datetime: '2016-02-25 04:45:00' },
		});
		demand(value).to.equal('2016-02-25 04:45:00');
	});

	it('should get flat nested input from data', function () {
		var value = List.fields['nested.datetime'].getInputFromData({
			'nested.datetime': '2016-02-25 04:45:00',
		});
		demand(value).to.equal('2016-02-25 04:45:00');
	});

	it('should get split input from data', function () {
		var value = List.fields.datetime.getInputFromData({
			datetime_date: '2016-02-25',
			datetime_time: '04:45:00',
		});
		demand(value).to.equal('2016-02-25 04:45:00');
	});

	it('should get nested split input from data', function () {
		var value = List.fields['nested.datetime'].getInputFromData({
			nested: {
				datetime_date: '2016-02-25',
				datetime_time: '04:45:00',
			},
		});
		demand(value).to.equal('2016-02-25 04:45:00');
	});

	it('should get flat nested split input from data', function () {
		var value = List.fields['nested.datetime'].getInputFromData({
			'nested.datetime_date': '2016-02-25',
			'nested.datetime_time': '04:45:00',
		});
		demand(value).to.equal('2016-02-25 04:45:00');
	});

	it('should validate input present', function (done) {
		List.fields.datetime.validateRequiredInput(this, { datetime: 'a' }, function (result) {
			demand(result).be(true);
			done();
		});
	});

	it('should invalidate input not present', function (done) {
		List.fields.datetime.validateRequiredInput(this, { datetime: '' }, function (result) {
			demand(result).be(false);
			done();
		});
	});
};

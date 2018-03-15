import demand from 'must';
import { columnsParser, sortParser, filtersParser, filterParser, createFilterObject } from '../index';
import sinon from 'sinon';

describe('<List> query parsers', function () {
	beforeEach(function () {
		this.fields = {
			name: {
				path: 'name',
				paths: {
					first: 'name.first',
					last: 'name.last',
					full: 'name.full',
				},
				type: 'name',
				label: 'Name',
				size: 'full',
				required: true,
				hasFilterMethod: true,
				defaultValue: {
					first: '',
					last: '',
				},
			},
			email: {
				path: 'email',
				type: 'email',
				label: 'Email',
				size: 'full',
				required: true,
				defaultValue: {
					email: '',
				},
			},
		};

		this.currentList = {
			fields: this.fields,
			defaultColumns: { columns: '__DEFAULT_COLUMNS__' },
			defaultSort: { sort: '__DEFAULT_SORT__' },
			expandColumns: sinon.spy(),
			expandSort: sinon.spy(),
		};

		this.path = 'name';
		this.value = { value: 'a', mode: 'contains', inverted: false };
		this.filter = Object.assign({}, { path: this.path }, this.value);

	});
	describe('columnsParser()', function () {
		describe('If an empty columns array is added', function () {
			it('should call expandColumns with default columns', function () {
				const columns = [];
				columnsParser(columns, this.currentList);
				const result = this.currentList.expandColumns.getCall(0).args[0];

				demand(result).eql(this.currentList.defaultColumns);
			});
		});
		describe('If the input columns are undefined', function () {
			it('should call expandColumns with default columns', function () {
				const columns = void 0;
				columnsParser(columns, this.currentList);
				const result = this.currentList.expandColumns.getCall(0).args[0];

				demand(result).eql(this.currentList.defaultColumns);
			});
		});
		describe('If currentList does not exist', function () {
			it('throws an Error', function () {
				const columns = ['name', 'email'];
				let e = void 0;
				try {
					columnsParser(columns, null);
				} catch (error) {
					e = error;
				}
				demand(e.message).eql('No currentList selected');
			});
		});
	});

	describe('sortParser()', function () {
		describe('If no path is specified', function () {
			it('should return the default sort object', function () {
				const path = void 0;
				sortParser(path, this.currentList);
				const result = this.currentList.expandSort.getCall(0).args[0];

				demand(result).eql(this.currentList.defaultSort);
			});
		});
		describe('If currentList does not exist', function () {
			it('throws an Error', function () {
				const path = 'email';
				let e = void 0;
				try {
					sortParser(path, null);
				} catch (error) {
					e = error;
				}
				demand(e.message).eql('No currentList selected');
			});
		});
	});
	describe('createFilterObject()', function () {
		describe('If prvided with a valid path and a valid currentList', function () {
			it('returns an object with a field [object Object], and the passed in value', function () {
				const expectedFilter = this.currentList.fields[this.path];
				const expectedResult = { field: expectedFilter, value: this.value };
				demand(createFilterObject(this.path, this.value, this.currentList.fields)).eql(expectedResult);
			});
		});
		describe('If provided with an invalid path', function () {
			it('returns undefined', function () {
				const expectedResult = void 0;
				demand(createFilterObject(null, null, this.currentList)).eql(expectedResult);
			});
		});
		describe('If provided with an invalid currentListFields', function () {
			it('returns undefined', function () {
				const expectedResult = void 0;
				demand(createFilterObject(this.path, this.value, {})).eql(expectedResult);
			});
		});

		describe('If provided with a null value for currentListFields', function () {
			it('returns undefined', function () {
				const expectedResult = void 0;
				demand(createFilterObject(this.path, this.value, null)).eql(expectedResult);
			});
		});

		describe('If provided with any value that is not a plain object', function () {
			it('returns undefined', function () {
				const expectedResult = void 0;
				demand(createFilterObject(this.path, this.value, 'currentListFields')).eql(expectedResult);
			});
		});
	});

	describe('filtersParser()', function () {
		describe('Given no matching fields are found', function () {
			it('returns an empty array', function () {
				const invalidFilter = 'jemena';
				const expectedResult = [];
				const filters = [invalidFilter];
				demand(filtersParser(filters, this.currentList)).eql(expectedResult);
			});
		});
		describe('Given no filters are passed into the function', function () {
			it('returns an empty array', function () {
				const expectedResult = [];
				demand(filtersParser(null, this.currentList)).eql(expectedResult);
			});
		});
		describe('Given an array of filters', function () {
			it('returns an array of filters', function () {
				const filter = Object.assign(
					{},
					{ path: 'name' },
					this.value
				);

				const filters = [filter];
				const expectedResult = [{
					field: this.currentList.fields[filter.path],
					value: this.value,
				}];
				demand(filtersParser(filters, this.currentList)).eql(expectedResult);
			});
		});

		describe('Given a valid stringified filters array', function () {
			it('returns an array of filters', function () {
				const filter = Object.assign(
					{},
					{ path: 'name' },
					this.value
				);
				const filters = [filter];
				const stringifiedFilters = JSON.stringify(filters);

				const expectedResult = [{
					field: this.currentList.fields[filter.path],
					value: this.value,
				}];

				demand(filtersParser(stringifiedFilters, this.currentList)).eql(expectedResult);
			});
		});
		describe('If provided with an invalid stringified filters array', function () {
			it('returns an empty array', function () {
				const stringifiedFilters = 'jemena';
				const expectedResult = [];
				demand(filtersParser(stringifiedFilters, this.currentList)).eql(expectedResult);
			});
		});
	});

	describe('filterParser()', function () {
		beforeEach(function () {
			const firstEntry = { field: this.currentList.fields[this.path], value: this.value };
			const secondEntry = { field: this.currentList.fields.email, value: this.value };
			this.activeFilters = [firstEntry, secondEntry];
			this.addedFilter = { path: this.filter.path, value: this.value };
		});
		describe('Given a valid filter object with a path and value', function () {
			it('returns an expanded filter object', function () {
				const expectedResult = { field: this.currentList.fields[this.path], value: this.value };
				demand(filterParser(this.addedFilter, this.activeFilters, this.currentList)).eql(expectedResult);
			});
		});
		describe('Given that activeFilters is not an array', function () {
			it('throws an error', function () {
				const invalidActiveFilters = 'hello there';
				let e = void 0;
				try {
					filterParser(this.addedFilter, invalidActiveFilters, this.currentList);
				} catch (error) {
					e = error;
				}
				demand(e.message).eql('activeFilters must be an array');
			});
		});
		describe('Given that currentList is not a valid object', function () {
			it('throws an error', function () {
				let e = void 0;
				const invalidList = void 0;
				try {
					filterParser({}, this.activeFilters, invalidList);
				} catch (error) {
					e = error;
				}
				demand(e.message).eql('No currentList selected');
			});
		});
		describe('Given that the filter does not exist in activeFilters', function () {
			describe('Given that currentList is not an object of the shape that we expect', function () {
				it('returns undefined', function () {
					const expectedResult = void 0;
					const badList = {
						someKey: 'some value',
						someOtherKey: 'some other value',
					};
					demand(filterParser(this.addedFilter, [], badList)).eql(expectedResult);
				});
			});
		});
	});
});

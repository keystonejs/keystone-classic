import demand from 'must';
import {
	stringifyColumns,
	parametizeFilters,
	checkForQueryChange,
	normaliseValue,
} from '../queryParams';

describe('client utils', () => {
	describe('checkForQueryChange()', function () {
		describe('Given valid nextProps and thisProps', function () {
			describe('If nextProps.location.pathname is not the same as thisProps.location.pathname', function () {
				it('returns true', function () {
					const thisLocation = { pathname: '', query: {} };
					const active = { cachedQuery: {} };
					const newLocation = { pathname: '/hello', query: {} };
					const thisProps = { location: thisLocation };
					const nextProps = { location: newLocation, active };
					const expectedResult = true;
					const result = checkForQueryChange(nextProps, thisProps);

					demand(result).eql(expectedResult);
				});
			});
			describe('If the nextProps.active.cachedQuery sans search, is not the same as the nextProps.location.query sans search', function () {
				it('returns true', function () {
					const active = { cachedQuery: { filter: ['old Filter'], search: 'hello' } };
					const query = { filter: ['new Filter'], search: 'nein' };
					const location = { pathname: '/', query };
					const nextProps = { location, active };
					const thisProps = { location };
					const expectedResult = true;
					const result = checkForQueryChange(nextProps, thisProps);

					demand(result).eql(expectedResult);
				});
			});
			describe('If the nextProps.location.pathname is the same as thisProps.location.pathname, and the query is the same as the cached query', function () {
				it('returns false', function () {
					const active = { cachedQuery: {} };
					const location = { pathname: '/', query: {} };
					const nextProps = { location, active };
					const thisProps = { location };
					const expectedResult = false;
					const result = checkForQueryChange(nextProps, thisProps);

					demand(result).eql(expectedResult);
				});
			});
		});
	});

	describe('normaliseValue', function () {
		describe('If the value is the same as the benchmark', function () {
			it('returns undefined', function () {
				const value = 1;
				const benchmark = 1;
				const result = normaliseValue(value, benchmark);
				const expectedResult = void 0;

				demand(result).eql(expectedResult);
			});
		});
		describe('If the value is not the same as the benchmark', function () {
			it('returns the value', function () {
				const value = 1;
				const benchmark = 3;
				const result = normaliseValue(value, benchmark);

				demand(result).eql(value);
			});
		});
	});

	describe('stringifyColumns()', () => {
		const columns = [{ path: 'someColumn' }, { path: 'someOtherColumn' }];
		const defaultPathString = 'someColumn,someOtherColumn';
		it('should return if no columns are passed in', () => {
			demand(stringifyColumns()).eql(undefined);
		});
		it('should return a string of column names separated by commas from the object', () => {
			demand(stringifyColumns(columns)).eql(defaultPathString);
		});
		it('should return undefined if the column string and defaultColumnPaths match', () => {
			demand(stringifyColumns(columns, defaultPathString)).eql(undefined);
		});
	});

	describe('parametizeFilters()', () => {
		const singleFilter = {
			field: {
				path: 'fieldName',
				otherProp: 'name',
			},
			value: {
				valueOne: 1,
				valueTwo: 2,
				valueThree: 3,
			},
		};
		it('should return undefined if nothing is passed in', () => {
			demand(parametizeFilters()).eql(undefined);
		});
		it('should return undefined if an empty array is provided', () => {
			demand(parametizeFilters([])).eql(undefined);
		});
		const firstResult = parametizeFilters([singleFilter])[0];
		it('should return an array of flat objects with all value properties mapped to it', () => {
			demand(firstResult).must.have.properties(singleFilter.value);
		});
		it('should return an array of flat objects with a path property', () => {
			demand(firstResult).must.have.property('path', singleFilter.field.path);
		});
		it('should not include other field properties', () => {
			demand(firstResult).must.not.have.property('otherProp');
		});
	});
});

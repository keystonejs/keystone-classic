import demand from 'must';
import {
	stringifyColumns,
	parametizeFilters,
} from '../queryParams';


describe('client utils', () => {
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

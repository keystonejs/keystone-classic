import demand from 'must';
import {
	setActiveSearch,
	setActiveList,
	setActiveFilters,
} from '../active';
import {
	SET_ACTIVE_SEARCH,
	SET_ACTIVE_LIST,
	SET_FILTERS,
} from '../../constants';

describe('<List /> active actions', () => {
	describe('setActiveSearch()', () => {
		it('should have a type of SET_ACTIVE_SEARCH', () => {
			demand(setActiveSearch().type).eql(SET_ACTIVE_SEARCH);
		});

		it('should pass on the passed string', () => {
			const string = 'some string';
			demand(setActiveSearch(string).searchString).eql(string);
		});
	});

	describe('setActiveList()', () => {
		it('should have a type of SET_ACTIVE_LIST', () => {
			demand(setActiveList().type).eql(SET_ACTIVE_LIST);
		});

		it('should pass on the passed list', () => {
			const list = 'Some List';
			demand(setActiveList(list).list).eql(list);
		});

		it('should pass on the passed id', () => {
			const id = 'somelongid';
			demand(setActiveList(undefined, id).id).eql(id);
		});
	});

	describe.only('setActiveFilters()', () => {
		const filterValues = {
			valueOne: 1,
			valueTwo: 2,
			valueThree: 3,
		};

		const singleFilter = Object.assign({
			path: 'fieldName',
		}, filterValues);

		const stubFieldData = { fieldName: { hasProperty: 'one', hasAlso: 'two' } };


		function stateWithFields (fields) {
			return {
				lists: {
					currentList: {
						fields,
					},
				},
			};
		};

		it('should set empty filters if there are no matching fields', () => {
			setActiveFilters([singleFilter])(
				(action) => {
					demand(action.type).eql(SET_FILTERS);
					demand(action.filters).eql([]);
				},
				() => stateWithFields({})
			);
		});
		it('should set empty filters if no filters are passed', () => {
			setActiveFilters([])(
				(action) => {
					demand(action.type).eql(SET_FILTERS);
					demand(action.filters).eql([]);
				},
				() => stateWithFields({})
			);
		});
		it('should return array of filters', () => {
			setActiveFilters([singleFilter])(
				(action) => {
					demand(action.type).eql(SET_FILTERS);
					demand(action.filters).be.array;
				},
				() => stateWithFields(stubFieldData)
			);
		});
		it('should return array of filters with correct values', () => {
			setActiveFilters([singleFilter])(
				(action) => {
					demand(action.type).eql(SET_FILTERS);
					demand(action.filters).be.array;
				},
				() => stateWithFields(stubFieldData)
			);
		});
		it('should return array of filters with the field\'s data', () => {
			setActiveFilters([singleFilter])(
				(action) => {
					demand(action.filters[0].field).eql(stubFieldData.fieldName);
				},
				() => stateWithFields(stubFieldData)
			);
		});
		it('should return array of filters with the filter\'s value', () => {
			setActiveFilters([singleFilter])(
				(action) => {
					demand(action.filters[0].value).eql(filterValues);
				},
				() => stateWithFields(stubFieldData)
			);
		});
		it('should return array of two filters', () => {
			const secondFilter = Object.assign(
				{},
				singleFilter,
				{ path: 'secondFilter' }
			);
			const secondFieldData = Object.assign(
				{},
				stubFieldData,
				{ secondFilter: { someProperty: 'three' } }
			);

			setActiveFilters([singleFilter, secondFilter])(
				(action) => {
					demand(action.filters).length(2);
				},
				() => stateWithFields(secondFieldData)
			);
		});
	});
});

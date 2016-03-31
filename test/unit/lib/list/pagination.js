var keystone = require('../../../../index.js');
var assert = require('core-assert');
var async = require('async');
var _ = require('lodash');

keystone.import('../models');

var Post = keystone.list('Post');

// Test data for Post(s)
var testData = {
	posts: [{
		title: 'Test Post 1',
		content: 'keyword'
	}, {
		title: 'Test Post 2',
		content: 'keyword keyword'
	}, {
		title: 'Test Post 3',
		content: 'keyword keyword keyword'
	}, {
		title: 'Test Post 4',
		content: 'keyword keyword keyword keyword'
	}, {
		title: 'Test Post 5',
		content: 'keyword keyword keyword keyword keyword'
	}, {
		title: 'Test Post 6',
		content: 'keyword keyword keyword keyword keyword keyword'
	}, {
		title: 'Test Post 7',
		content: 'keyword keyword keyword keyword keyword keyword keyword'
	}]
};

describe('When paginating results', function () {

	beforeEach(function (done) {
		// remove any Post documents
		Post.model.find({}).remove(function (error) {
			if (error) {
				done(error);
			}

			// Add the test Post data
			async.forEach(testData.posts, function (post, callback) {
				var newPost = new Post.model(post);
				newPost.save(callback);
			}, function (error) {
				keystone.list('Post').model.collection.createIndex();
				done(error);
			});
		});
	});

	after(function (done) {
		// remove any remaining test data
		Post.model.find({}).remove(function (error) {
			done(error);
		});
	});

	// regression test for pagination after adding `options.optionalExpression`
	describe('without an optional expression', function () {
		it('should return results plus pagination metadata', function (done) {

			var regressionTestData = _.extend(testData, {
				expectedPages: [1, 2, 3, 4],
				perPage: 2
			});

			async.forEach(regressionTestData.expectedPages, function (pageNumber, callback) {

				Post.paginate({
					page: pageNumber,
					perPage: regressionTestData.perPage,
					select: 'title'
				}).sort({
					title: 'asc'
				}).exec(function (error, results) {
					if (!error) {
						assert.equal(results.currentPage, pageNumber);
						assert.equal(results.totalPages, regressionTestData.expectedPages.length);
						assert.deepStrictEqual(results.pages, regressionTestData.expectedPages);

						// If we're on the first page of results, test that there is no
						// `previous` page to go back to.
						//
						// If it's the last page, test that there is no `next`.
						//
						// Otherwise test that there are both `previous` and `next`
						// pages to go to.
						if (_.first(regressionTestData.expectedPages) === pageNumber) {
							assert(!results.previous);
							assert(results.next);
						}
						else if (_.last(regressionTestData.expectedPages) === pageNumber) {
							assert(results.previous);
							assert(!results.next);
						}
						else {
							assert(results.previous);
							assert(results.next);
						}

						// Ensure we don't have more results per page than we
						// defined.
						assert(results.results.length <= regressionTestData.perPage);
					}
					callback(error);
				});

			}, function (error) {
				done(error);
			});

		});
	});

	describe('with an optional expression', function () {
		it('should return results plus query metadata and pagination metadata', function (done) {

			var searchTestData = _.extend(testData, {
				expectedPages: [1, 2],
				perPage: 5
			});

			// Perform a $text search on a weighted 'keyword'. Since all of the
			// test documents contain this keyword, we should get back the
			// all Posts, but sorted by `textScore` descending.
			async.forEach(searchTestData.expectedPages, function (pageNumber, callback) {

				Post.paginate({
					page: pageNumber,
					perPage: searchTestData.perPage,
					filters: {
						$text: { $search: 'keyword' }
					},
					optionalExpression: {
						score: { $meta: 'textScore' }
					}
				}).sort({
					score: { $meta: 'textScore' }
				}).exec(function (error, results) {

					if (!error) {
						// Ensure our optional $meta expression has added a value.
						// Each result should have a 'score'
						_.each(results.results, function (result) {
							var score = result.get('score');
							assert.notEqual(score, undefined);
						});

						// Ensure our paginated result set works as expected
						assert.equal(results.currentPage, pageNumber);
						assert.equal(results.totalPages, searchTestData.expectedPages.length);
						assert.deepStrictEqual(results.pages, searchTestData.expectedPages);

						if (_.first(searchTestData.expectedPages) === pageNumber) {
							assert(!results.previous);
							assert(results.next);
						}
						else if (_.last(searchTestData.expectedPages) === pageNumber) {
							assert(results.previous);
							assert(!results.next);
						}
						else {
							assert(results.previous);
							assert(results.next);
						}

						assert(results.results.length <= searchTestData.perPage);
					}
					callback(error);
				});

			}, function (error) {
				done(error);
			});
		});
	});
});

var keystone = require('../../../../index.js');
var assert = require('core-assert');

keystone.mongoose = require('../../../helpers/getMongooseConnection.js');

keystone.import('../models');

var Post = keystone.list('Post');

describe('Test list utilities', function () {

  it('listFor will return Post list definition when passing a model instance', function () {
      var newPost = new Post.model({
        title: 'new post',
        state: 'draft'
      });

      var list = keystone.listFor(newPost);
      assert.equal(list, Post);
  });
});
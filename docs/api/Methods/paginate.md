# Paginate (Deprecated)

**This feature of Keystone is now deprecated and you are encouraged to roll your own pagination**

This is a keystone-specific way of retrieving items from `mongo`. It returns a query object, just as `List.model.find()` would. It supports the options

- `page` - page to start at
- `perPage` - number of results to return per page
- `maxPages` - optional, causes the page calculation to omit pages from the beginning/middle/end(useful if you have lots of pages, and do not want them to wrap over several lines).

**For example**:

to load the `posts` with the `maxPages` 10 and `perPage` 10, with state is `published`, populating the linked `author` and `categories`, sorted by reverse published date:

**Loading Posts with paginate**

```javascript
var keystone = require('keystone');
var Post = keystone.list('Post');

Post.paginate({
  page: req.query.page || 1,
  perPage: 10,
  maxPages: 10
})
  .sort('-publishedDate')
  .populate('author categories')
  .exec(function(err, results) {
    locals.data.posts = results;
    next(err);
  });
```

> NOTE: All parameters of your search should be passed in to the paginate method. Adding additional specificity through calls to mongoose methods such as `where` will not be properly respected.

When you call `exec` on a paginated query, it will return a lot of metadata along with the results:

key | details
---|---
`total` | all matching results (not just on this page)
`results` | array of results for this page
`currentPage` | the index of the current page
`totalPages` | the total number of pages
`pages` | array of pages to display
`previous` | index of the previous page, false if at the first page
`next` | index of the next page, false if at the last page
`first` | the index of the first result included
`last` | index of the last result included

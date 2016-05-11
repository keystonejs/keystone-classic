/**
 * Retrieves the list for a given item
 */

module.exports = function listFor (item) {
  if (!item.schema) throw new ReferenceError('Given item has no schema');
  var keys = Object.keys(this.lists);
  var found = keys.find((key) => {
    return this.lists[key].schema.options.collection == item.schema.options.collection;
  });
  if (found) {
    return this.lists[found];
  }
};

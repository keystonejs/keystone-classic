module.exports = function (keystone) {
  return function (respectHiddenOption) {
    return function (req, res, next) {
      req.list = keystone.list(req.params.list);
      if (!req.list || (respectHiddenOption && req.list.get('hidden'))) {
        req.flash('error', 'List ' + req.params.list + ' could not be found.');
        return res.redirect('');
      }
      next();
    };
  };
};

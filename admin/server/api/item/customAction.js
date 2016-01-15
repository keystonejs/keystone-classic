var keystone = require('../../../../'),
    _ = require('underscore');

module.exports = function(req, res) {
    var customAction = _.findWhere(req.list._customActions, { slug: req.params.customAction });

    if (!customAction) return res.status(404).json({ err: 'not found', customAction: req.params.customAction });

    req.list.model.findById(req.params.id, function(err, item) {
        if (err) return res.apiError('database error', err);
        if (!item) return res.status(404).json({ err: 'not found', id: req.params.id });
        req.items = [item];
        try {
            customAction.callback.call(req.list, req, res, function(message) {
                res.status(200).json({ message: message });
            });
        } catch (e) {
            if (!e.message) {
                e.message = 'There was a problem performing the action "'+ customAction.name +'"';
            }
            res.status(500).json({ err: e.message, id: req.params.id, customAction: customAction.slug });
        }
    });
};

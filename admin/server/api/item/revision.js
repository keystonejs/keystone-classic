module.exports = function (req, res) {
    var keystone = req.keystone;

    req.list.HistoryModel
        .findById(req.params.revisionId)
        .populate('u', 'name')
        .exec(function (err, result) {
            if (err) return res.status(500).json({ err: 'database error', detail: err });
            if (!result) return res.status(404).json({ err: 'not found', id: req.params.id });

            var data = req.list.getData(new req.list.model(result.d))
            data.id = req.params.id
            delete result.d

            res.json({
                revision: result,
                data: data
            });
        });
}

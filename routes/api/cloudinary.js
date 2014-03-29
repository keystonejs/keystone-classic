var cloudinary = require('cloudinary');

exports = module.exports = {
    /**
     * Upload Cloudinary Image
     * @param  {[type]} req [description]
     * @param  {[type]} res [description]
     * @return {[type]}     [description]
     */
    upload: function(req, res) {
        if(req.files && req.files.file){
            cloudinary.uploader.upload(req.files.file.path, function(result) { 

                if (result.error) {
                    res.send('{"error":{"message":"' + result.error.message + '"}}');
                } else {
                    res.send('{"image":{"url":"' + result.url + '"}}');
                }
            });
        } else {
            res.send('{"error":{"message":"No image selected"}}');
        }
    }
};
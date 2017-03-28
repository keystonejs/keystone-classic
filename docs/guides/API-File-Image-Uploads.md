# API File and Image Uploads

This guide gives code examples on how to set up an API for File and
Image transfers to your KeystoneJS installation. It also shows how to
set up the server for local file and image hosting. These examples
contain the same code used by [ConnextCMS](http://connextcms.com).

### Setup

This guide assumes that you have a working version of
[KeystoneJS](https://github.com/keystonejs/keystone). All file path
references assume that you are working from the same directory as the
`keystone.js` file.

## Creating Models

This guide does not treat images differently than generic files, since
they are all files to KeystoneJS. The difference is how you use them on
the front end once you retrieve the file url from the server. With a
little modification of the code below, you can create a different file
model called 'images.js' along with a corresponding API and send
'images' to their own directory.


At any rate, below is an example model that leverages the `Types.File`
introduced in KeystoneJS v4.0 Beta. This code should be copied into the
file `models/FileUpload.js`.

```javascript
var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * File Upload Model
 * ===========
 * A database model for uploading images to the local file system
 */

var FileUpload = new keystone.List('FileUpload');

var myStorage = new keystone.Storage({
  adapter: keystone.Storage.Adapters.FS,
  fs: {
    path: keystone.expandPath('./public/uploads/files'), // required; path where the files should be stored
    publicPath: '/public/uploads/files', // path where files will be served
  }
});

FileUpload.add({
  name: { type: Types.Key, index: true},
  file: {
    type: Types.File,
    storage: myStorage
  },
  createdTimeStamp: { type: String },
  alt1: { type: String },
  attributes1: { type: String },
  category: { type: String },      //Used to categorize widgets.
  priorityId: { type: String },    //Used to prioritize display order.
  parent: { type: String },
  children: { type: String },
  url: {type: String},
  fileType: {type: String}

});


FileUpload.defaultColumns = 'name';
FileUpload.register();
```

A lot of the additional fields like `alt1`, or `category` are metadata
and may be unnecessary for your purposes. I put them in the model as
suggestions.  Feel free to take them out, and it won't hurt anything if
you leave them in

## Opening an API in KeystoneJS

Now we are going to create an API that can be used to upload and
download files to KeystoneJS. This is a two step process. The first step
is add a few lines of code to the `routes/index.js` file:

```javascript
var keystone = require('keystone');
var middleware = require('./middleware');
var importRoutes = keystone.importer(__dirname);

// Common Middleware
keystone.pre('routes', middleware.initLocals);
keystone.pre('render', middleware.flashMessages);

// Import Route Controllers
var routes = {
  views: importRoutes('./views'),
  api: importRoutes('./api')      // ADD THIS LINE TOO!
};

// Setup Route Bindings
exports = module.exports = function (app) {
  // Views
  app.get('/', routes.views.index);
  app.get('/blog/:category?', routes.views.blog);
  app.get('/blog/post/:post', routes.views.post);
  app.get('/gallery', routes.views.gallery);
  app.all('/contact', routes.views.contact);

  // COPY THE CODE FROM HERE...
  //File Upload Route
  app.get('/api/fileupload/list', keystone.middleware.api, routes.api.fileupload.list);
  app.get('/api/fileupload/:id', keystone.middleware.api, routes.api.fileupload.get);
  app.all('/api/fileupload/:id/update', keystone.middleware.api, routes.api.fileupload.update);
  app.all('/api/fileupload/create', keystone.middleware.api, routes.api.fileupload.create);
  app.get('/api/fileupload/:id/remove', keystone.middleware.api, routes.api.fileupload.remove);
  // ...TO HERE.

  // NOTE: To protect a route so that only admins can see it, use the requireUser middleware:
  // app.get('/protected', middleware.requireUser, routes.views.protected);

};
```

### Create the API Handler

The second step is to create the new file `routes/api/fileupload.js`. If
the `routes/api` directory doesn't exist, you'll need to create it. Copy
the code below into `routes/api/fileupload.js`.

```javascript
var async = require('async'),
keystone = require('keystone');
var exec = require('child_process').exec;

var FileData = keystone.list('FileUpload');

/**
 * List Files
 */
exports.list = function(req, res) {
  FileData.model.find(function(err, items) {

    if (err) return res.apiError('database error', err);

    res.apiResponse({
      collections: items
    });

  });
}

/**
 * Get File by ID
 */
exports.get = function(req, res) {

  FileData.model.findById(req.params.id).exec(function(err, item) {

    if (err) return res.apiError('database error', err);
    if (!item) return res.apiError('not found');

    res.apiResponse({
      collection: item
    });

  });
}


/**
 * Update File by ID
 */
exports.update = function(req, res) {
  FileData.model.findById(req.params.id).exec(function(err, item) {
    if (err) return res.apiError('database error', err);
    if (!item) return res.apiError('not found');

    var data = (req.method == 'POST') ? req.body : req.query;

    item.getUpdateHandler(req).process(data, function(err) {

      if (err) return res.apiError('create error', err);

      res.apiResponse({
        collection: item
      });

    });
  });
}

/**
 * Upload a New File
 */
exports.create = function(req, res) {

  var item = new FileData.model(),
  data = (req.method == 'POST') ? req.body : req.query;

  item.getUpdateHandler(req).process(req.files, function(err) {

    if (err) return res.apiError('error', err);

    res.apiResponse({
      file_upload: item
    });

  });
}

/**
 * Delete File by ID
 */
exports.remove = function(req, res) {
  var fileId = req.params.id;
  FileData.model.findById(req.params.id).exec(function (err, item) {

    if (err) return res.apiError('database error', err);

    if (!item) return res.apiError('not found');

      item.remove(function (err) {

        if (err) return res.apiError('database error', err);

        //Delete the file
        exec('rm public/uploads/files/'+fileId+'.*', function(err, stdout, stderr) {
          if (err) {
              console.log('child process exited with error code ' + err.code);
              return;
          }
          console.log(stdout);
        });

        return res.apiResponse({
          success: true
        });
    });

  });
}
```
### Create the upload directory

Finally, you'll want to create the `public/uploads/files` directory.
This is where files will be end up when uploaded via the API.

## Upload a file

That's it! Your new API is ready to use. Drop the following code into
`public/fileAPITest.html`, start KeystoneJS, and open the test file in
your web browser. If KeystoneJS is already running you'll need to kill
the process and restart it. If KeystoneJS won't start after you create
the new API files, go back and check your code.

```html
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Hello World</title>


</head>

<body>
  <h1>Upload a new file</h1>
  <form id="form2" action="/api/fileupload/create" method="POST" enctype='multipart/form-data'>
      <div>
          <input type="file" id="file_upload" />
          <br>
          <label for="file_name">Give the file a name:<input type="text" name="file_name" id="file_name" /></label>
      </div>
      <br>

      <div>
          <center><input type="button" value="Upload" onclick="uploadFile()"></center>
      </div>
  </form>
  <br>
  <div>
  <h2>Uploaded File List:</h2>
    <ul id="file_list">
    </ul>
  </div>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.0/jquery.min.js"></script>
  <script type="text/javascript">
    $(document).ready(function() {
      //debugger;

    });

    function uploadFile() {
      //debugger;

      var selectedFile = $('#file_upload').get(0).files[0];

      //Error handling
      if(selectedFile == undefined)
        alert('You did not select a file!');

      //Create the FormData data object and append the file to it.
      var newFile = new FormData();
      newFile.append('file_upload', selectedFile); //This is the raw file that was selected

      //Set the form options.
      var opts = {
        url: '/api/fileupload/create',
        data: newFile,
        cache: false,
        contentType: false,
        processData: false,
        type: 'POST',

        //This function is executed when the file uploads successfully.
        success: function(data){
          //Dev Note: KeystoneAPI only allows file and image uploads with the file itself. Any extra metadata will have to
          //be uploaded/updated with a second call.

          //debugger;
          console.log('File upload succeeded! ID: ' + data.file_upload._id);

          //Fill out the file metadata information
          data.file_upload.name = $('#file_name').val();
          data.file_upload.url = '/uploads/files/'+data.file_upload.file.filename;
          data.file_upload.fileType = data.file_upload.file.mimetype;
          data.file_upload.createdTimeStamp = new Date();

          //Update the file with the information above.
          $.get('/api/fileupload/'+data.file_upload._id+'/update', data.file_upload, function(data) {
            //debugger;

            console.log('File information updated.');

            //Add the uploaded file to the uploaded file list.
            $('#file_list').append('<li><a href="'+data.collection.url+'" download>'+data.collection.name+'</a></li>');

          })

          //If the metadata update fails:
          .fail(function(data) {
            debugger;

            console.error('The file metadata was not updated. Here is the error message from the server:');
            console.error('Server status: '+err.status);
            console.error('Server message: '+err.statusText);

            alert('Failed to connect to the server while trying to update file metadata!');
          });
        },

        //This error function is called if the POST fails for submitting the file itself.
        error: function(err) {
          //debugger;

          console.error('The file was not uploaded to the server. Here is the error message from the server:');
          console.error('Server status: '+err.status);
          console.error('Server message: '+err.statusText);

          alert('Failed to connect to the server!');
        }
      };

      //Execute the AJAX call.
      jQuery.ajax(opts);

    }
  </script>
</body>
</html>
```

### Gotcha: Two POST Calls Needed

You'll notice that in `fileAPITest.html` there are two POST calls. The
first uploads the file itself. The second updates the metadata for the
file entry in the database.  It's irritating to make two server calls
instead of one, but right now that's the way it has to be.


## Download a file

`fileAPITest.html` creates a list item for each file that is uploaded.
The list item includes a link to the file and uses the `download`
attribute to tell the browser to download the file instead of trying to
open it. You can use the example code above to figure out how to
generate your own download URL for uploaded files.

## README

This guide was written by [Chris Troutner](http://christroutner.com). It
was originally inspired by [this gist by Jed
Watson](https://gist.github.com/JedWatson/9741171#file-routes-index-js-L24)
and [this
tutorial](http://christroutner.com/blog/post/front-end-widgets-part-1-creating-the-db-model)
on my own blog. The technique displayed here is the same used in the
[ConnextCMS](http://connextcms.com) software. ConnextCMS is a front end
extension for KeystoneJS that mimicks the WordPress user interface.

The latest version of this file can be found in the
[christroutner/keystone-guides
repository](https://github.com/christroutner/keystone-guides).

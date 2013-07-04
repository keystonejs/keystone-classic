Prospekt
========


## Disclaimer

This project is currently under development, and unsupported. Please use it at your
own risk.


## About

Prospekt is designed to be used in a web application built on Express and Mongoose.

Prospekt provides:
*	Enhanced `models` with additional field types and functionality, building on those
	natively supported by Mongoose
*	Helpful utilities for generating webpages based on common `model` conventions and
	field types
*	An auto-generated Admin UI based on the defined `models`
*	Integration with Coudinary for image uploading, storage and resizing

Prospekt is *not* designed to execute as a standalone application.


## Installation & Requirements

Specific congurations are required in your main application script for Prospekt to work,
and assumptions are made in the code that this has been done correctly.

1.	Express ~3.2.6 and Mongoose ~3.6.13 must be included by your application, and must
	be `require`d *before* Prospekt
	
2.	Prospekt assumes that you have correctly configured, and successfully connected to,
	a Mongo database with Mongoose's default connection

3.	Connect-Flash ~0.1.1 must be included and configured in your Express app instance
	*before* you call `prospekt.setup()`. This also requires the configuration of
	`express.session()` in your Express app.


### Usage

When first `require`d, Prospekt creates a single instance of itself. Do this somewhere
near the top of your app.js (or web.js, etc) file. Any subsequent `require('prospekt')`
statements will return the same instance of Prospekt.


## License

(The MIT License)

Copyright (c) 2013 Jed Watson

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
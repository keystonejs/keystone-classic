var demand = require('must');
var Path = require("../../lib/path");

describe("Path", function() {
	describe("new", function() {
		it("must be an instance of Path", function() {
			new Path("").must.be.an.instanceof(Path);
		})
	})

	describe(".prototype.append", function() {
		it("must return the path appended to the given part", function() {
			var path = new Path("foo.example.dir")
			path.append(".com").must.equal("foo.example.dir.com")
		})
	})

	describe(".prototype.addTo", function() {
		it("must return an hierarchical object from path", function() {
			var path = new Path("foo.example.dir.file")
			var obj = path.addTo({}, 42)
			obj.must.eql({foo: {example: {dir: {file: 42}}}})
		})

		it("must merge given an existing hierarchy", function() {
			var path = new Path("foo.example.dir.file")
			var obj = path.addTo({foo: {example: {link: 69}}}, 42)
			obj.must.eql({foo: {example: {link: 69, dir: {file: 42}}}})
		})
	})

	describe(".prototype.get", function() {
		it("must walk hierarchy and return value", function() {
			var path = new Path("foo.example.dir")
			path.get({foo: {example: {dir: 42}}}).must.equal(42)
		})
		it("must return undefined when a path isn't present", function() {
			var path = new Path("foo.example.dir")
			demand(path.get({})).be.undefined()
		})
	})

	describe(".prototype.prependToLast", function() {
		it("must return path with preprended last part", function() {
			var path = new Path("foo.example.dir")
			path.prependToLast("cool").must.equal("foo.example.cooldir")
		})

		it("must return path with last part in titlecase given true", function() {
			var path = new Path("foo.example.dir")
			path.prependToLast("cool", true).must.equal("foo.example.coolDir")
		})

		it("must return path with last part as-is given false", function() {
			var path = new Path("foo.example.dir")
			path.prependToLast("cool", false).must.equal("foo.example.cooldir")
		})
	})

	describe(".prototype.flatten", function() {
		it("must return path camel cased given false", function() {
			var path = new Path("foo.example.dir")
			path.flatten(false).must.equal("FooExampleDir")
		})

		it("must return path camel cased with lowercase first letter given true",
			function() {
			var path = new Path("foo.example.dir")
			path.flatten(true).must.equal("fooExampleDir")
		})
	})

	describe("last", function() {
		it("must equal to the last part of path", function() {
			var path = new Path("foo.example.dir")
			path.last.must.equal("dir")
		})
	})

	describe("exceptLast", function() {
		it("must equal to the path without last part", function() {
			var path = new Path("foo.example.dir")
			path.exceptLast.must.equal("foo.example")
		})
	})
})

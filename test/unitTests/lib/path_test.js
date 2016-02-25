var demand = require('must');
var Path = require("../../../lib/path");

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
})

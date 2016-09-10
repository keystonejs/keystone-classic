#Overview
This directory contains Test Config for all keystone app models.  A Model Test Config defines the Field Test Objects that make up a test model.


# Structure
The structure of a Model Test Config is very simple.  In the following example, the Model Test Config is made up of two Field Test Objects:
a Text Field Test Object and a Boolean Field Test Object.  Note that the config is passed through to the fields updated with the field name.

    var objectAssign = require('object-assign');
var fieldTestObjectsPath = require('keystone-nightwatch-e2e').fieldTestObjectsPath;
var path = require('path');
    var TextFieldTestObject = require('../fieldTestObjects/textField');
    var BooleanFieldTestObject = require('../fieldTestObjects/booleanField');

    module.exports = function ModelTestConfig (config) {
        return {
            name: new TextFieldTestObject(objectAssign({}, config, {fieldName: 'name'})),
            fieldA: new BooleanFieldTestObject(objectAssign({}, config, {fieldName: 'fieldA'})),
        };
    };

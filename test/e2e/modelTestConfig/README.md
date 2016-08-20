#Overview
This directory contains Test Config for all keystone app models.  A Model Test Config defines the Field Test Objects that make up a test model.


# Structure
The structure of a Model Test Config is very simple.  In the following example, the Model Test Config is made up of two Field Test Objects:
a Text Field Test Object and a Boolean Field Test Object.

    var TextField = require('../fieldTestObjects/textField');
    var BooleanField = require('../fieldTestObjects/booleanField');

    module.exports = function ModelTestConfig (config) {
        return {
                name: new TextField({fieldName: 'name'}),
                fieldA: new BooleanField({fieldName: 'fieldA'}),
        };
    };

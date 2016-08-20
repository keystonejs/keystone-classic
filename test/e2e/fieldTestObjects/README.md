#Overview
This directory contains Test Objects for all built-in keystone fields.  A Field Test Object defines the entire test behavior of a keystone field.


# Object Structure
The structure of a field Test Object is similar to a NightwatchJS Page Object.  Please see existing Field Test Object for implementation examples.
It is important that the Field Test Object adheres to the following format as the test framework may make use of this structure during test processing.

NOTE:  when calling commands in the Field Test Object, the test framework will first make sure the command is configured.  If not configured,
        it will log an quick message for the field and move on.

    module.exports = function FieldTestObject (config) {
        var selectElem = function(elem) {
            return self.selector + ' ' + self.elements[elem];
        };
        var self = {
            selector: '<THE-CSS-SELECTOR-FOR-THE-FIELD>',
            elements: {
                <WHAT-EVER-CSS-OR-XPATH-ELEMENTS-FOR-THE-FIELD>
            },
            commands: {
                assertUIVisible: function (browser, args) {
                    /*
                    THIS FUNCTION ASSERTS THAT THE UI FOR THIS FIELD IS VISIBLE AS IN THE USER CAN SEE IT
                    */
                },
                assertUINotVisible: function (browser, args) {
                    /*
                    THIS FUNCTION ASSERTS THAT THE UI FOR THIS FIELD IS NOT VISIBLE AS IN THE USER CANNOT SEE IT
                    */
                },
                assertUIPresent: function (browser, args) {
                    /*
                    THIS FUNCTION ASSERTS THAT THE ELEMENTS FOR THIS FIELD ARE PRESENT IN THE DOM
                    */
                },
                assertUINotPresent: function (browser, args) {
                    /*
                    THIS FUNCTION ASSERTS THAT THE ELEMENTS FOR THIS FIELD ARE NOT PRESENT IN THE DOM
                    */
                },
                showMoreFields: function (browser, args) {
                    /*
                    [OPTIONAL] THIS FUNCTION CONTROLS SHOWING MORE FIELDS IN THE UI FOR FIELDS THAT SUPPORT IT
                    */
                },
                fillInput: function (browser, input) {
                    /*
                    THIS FUNCTION FILLS THE FIELD FORM WITH THE SPECIFIED INPUT
                    */
                },
                assertInput: function (browser, input) {
                    /*
                    THIS FUNCTION ASSERTS THAT THE FIELD FORM IS FILLED WITH THE SPECIFIED INPUT
                    */
                }
            }
        };
    }



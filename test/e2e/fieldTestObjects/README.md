#Overview
This directory contains Test Objects for all built-in keystone fields.  A Field Test Object defines the entire test behavior of a keystone field.


# Object Structure
The structure of a field Test Object is similar to a NightwatchJS Page Object.  Please see existing Field Test Object for implementation examples.
It is important that the Field Test Object adheres to the following format as the test framework may make use of this structure during test processing.

NOTE:  when calling commands in the Field Test Object, the test framework will first make sure the command is configured.  If not configured,
        it will log an quick message for the field and move on.
NOTE:  fields should be selected on the context of their parent form.  Thus, the config.formSelector is matched along with the field selector.        

    module.exports = function FieldTestObject (config) {
        
        /*
            This is a convenience function that returns fully qualified css field elements selectors.
        */
        var selectElem = function(elem) {
            return config.formSelector + ' ' + self.selector + ' ' + self.elements[elem];
        };
        
        /*
            We use self to keep a reference to the test object closure since function blocks may need to reference
            closure properties.
        */
        var self = {
            selector: '<THE-CSS-SELECTOR-FOR-THE-FIELD>',
            elements: {
                <WHAT-EVER-CSS-ELEMENTS-FOR-THE-FIELD>
            },
            
            /*
                A Field Test Object can implement any of the following commands.  Commands that are not implemented will not
                be called and thus cannot be tested.
            */
            commands: {
                clickUI: function (browser, elem) {
                    /*
                    THIS FUNCTION CLICKS THE SPECIFIED ELEM IN THE FIELD
                    */
                },
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



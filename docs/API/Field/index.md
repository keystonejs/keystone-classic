// TK TK TK TK
We are expecting to find a list of all fields types


### keystone.Field
The constructor for field types. Field defines the base parts of all keystone fields as well as default options, except when explicitly overriden. It also is responsible for providing each field with its needed default functions such as [updateItem()](/updateItem)TK, passing in the item. Most of these are better used and understood through their calls on [keystone.List](TK)TK, which calls these functions for each field on the list.

Calls to `new Field()` are generally made only during field creation.

This provides the following options to all fields

- [getOptions()](../getOptions)TK
- [getSize()](../getSize)TK
- [getDefaultValue()](../getDefaultValue)TK
- [getData()](../getData)TK
- [getPreSaveWatcher()](../getPreSaveWatcher)TK
- [addToSchema()](../addToSchema)TK
- [bindUnderscoreMethods()](../bindUnderscoreMethods)TK
- [underscoreMethod()](../underscoreMethod)TK
- [format()](../format)TK
- [isModified()](../isModified)TK
- [validateInput()](../validateInput)TK
- [validateRequiredInput()](../validateRequiredInput)TK
- [inputIsValid()](../inputIsValid)TK
- [updateItem()](../updateItem)TK
- [getValueFromData()](../getValueFromData)TK
- [size](../size)TK
- [initial](../initial)TK
- [required](../required)TK
- [note](../note)TK
- [col](../col)TK
- [noedit](../noedit)TK
- [nocol](../nocol)TK
- [nosort](../nosort)TK
- [collapse](../collapse)TK
- [hidden](../hidden)TK
- [dependsOn](../dependsOn)TK

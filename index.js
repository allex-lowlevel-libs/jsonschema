function createJsonSchemaFunctionality (jsonschema, objmanip, AllexJSONizingError) {
  'use strict';

  function extractValidationMessages(error) {
    return error.path.join('.') + ' ' + error.message;
  }
  function jsonSchemaValidateToErrors (item, schema) {
    var schemaval = jsonschema.validate(item, schema, {throwError: false});
    if (schemaval.errors.length) {
      return schemaval.errors.map(extractValidationMessages);
    }
    return null;
  }

  function jsonSchemValidateToJsonizedErrorThrow (item, schema, errortype) {
    var schemavalerrors = jsonSchemaValidateToErrors(item, schema);
    if (schemavalerrors) {
      throw new AllexJSONizingError(
        errortype,
        item,
        schemavalerrors.join('; ')+' :'
      );
    }
  }

  function requiredpicker (res, sch, fld) {
    if (sch && sch.required) {
      res.push(fld);
    }
    return res;
  }

  function allexSpecToJsonSchema (schemaspec) {
    return {
      type: 'object',
      properties: schemaspec,
      required: objmanip.reduceShallow(schemaspec, requiredpicker, [])
    };
  }

  return {
    jsonSchemaValidateToErrors: jsonSchemaValidateToErrors,
    jsonSchemValidateToJsonizedErrorThrow: jsonSchemValidateToJsonizedErrorThrow,
    allexSpecToJsonSchema: allexSpecToJsonSchema
  }
}
module.exports = createJsonSchemaFunctionality;
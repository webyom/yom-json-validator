var ERR_TITLE = 'yom-json-validator: ';
var KEY_WORDS = ['type', 'nullable', 'default', 'set', 'max', 'min', 'maxLength', 'minLength', 'item', 'value', 'validator'];
var TYPES = ['dynamic', 'array', 'object', 'string', 'number', 'boolean'];

var $k = {};

function normalizePath(path) {
  return path.replace(/\/+/g, '/').replace(/\/+$/g, '');
}

function getValueByPath(rootData, path, currentPath) {
  var tmp, pathItems, relPathItems;
  if (typeof rootData != 'object' || !rootData) {
    return undefined;
  }
  if (path.indexOf('/') === 0) {
    tmp = normalizePath(path);
    if (!tmp) {
      return rootData;
    }
    pathItems = tmp.split('/');
  } else {
    tmp = normalizePath(currentPath);
    pathItems = tmp.split('/').slice(0, -1);
    tmp = normalizePath(path);
    relPathItems = tmp.split('/');
    while (relPathItems.length) {
      tmp = relPathItems.shift();
      if (!tmp || tmp == '.') {
        continue;
      }
      if (tmp == '..') {
        pathItems.pop();
      } else {
        pathItems.push(tmp);
      }
    }
  }
  while (pathItems.length && typeof rootData == 'object' && rootData) {
    tmp = pathItems.shift();
    if (!tmp) {
      continue;
    }
    rootData = rootData[tmp];
  }
  if (!pathItems.length) {
    return rootData;
  }
  return undefined;
}

function validateArray(schema, data, path, rootData) {
  var itemSchema;
  var oSchema = schema;
  if (Array.isArray(schema)) {
    itemSchema = schema[0];
    schema = {};
    schema[$k.nullable] = oSchema[1] === null;
  } else {
    itemSchema = schema[$k.item];
  }
  if (itemSchema == null) {
    throw new Error(ERR_TITLE + 'schema of array item must not be undefined. path: ' + path);
  }
  if (data == null) {
    if (schema[$k.nullable]) {
      return null;
    } else {
      throw new Error(ERR_TITLE + 'array can not be null. path: ' + path);
    }
  }
  if (!Array.isArray(data)) {
    throw new Error(ERR_TITLE + 'require an array. path: ' + path);
  }
  if (schema[$k.minLength] > 0 && data.length < schema[$k.minLength]) {
    throw new Error(ERR_TITLE + 'require an array of min length ' + schema[$k.minLength] + ', actual length is ' + data.length + '. path: ' + path);
  }
  if (schema[$k.maxLength] > 0 && data.length > schema[$k.maxLength]) {
    throw new Error(ERR_TITLE + 'require an array of max length ' + schema[$k.maxLength] + ', actual length is ' + data.length + '. path: ' + path);
  }
  return data.map(function (item, i) {
    return validate(itemSchema, item, path + '/' + i, rootData);
  });
}

function validateObject(schema, data, path, rootData) {
  var res = {};
  var valueSchema;
  if (schema[$k.type]) {
    valueSchema = schema[$k.value];
  } else {
    valueSchema = schema;
    schema = {};
  }
  if (data == null) {
    if (schema[$k.nullable]) {
      return null;
    } else {
      throw new Error(ERR_TITLE + 'object can not be null. path: ' + path);
    }
  }
  if (typeof data != 'object') {
    throw new Error(ERR_TITLE + 'require an object. path: ' + path);
  }
  Object.keys(valueSchema).forEach(function (key) {
    res[key] = validate(valueSchema[key], data[key], path + '/' + key, rootData);
  });
  return res;
}

function validateString(schema, data, path, rootData) {
  var oSchema = schema;
  if (typeof schema == 'string') {
    schema = {};
    schema[$k.nullable] = oSchema === '';
  }
  if (data == null) {
    if (schema[$k.default]) {
      if (typeof schema[$k.default] == 'string') {
        return schema[$k.default];
      } else {
        throw new Error(ERR_TITLE + 'schema default value type not match schema type string. path: ' + path);
      }
    } else if (schema[$k.nullable]) {
      return null;
    } else {
      throw new Error(ERR_TITLE + 'string can not be undefined. path: ' + path);
    }
  }
  if (typeof data != 'string') {
    throw new Error(ERR_TITLE + 'require a string. path: ' + path);
  }
  var set = schema[$k.set];
  if (Array.isArray(set) && set.length) {
    if (set.indexOf(data) === -1) {
      throw new Error(ERR_TITLE + 'string must be in value set ' + set.join(', ') + '. path: ' + path);
    }
  } else {
    if (schema[$k.minLength] > 0 && data.length < schema[$k.minLength]) {
      throw new Error(ERR_TITLE + 'require a string of min length ' + schema[$k.minLength] + ', actual length is ' + data.length + '. path: ' + path);
    }
    if (schema[$k.maxLength] > 0 && data.length > schema[$k.maxLength]) {
      throw new Error(ERR_TITLE + 'require a string of max length ' + schema[$k.maxLength] + ', actual length is ' + data.length + '. path: ' + path);
    }
  }
  return data;
}

function validateNumber(schema, data, path, rootData) {
  var oSchema = schema;
  if (typeof schema == 'number') {
    schema = {};
    schema[$k.nullable] = oSchema === 0;
  }
  if (data == null) {
    if (schema[$k.default]) {
      if (typeof schema[$k.default] == 'number') {
        return schema[$k.default];
      } else {
        throw new Error(ERR_TITLE + 'schema default value type not match schema type number. path: ' + path);
      }
    } else if (schema[$k.nullable]) {
      return null;
    } else {
      throw new Error(ERR_TITLE + 'number can not be undefined. path: ' + path);
    }
  }
  if (typeof data != 'number') {
    throw new Error(ERR_TITLE + 'require a number. path: ' + path);
  }
  var set = schema[$k.set];
  if (Array.isArray(set) && set.length) {
    if (set.indexOf(data) === -1) {
      throw new Error(ERR_TITLE + 'number must be in value set ' + set.join(', ') + '. path: ' + path);
    }
  } else {
    if (typeof schema[$k.min] == 'number' && data < schema[$k.min]) {
      throw new Error(ERR_TITLE + 'require a number of min value ' + schema[$k.minLength] + ', actual value is ' + data + '. path: ' + path);
    }
    if (typeof schema[$k.max] == 'number' && data > schema[$k.max]) {
      throw new Error(ERR_TITLE + 'require a number of max value ' + schema[$k.minLength] + ', actual value is ' + data + '. path: ' + path);
    }
  }
  return data;
}

function validateBoolean(schema, data, path, rootData) {
  var oSchema = schema;
  if (typeof schema == 'boolean') {
    schema = {};
    schema[$k.nullable] = oSchema === false;
  }
  if (data == null) {
    if (schema[$k.default]) {
      if (typeof schema[$k.default] == 'boolean') {
        return schema[$k.default];
      } else {
        throw new Error(ERR_TITLE + 'schema default value type not match schema type boolean. path: ' + path);
      }
    } else if (schema[$k.nullable]) {
      return null;
    } else {
      throw new Error(ERR_TITLE + 'boolean can not be undefined. path: ' + path);
    }
  }
  if (typeof data != 'boolean') {
    throw new Error(ERR_TITLE + 'require a boolean. path: ' + path);
  }
  return data;
}

function validate(schema, data, path, rootData) {
  if (!path) {
    path = '';
    rootData = data;
  }
  var type = typeof schema;
  var res, validator;
  if (type == 'undefined') {
    throw new Error(ERR_TITLE + 'schema must not be undefined. path: ' + path);
  }
  if (type == 'object') {
    if (schema === null) {
      return null;
    } else if (Array.isArray(schema)) {
      return validateArray(schema, data, path, rootData);
    } else if (schema[$k.type]) {
      type = schema[$k.type];
      if (type == 'dynamic') {
        validator = schema[$k.validator];
        if (typeof validator != 'function') {
          throw new Error(ERR_TITLE + $k.validator + ' function not defined in validator type. path: ' + path);
        }
        return validator({
          value: data,
          path: path,
          rootValue: rootData,
          getValueByPath: function (relPath) {
            return getValueByPath(rootData, relPath, path);
          }
        });
      } else if (type == 'array') {
        return validateArray(schema, data, path, rootData);
      } else if (type == 'object') {
        return validateObject(schema, data, path, rootData);
      } else if (type == 'string') {
        return validateString(schema, data, path, rootData);
      } else if (type == 'number') {
        return validateNumber(schema, data, path, rootData);
      } else if (type == 'boolean') {
        return validateBoolean(schema, data, path, rootData);
      } else {
        throw new Error(ERR_TITLE + 'invalid schema ' + $k.type + ' ' + type + ', must be one of ' + TYPES.join(', ') + '. path: ' + path);
      }
    } else {
      return validateObject(schema, data, path, rootData);
    }
  } else if (type == 'string') {
    return validateString(schema, data, path, rootData);
  } else if (type == 'number') {
    return validateNumber(schema, data, path, rootData);
  } else if (type == 'boolean') {
    return validateBoolean(schema, data, path, rootData);
  } else {
    throw new Error(ERR_TITLE + 'invalid schema type ' + type + ', must be one of ' + TYPES.join(', ') + '. path: ' + path);
  }
}

function setKeyWordsPrefix(prefix) {
  KEY_WORDS.forEach(function (v) {
    $k[v] = prefix + v;
  });
}

setKeyWordsPrefix('$');

module.exports = {
  validate: validate,
  setKeyWordsPrefix: setKeyWordsPrefix
};

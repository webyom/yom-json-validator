var ERR_TITLE = 'yom-json-validator: ';
var KEY_WORDS = ['type', 'nullable', 'default', 'set', 'max', 'min', 'maxLength', 'minLength', 'item', 'value'];
var TYPES = ['array', 'object', 'string', 'number', 'boolean'];

var $k = {};

function validateArray(scheme, data, path) {
  var itemScheme;
  if (Array.isArray(scheme)) {
    itemScheme = scheme[0];
    scheme = {};
  } else {
    itemScheme = scheme[$k.item];
  }
  if (itemScheme === undefined) {
    throw new Error(ERR_TITLE + 'scheme of array item must not be undefined. path: ' + path);
  }
  if (data == null) {
    if (scheme[$k.nullable]) {
      return null;
    } else {
      throw new Error(ERR_TITLE + 'array can not be null. path: ' + path);
    }
  }
  if (!Array.isArray(data)) {
    throw new Error(ERR_TITLE + 'require an array. path: ' + path);
  }
  if (scheme[$k.minLength] > 0 && data.length < scheme[$k.minLength]) {
    throw new Error(ERR_TITLE + 'require an array of min length ' + scheme[$k.minLength] + ', actual length is ' + data.length + '. path: ' + path);
  }
  if (scheme[$k.maxLength] > 0 && data.length > scheme[$k.maxLength]) {
    throw new Error(ERR_TITLE + 'require an array of max length ' + scheme[$k.maxLength] + ', actual length is ' + data.length + '. path: ' + path);
  }
  return data.map(function (item, i) {
    return validate(itemScheme, item, path + '.' + i);
  });
}

function validateObject(scheme, data, path) {
  var res = {};
  var valueScheme;
  if (scheme[$k.type]) {
    valueScheme = scheme[$k.value];
  } else {
    valueScheme = scheme;
    scheme = {};
  }
  if (data == null) {
    if (scheme[$k.nullable]) {
      return null;
    } else {
      throw new Error(ERR_TITLE + 'object can not be null. path: ' + path);
    }
  }
  if (typeof data != 'object') {
    throw new Error(ERR_TITLE + 'require an object. path: ' + path);
  }
  Object.keys(valueScheme).forEach(function (key) {
    res[key] = validate(valueScheme[key], data[key], path + '.' + key);
  });
  return res;
}

function validateString(scheme, data, path) {
  if (typeof scheme == 'string') {
    scheme = {};
  }
  if (data === undefined) {
    if (scheme[$k.default]) {
      if (typeof scheme[$k.default] == 'string') {
        return scheme[$k.default];
      } else {
        throw new Error(ERR_TITLE + 'scheme default value type not match scheme type string. path: ' + path);
      }
    } else if (scheme[$k.nullable]) {
      return null;
    } else {
      throw new Error(ERR_TITLE + 'string can not be undefined. path: ' + path);
    }
  }
  if (typeof data != 'string') {
    throw new Error(ERR_TITLE + 'require a string. path: ' + path);
  }
  var set = scheme[$k.set];
  if (Array.isArray(set) && set.length) {
    if (set.indexOf(data) === -1) {
      throw new Error(ERR_TITLE + 'string must be in value set ' + set.join(', ') + '. path: ' + path);
    }
  } else {
    if (scheme[$k.minLength] > 0 && data.length < scheme[$k.minLength]) {
      throw new Error(ERR_TITLE + 'require a string of min length ' + scheme[$k.minLength] + ', actual length is ' + data.length + '. path: ' + path);
    }
    if (scheme[$k.maxLength] > 0 && data.length > scheme[$k.maxLength]) {
      throw new Error(ERR_TITLE + 'require a string of max length ' + scheme[$k.maxLength] + ', actual length is ' + data.length + '. path: ' + path);
    }
  }
  return data;
}

function validateNumber(scheme, data, path) {
  if (typeof scheme == 'number') {
    scheme = {};
  }
  if (data === undefined) {
    if (scheme[$k.default]) {
      if (typeof scheme[$k.default] == 'number') {
        return scheme[$k.default];
      } else {
        throw new Error(ERR_TITLE + 'scheme default value type not match scheme type number. path: ' + path);
      }
    } else if (scheme[$k.nullable]) {
      return null;
    } else {
      throw new Error(ERR_TITLE + 'number can not be undefined. path: ' + path);
    }
  }
  if (typeof data != 'number') {
    throw new Error(ERR_TITLE + 'require a number. path: ' + path);
  }
  var set = scheme[$k.set];
  if (Array.isArray(set) && set.length) {
    if (set.indexOf(data) === -1) {
      throw new Error(ERR_TITLE + 'number must be in value set ' + set.join(', ') + '. path: ' + path);
    }
  } else {
    if (typeof scheme[$k.min] == 'number' && data < scheme[$k.min]) {
      throw new Error(ERR_TITLE + 'require a number of min value ' + scheme[$k.minLength] + ', actual value is ' + data + '. path: ' + path);
    }
    if (typeof scheme[$k.max] == 'number' && data > scheme[$k.max]) {
      throw new Error(ERR_TITLE + 'require a number of max value ' + scheme[$k.minLength] + ', actual value is ' + data + '. path: ' + path);
    }
  }
  return data;
}

function validateBoolean(scheme, data, path) {
  if (typeof scheme == 'boolean') {
    scheme = {};
  }
  if (data === undefined) {
    if (scheme[$k.default]) {
      if (typeof scheme[$k.default] == 'boolean') {
        return scheme[$k.default];
      } else {
        throw new Error(ERR_TITLE + 'scheme default value type not match scheme type boolean. path: ' + path);
      }
    } else if (scheme[$k.nullable]) {
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

function validate(scheme, data, path) {
  path = path || 'root';
  var type = typeof scheme;
  var res;
  if (type == 'undefined') {
    throw new Error(ERR_TITLE + 'scheme must not be undefined. path: ' + path);
  }
  if (type == 'object') {
    if (scheme === null) {
      return null;
    } else if (Array.isArray(scheme)) {
      return validateArray(scheme, data, path);
    } else if (scheme[$k.type]) {
      type = scheme[$k.type];
      if (type == 'array') {
        return validateArray(scheme, data, path);
      } else if (type == 'object') {
        return validateObject(scheme, data, path);
      } else if (type == 'string') {
        return validateString(scheme, data, path);
      } else if (type == 'number') {
        return validateNumber(scheme, data, path);
      } else if (type == 'boolean') {
        return validateBoolean(scheme, data, path);
      } else {
        throw new Error(ERR_TITLE + 'invalid scheme ' + $k.type + ' ' + type + ', must be one of ' + TYPES.join(', ') + '. path: ' + path);
      }
    } else {
      return validateObject(scheme, data, path);
    }
  } else if (type == 'string') {
    return validateString(scheme, data, path);
  } else if (type == 'number') {
    return validateNumber(scheme, data, path);
  } else if (type == 'boolean') {
    return validateBoolean(scheme, data, path);
  } else {
    throw new Error(ERR_TITLE + 'invalid scheme type ' + type + ', must be one of ' + TYPES.join(', ') + '. path: ' + path);
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
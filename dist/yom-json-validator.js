(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["YomJsonValidator"] = factory();
	else
		root["YomJsonValidator"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

var ERR_TITLE = 'yom-json-validator: ';
var KEY_WORDS = ['type', 'nullable', 'default', 'set', 'max', 'min', 'maxLength', 'minLength', 'item', 'value'];
var TYPES = ['array', 'object', 'string', 'number', 'boolean'];

var $k = {};

function validateArray(scheme, data, path) {
  var itemScheme;
  var oScheme = scheme;
  if (Array.isArray(scheme)) {
    itemScheme = scheme[0];
    scheme = {};
    scheme[$k.nullable] = oScheme[1] === null;
  } else {
    itemScheme = scheme[$k.item];
  }
  if (itemScheme == null) {
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
  var oScheme = scheme;
  if (typeof scheme == 'string') {
    scheme = {};
    scheme[$k.nullable] = oScheme === '';
  }
  if (data == null) {
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
  var oScheme = scheme;
  if (typeof scheme == 'number') {
    scheme = {};
    scheme[$k.nullable] = oScheme === 0;
  }
  if (data == null) {
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
  var oScheme = scheme;
  if (typeof scheme == 'boolean') {
    scheme = {};
    scheme[$k.nullable] = oScheme === false;
  }
  if (data == null) {
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


/***/ })
/******/ ]);
});
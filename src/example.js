var YomJsonValidator = require('./yom-json-validator');

var schema = {
  type: {
    $type: 'string',
    $set: ['success', 'error'],
    $default: 'success',
    $nullable: false
  },
  data: {
    $type: 'array',
    $nullable: false,
    $minLength: 0,
    $maxLength: 100,
    $item: {
      $type: 'object',
      $nullable: false,
      $value: {
        firstName: '1', // not nullable
        lastName: '', // nullable
        fullName: {
          $type: 'validator',
          $validator: function (opt) {
            return opt.value || opt.getValueByPath('./firstName') + ' ' + opt.getValueByPath('./lastName');
          }
        },
        title: {
          $type: 'string',
          $minLength: 1,
          $maxLength: 20,
          $default: 'manager'
        },
        height: 0, // nullable
        class: 1, // not nullable
        grade: {
          $type: 'number',
          $set: [1, 2, 3],
          $nullable: true
        },
        age: {
          $type: 'number',
          $min: 1,
          $max: 150,
          $default: 1
        },
        vip: false, // nullable
        member: true, // not nullable
        admin: {
          $type: 'boolean',
          $default: false,
          $nullable: false
        },
        skills: ['', null], // nullable
        hobbits: [''], // not nullable
        relatives: [{
          name: ''
        }]
      }
    }
  }
};

var data = {
  type: 'success',
  data: [{
    firstName: 'Gary',
    lastName: 'Wang',
    class: 1,
    member: true,
    admin: false,
    hobbits: [],
    relatives: [],
    some: '',
    other: 1
  }, {
    firstName: 'Jack',
    lastName: 'Li',
    fullName: 'Jack',
    class: 1,
    member: true,
    admin: false,
    hobbits: [],
    relatives: [],
    some: '',
    other: 1
  }]
};

console.log(YomJsonValidator.validate(schema, data));

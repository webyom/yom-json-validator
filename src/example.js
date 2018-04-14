var scheme = {
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
        nick: '', // nullable
        name: '1', // not nullable
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
    name: 'Gary',
    class: 1,
    member: true,
    admin: false,
    hobbits: [],
    relatives: [],
    some: '',
    other: 1
  }]
};

module.exports = {
  scheme: scheme,
  data: data
};

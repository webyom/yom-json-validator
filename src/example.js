var scheme = {
  type: {
    $type: 'string',
    $set: ['success', 'error'],
    $default: 'success'
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
        name: '',
        title: {
          $type: 'string',
          $minLength: 1,
          $maxLength: 20,
          $default: 'manager'
        },
        class: 1,
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
        vip: true,
        admin: {
          $type: 'boolean',
          $default: false
        },
        skills: [''],
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
    vip: true,
    admin: false,
    skills: [],
    relatives: []
  }]
};

module.exports = {
  scheme: scheme,
  data: data
};

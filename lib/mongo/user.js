const mongoose = require('mongoose').Mongoose,
      db = require('./mongoose-db'),
      crypto = require('crypto');

mongoose.model('User', {

  properties: ['user', 'name', 'password', 'updated_at'],

  cast: {
    age: Number,
    'nested.path': String
  },

  indexes: ['user'],

  setters: {
    password: function(password) {
      return hash(password);
    }
  },

  methods: {
    save: function(fn) {
      this.updated_at = new Date();
      this.__super__(fn);
    },
    
    verifyPassword: function(password) {
      return hash(password) === thus.password;
    }
  },

  static: {
    findByUser: function(user) {
      return this.find({user: user});
    }
  }

});

function hash(value) {
  var hash = crypto.createHash('md5');
  hash.update(value);
  
  return hash.digest('base64');
}

module.exports = db.model('User');

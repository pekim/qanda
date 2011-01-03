const mongoose = require('mongoose').Mongoose,
      db = require('./mongoose-db'),
      crypto = require('crypto');

mongoose.model('User', {

  properties: ['user', 'name', 'salt', 'password', 'created_at', 'authenticated_at', 'updated_at'],

  cast: {
    age: Number,
    'nested.path': String
  },

  indexes: ['user'],

  setters: {
    password: function(password) {
      return hash(this.salt, password);
    }
  },

  methods: {
    save: function(fn) {
      if (!this.created_at) {
        this.created_at = new Date();
      }
      
      this.updated_at = new Date();
      this.__super__(fn);
    },
    
    verifyPassword: function(password) {
      return hash(this.salt, password) === this.password;
    },
    
    authenticated: function() {
      this.authenticated_at = new Date();
    }
  },

  static: {
    findByUser: function(user, callback) {
      this.find({user: user}).exec().first(callback);
    },
    
    allUsers: function(callback) {
      this.find().sort('user').exec().all(callback);
    }
  }
});

function hash(salt, value) {
  var hash = crypto.createHash('md5');
  hash.update(salt);
  hash.update(value);
  
  return hash.digest('base64');
}

module.exports = db.model('User');

const mongoose = require('mongoose').Mongoose,
      db = require('./mongoose-db');

mongoose.model('User', {

  properties: ['user', 'name', 'password', 'updated_at'],

  cast: {
    age: Number,
    'nested.path': String
  },

  indexes: ['user'],

  methods: {
      save: function(fn){
          this.updated_at = new Date();
          this.__super__(fn);
      }
  },

  static: {
      findByUser: function(user){
          return this.find({user: user});
      }
  }

});

module.exports = db.model('User');

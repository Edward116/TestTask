const {Schema, model} = require('mongoose')

const schema = new Schema({
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  isAdmin: {type: Boolean},
  fullName: {type: String, required: true},
  city: {type: String, required: true},
  dateOfBirth: {type: Date}

})

module.exports = model('User', schema)

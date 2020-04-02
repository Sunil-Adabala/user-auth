//file for database

var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose")

var UserSchema = new mongoose.Schema({
  username:String,
  password:String
});

UserSchema.plugin(passportLocalMongoose) // add packages from passportLocalMongoose to UserSchema

module.exports = mongoose.model("User",UserSchema) //return User model

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var moment= require('moment');
var AuthorSchema = new Schema(
  {
    first_name: {type: String, required: true, max: 100},
    family_name: {type: String, required: true, max: 100},
    date_of_birth: {type: Date},
    date_of_death: {type: Date},
  }
);

// Virtual for author's full name
AuthorSchema
.virtual('name')
.get(function () {

// To avoid errors in cases where an author does not have either a family name or first name
// We want to make sure we handle the exception by returning an empty string for that case

  var fullname = '';
  if (this.first_name && this.family_name) {
    fullname = this.family_name + ', ' + this.first_name
  }
  if (!this.first_name || !this.family_name) {
    fullname = '';
  }

  return fullname;
});

// Virtual for author's lifespan
AuthorSchema
.virtual('lifespan')
.get(function () {
  return this.date_of_death && this.date_of_birth? moment(this.date_of_birth).format('MMMM Do, YYYY') + " - " + moment(this.date_of_death).format('MMMM Do, YYYY') : this.date_of_birth ? "Born " + moment(this.date_of_birth).format('MMMM Do, YYYY')  :"N/A";
//making sure only values that we have display -moment sets ones we dont have as todays date which  makes it seem like they all died today

  //return moment(this.date_of_birth).format('MMMM Do, YYYY') + " to " + moment(this.date_of_death).format('MMMM Do, YYYY');

});

// Virtual for author's URL
AuthorSchema
.virtual('url')
.get(function () {
  return '/catalog/author/' + this._id;//lmao url was wrong scared me
});

//virtual for using moment format for book form so that the dates actually show up
AuthorSchema
.virtual('momentDoB')
.get(function () {
   if(this.date_of_birth!=null){
    return moment(this.date_of_birth).format('YYYY-MM-DD');
}
});

AuthorSchema
.virtual('momentDoD')
.get(function () {
   if(this.date_of_death!=null){
    return moment(this.date_of_death).format('YYYY-MM-DD');
}
});
//Export model
module.exports = mongoose.model('Author', AuthorSchema);
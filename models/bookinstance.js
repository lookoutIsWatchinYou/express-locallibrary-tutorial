var mongoose = require('mongoose');
var moment = require('moment');

var Schema = mongoose.Schema;

var BookInstanceSchema = new Schema(
  {
    book: { type: Schema.Types.ObjectId, ref: 'Book', required: true }, //reference to the associated book
    imprint: {type: String, required: true},
    status: {type: String, required: true, enum: ['Available', 'Maintenance', 'Loaned', 'Reserved'], default: 'Maintenance'},
    due_back: {type: Date, default: Date.now}
  }
);

// Virtual for bookinstance's URL
BookInstanceSchema
.virtual('url')
.get(function () {
  return '/catalog/bookinstance/' + this._id;//forgot to add this and i also added an s ont the end when I did  lmao
});


BookInstanceSchema
.virtual('dueBack')
.get(function () {
  if(this.due_back!=null){

  return moment(this.due_back).format('YYYY-MM-DD');

}});


//Export model
module.exports = mongoose.model('BookInstance', BookInstanceSchema);
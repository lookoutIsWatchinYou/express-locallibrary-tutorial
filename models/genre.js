var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var GenreSchema = new Schema(
{
    name:{type: String,required:true, min:3,max:100},
    
}


);
//virtual url
GenreSchema
.virtual('url')
.get(function(){
    return '/catalog/genre/' + this.id;
})

//the export module
module.exports = mongoose.model('Genre',GenreSchema);//!no capital letter meant it couldnt find the schema lmao
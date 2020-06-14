const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/skillchain?retryWrites=true&w=majority',{useNewUrlParser: true})
var conn=mongoose.Collection;

var uploadschema=new mongoose.Schema({
    imagename: String,

})

var uploadModal = mongoose.model('uploadimage',uploadschema);
module.exports=uploadModal;